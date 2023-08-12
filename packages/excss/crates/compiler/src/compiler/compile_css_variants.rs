use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Deserialize, Serialize)]
#[serde(untagged)]
pub enum VariantValue {
    Str(String),
    Num(usize),
}

pub type Variants = BTreeMap<String, VariantValue>;

pub fn compile(variants: &Variants) -> String {
    variants
        .iter()
        .map(|(k, v)| {
            let v = match v {
                VariantValue::Str(v) => v.clone(),
                VariantValue::Num(v) => v.to_string(),
            };
            format!("${}:{};", k, &v)
        })
        .collect::<Vec<_>>()
        .join("")
}
