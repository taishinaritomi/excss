use serde::{Deserialize, Serialize};
use std::{collections::BTreeMap, fmt};

#[derive(Deserialize, Serialize)]
#[serde(untagged)]
pub enum VariantValue {
    Str(String),
    Num(usize),
}

impl fmt::Display for VariantValue {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "{}",
            match self {
                VariantValue::Str(s) => s.clone(),
                VariantValue::Num(n) => n.to_string(),
            }
        )
    }
}

pub type Variants = BTreeMap<String, VariantValue>;

pub fn compile(variants: &Variants) -> String {
    variants
        .iter()
        .map(|(k, v)| format!("${}:{};", k, v))
        .collect::<Vec<_>>()
        .join("")
}

#[cfg(test)]
mod tests {
    use std::collections::BTreeMap;

    use super::{compile, VariantValue};

    #[test]
    fn base() {
        let mut variants = BTreeMap::new();
        variants.insert("primary".to_string(), VariantValue::Str("red".to_string()));
        variants.insert("space".to_string(), VariantValue::Num(10));
        assert_eq!(compile(&variants), "$primary:red;$space:10;".to_string());
    }
}
