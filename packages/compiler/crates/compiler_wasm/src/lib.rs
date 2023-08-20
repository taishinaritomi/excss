use excss_compiler::{error, transform};
use serde::{Deserialize, Serialize};
use std::panic;
use wasm_bindgen::prelude::*;

extern crate console_error_panic_hook;

#[wasm_bindgen(typescript_custom_section)]
const TYPES: &'static str = r#"
export type Config = {
    filename: string;
    inject?: string | undefined;
    variants?: Record<string, string | number> | undefined;
}

export type Result = {
    type: 'Ok';
    code: string;
    map: string;
    css: string;
} | {
    type: 'Err';
    errors: Array<{
        message: string
    }>
};

export function transform(code: string, config: Config): Result;

export type Variants = Record<string, string | number>;
"#;

#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TransformResult {
    Ok(transform::Output),
    Err(error::Error),
}

#[wasm_bindgen(js_name = transform, skip_typescript)]
pub fn transform(code: JsValue, config: JsValue) -> Result<JsValue, JsValue> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    let code = serde_wasm_bindgen::from_value::<String>(code)?;
    let config = serde_wasm_bindgen::from_value::<transform::Config>(config)?;

    let result = match transform::transform(code, config) {
        Ok(output) => TransformResult::Ok(output),
        Err(err) => TransformResult::Err(err),
    };

    Ok(serde_wasm_bindgen::to_value(&result)?)
}
