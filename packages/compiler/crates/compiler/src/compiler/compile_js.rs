use std::path::Path;
use std::sync::{Arc, Mutex};
use swc_core::common;
use swc_core::common::comments;
use swc_core::common::errors;
use swc_core::common::{sync::Lrc, FileName, Globals, SourceMap};
use swc_core::ecma::ast;
use swc_core::ecma::codegen;
use swc_core::ecma::codegen::text_writer::JsWriter;
use swc_core::ecma::parser::lexer::Lexer;
use swc_core::ecma::parser::{EsConfig, Parser, StringInput, Syntax, TsConfig};
use swc_core::ecma::transforms::base::{fixer, hygiene, resolver};
use swc_core::ecma::visit::FoldWith;

use crate::error;

#[derive(Debug, Clone, Default)]
pub struct ErrorBuffer(Arc<Mutex<Vec<errors::Diagnostic>>>);

impl errors::Emitter for ErrorBuffer {
    fn emit(&mut self, diagnostic: &errors::DiagnosticBuilder) {
        let mut diagnostics = self.0.lock().unwrap();
        diagnostics.push((**diagnostic).clone());
    }
}

pub struct Input<'a> {
    pub code: String,
    pub filename: &'a String,
}

pub struct Output {
    pub code: String,
    pub map: String,
}

pub fn compile<F>(input: Input, mut transform_module: F) -> Result<Output, error::Error>
where
    F: FnMut((ast::Module, common::Mark)) -> ast::Module,
{
    let code = input.code;
    let path = Path::new(&input.filename);
    let filename = FileName::Real(path.to_path_buf());

    let (is_ts, is_jsx) = parse_file_extension(path);

    let source_map = Lrc::new(SourceMap::default());
    let source_file = source_map.new_source_file(filename, code);
    let comments = comments::SingleThreadedComments::default();

    let syntax = if is_ts {
        Syntax::Typescript(TsConfig {
            tsx: is_jsx,
            ..Default::default()
        })
    } else {
        Syntax::Es(EsConfig {
            jsx: is_jsx,
            ..Default::default()
        })
    };

    let lexer = Lexer::new(
        syntax,
        ast::EsVersion::latest(),
        StringInput::from(&*source_file),
        Some(&comments),
    );

    let mut parser = Parser::new_from(lexer);

    let module = parser.parse_module();

    match module {
        Ok(module) => {
            let error_buffer = ErrorBuffer::default();

            let handler =
                errors::Handler::with_emitter(true, false, Box::new(error_buffer.clone()));

            common::GLOBALS.set(&Globals::new(), || {
                errors::HANDLER.set(&handler, || {
                    let mut module = module;

                    let top_level_mark = common::Mark::new();
                    let unresolved_mark = common::Mark::new();

                    module =
                        module.fold_with(&mut resolver(unresolved_mark, top_level_mark, is_ts));

                    module = transform_module((module, top_level_mark));

                    module = module.fold_with(&mut hygiene::hygiene_with_config(hygiene::Config {
                        top_level_mark,
                        ..Default::default()
                    }));

                    module = module.fold_with(&mut fixer::fixer(Some(&comments)));

                    let mut wr_buf = Vec::new();
                    let mut src_map_buf = Vec::new();
                    let mut mapping_buf = Vec::new();

                    let mut emitter = codegen::Emitter {
                        cfg: codegen::Config {
                            minify: false,
                            target: ast::EsVersion::latest(),
                            ascii_only: false,
                            omit_last_semi: false,
                        },
                        comments: Some(&comments),
                        cm: Lrc::clone(&source_map),
                        wr: Box::new(JsWriter::new(
                            Lrc::clone(&source_map),
                            "\n",
                            &mut wr_buf,
                            Some(&mut mapping_buf),
                        )),
                    };

                    let _ = emitter.emit_module(&module);
                    let source_map = source_map.build_source_map(&mapping_buf);
                    let _ = source_map.to_writer(&mut src_map_buf);

                    let code = String::from_utf8(wr_buf).unwrap();
                    let source_map = String::from_utf8(src_map_buf).unwrap();

                    let errors = handle_error(&error_buffer);

                    if errors.is_empty() {
                        Ok(Output {
                            code,
                            map: source_map,
                        })
                    } else {
                        Err(error::Error { errors })
                    }
                })
            })
        }
        Err(err) => {
            let error_buffer = ErrorBuffer::default();
            let handler =
                errors::Handler::with_emitter(true, false, Box::new(error_buffer.clone()));
            err.into_diagnostic(&handler).emit();

            let errors = handle_error(&error_buffer);
            Err(error::Error { errors })
        }
    }
}

/// (is_ts, is_jsx)
fn parse_file_extension(path: &Path) -> (bool, bool) {
    if let Some(extension) = path.extension() {
        if let Some(extension_str) = extension.to_str() {
            match extension_str {
                "js" => return (false, false),
                "ts" => return (true, false),
                "jsx" => return (false, true),
                "tsx" => return (true, true),
                _ => return (true, true),
            }
        }
    }
    (true, true)
}

fn handle_error(error_buffer: &ErrorBuffer) -> Vec<error::Diagnostic> {
    let diagnostics = error_buffer.0.lock().unwrap();

    diagnostics
        .iter()
        .map(|diagnostic| error::Diagnostic {
            message: diagnostic.message(),
        })
        .collect()
}
