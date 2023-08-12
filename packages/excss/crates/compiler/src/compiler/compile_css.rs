use std::error::Error;
use std::io;

use crate::hash::generate_hash;

const CLASS_NAME_HASH: &str = "__EX_CSS_CLASS_NAME_HASH__";

#[derive(PartialEq, Debug)]
pub struct Output {
    pub css: String,
    pub class_name: String,
}

pub fn compile<T: Into<String>>(input: T, inject: T) -> Result<Output, Box<dyn Error>> {
    let input = input.into();
    let inject = inject.into();

    let result = grass::from_string(
        format!("{}.{}{{{}}}", &inject, CLASS_NAME_HASH, &input),
        &grass::Options::default().input_syntax(grass::InputSyntax::Scss),
    );

    match result {
        Ok(css) => {
            let class_name = generate_hash(&css)?;

            Ok(Output {
                css: css.replace(CLASS_NAME_HASH, &class_name),
                class_name,
            })
        }
        Err(err) => Err(Box::new(handle_error(*err))),
    }
}

fn handle_error(err: grass::Error) -> io::Error {
    match err.kind() {
        grass::ErrorKind::ParseError {
            message,
            loc: _,
            unicode: _,
        } => io::Error::new(io::ErrorKind::Other, message),
        grass::ErrorKind::IoError(err) => io::Error::new(io::ErrorKind::Other, err),
        grass::ErrorKind::FromUtf8Error(err) => io::Error::new(io::ErrorKind::Other, err),
        _ => io::Error::new(io::ErrorKind::Other, "Could not compile CSS."),
    }
}

#[cfg(test)]
mod tests {
    use super::{compile, Output};

    #[test]
    fn base() {
        let code = "color: red;";
        let output = compile(code, "").unwrap();
        assert_eq!(
            output,
            Output {
                css: ".eJbwPJ {\n  color: red;\n}\n".to_string(),
                class_name: "eJbwPJ".to_string(),
            }
        );
    }

    #[test]
    fn error() {
        let code = "color: $red;";
        let error = compile(code, "").unwrap_err();
        assert_eq!(error.to_string(), "Undefined variable.");
    }
}
