use serde::{Deserialize, Serialize};
use swc_core::ecma::visit::VisitMutWith;

use super::{
    compiler::{compile_css_variants, compile_js},
    error,
    hash::generate_hash,
    visitor::transform_visitor::TransformVisitor,
};

const IMPORT_SOURCE: &str = "excss";
const IMPORT_CSS_IDENT: &str = "css";
const IMPORT_FILE_HASH_IDENT: &str = "fileHash";
const CSS_FILE_HASH_VARIANT: &str = "file-hash";
const CSS_BLOCK_HASH_VARIANT: &str = "block-hash";

#[derive(Deserialize, Serialize)]
pub struct Config {
    pub filename: String,
    #[serde(alias = "inject")]
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
    let mut css = String::new();

    let file_hash = &match generate_hash(&config.filename) {
        Ok(hash) => hash,
        Err(_) => "".to_string(),
    };

    let inject_variants = match config.variants {
        Some(variants) => compile_css_variants::compile(&variants),
        None => "".to_string(),
    };

    let input_inject = config.inject.unwrap_or("".to_string());

    let inject_css = format!("{}\n{}", inject_variants, input_inject);

    let import_source = &IMPORT_SOURCE.to_string();
    let import_css_ident = &IMPORT_CSS_IDENT.to_string();
    let import_file_hash_ident = &IMPORT_FILE_HASH_IDENT.to_string();
    let css_file_hash_variant = &CSS_FILE_HASH_VARIANT.to_string();
    let css_block_hash_variant = &CSS_BLOCK_HASH_VARIANT.to_string();

    let compile_input = compile_js::Input {
        code,
        filename: &config.filename,
    };

    let result = compile_js::compile(compile_input, |(module, _)| {
        let mut module = module;

        let mut transform_visitor = TransformVisitor::new(
            import_source,
            import_css_ident,
            import_file_hash_ident,
            css_file_hash_variant,
            css_block_hash_variant,
            file_hash,
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
