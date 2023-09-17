use serde::{Deserialize, Serialize};
use swc_core::ecma::visit::VisitMutWith;

use super::{
    compiler::compile_js, error, hash::generate_hash, visitor::transform_visitor::TransformVisitor,
};

const IMPORT_SOURCE: &str = "excss";
const IMPORT_CSS_IDENT: &str = "css";
const IMPORT_FILE_ID_IDENT: &str = "FILE_ID";
const CSS_FILE_ID_VARIANT: &str = "FILE_ID";
const DEFAULT_FILE_ID: &str = "unknown";

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub filename: String,
    pub file_id: Option<String>,
    pub helper: Option<String>,
}

#[derive(Deserialize, Serialize)]
pub struct Output {
    pub code: String,
    pub map: String,
    pub css: String,
}

pub fn transform(code: String, config: Config) -> Result<Output, error::Error> {
    let file_id =
        generate_hash(&config.file_id.unwrap_or(DEFAULT_FILE_ID.to_string())).map_err(|err| {
            error::Error {
                errors: vec![error::Diagnostic {
                    message: err.to_string(),
                }],
            }
        })?;

    let mut css = String::new();

    let helper_file_id = format!("${}:{};", &CSS_FILE_ID_VARIANT, &file_id);

    let helper_css = format!(
        "{}\n{}",
        &helper_file_id,
        config.helper.unwrap_or(String::new())
    );

    let import_source = &IMPORT_SOURCE.to_string();
    let import_css_ident = &IMPORT_CSS_IDENT.to_string();
    let import_file_id_ident = &IMPORT_FILE_ID_IDENT.to_string();

    let compile_input = compile_js::Input {
        code,
        filename: &config.filename,
    };

    let result = compile_js::compile(compile_input, |(module, _)| {
        let mut module = module;

        let mut transform_visitor = TransformVisitor::new(
            import_source,
            import_css_ident,
            import_file_id_ident,
            &file_id,
            &helper_css,
        );

        module.visit_mut_with(&mut transform_visitor);

        css = transform_visitor.get_css();

        module
    });

    match result {
        Ok(result) => Ok(Output {
            code: result.code,
            map: result.map,
            css,
        }),
        Err(err) => Err(error::Error { errors: err.errors }),
    }
}
