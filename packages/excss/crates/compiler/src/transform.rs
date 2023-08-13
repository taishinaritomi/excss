use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use swc_core::ecma::visit::VisitMutWith;

use super::{
    compiler::{compile_css_variants, compile_js},
    error,
    hash::generate_hash,
    visitor::transform_visitor::TransformVisitor,
};

const IMPORT_SOURCE: &str = "excss";
const IMPORT_CSS_IDENT: &str = "css";
const IMPORT_FILE_ID_IDENT: &str = "FILE_ID";
const CSS_FILE_ID_VARIANT: &str = "FILE_ID";

#[derive(Deserialize, Serialize)]
pub struct Config {
    pub filename: String,
    pub inject: Option<String>,
    pub variants: Option<compile_css_variants::Variants>,
}

#[derive(Deserialize, Serialize)]
pub struct Output {
    pub code: String,
    pub map: String,
    pub css: String,
}

pub fn transform(code: String, config: Config) -> Result<Output, error::Error> {
    match generate_hash(&config.filename) {
        Ok(file_id) => {
            let mut css = String::new();

            let mut variants = config.variants.unwrap_or(BTreeMap::new());

            variants.insert(
                CSS_FILE_ID_VARIANT.to_string(),
                compile_css_variants::VariantValue::Str(file_id.clone()),
            );

            let inject_css = format!(
                "{}\n{}",
                compile_css_variants::compile(&variants),
                config.inject.unwrap_or(String::new())
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
                    &inject_css,
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
        Err(err) => Err(error::Error {
            errors: vec![error::Diagnostic {
                message: err.to_string(),
            }],
        }),
    }
}
