use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct Diagnostic {
    pub message: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Error {
    pub errors: Vec<Diagnostic>,
}
