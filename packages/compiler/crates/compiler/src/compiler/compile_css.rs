use grass_compiler::{
    sass_value::{ArgumentResult, QuoteKind, Value},
    Builtin, Visitor,
};
use scoped_tls::scoped_thread_local;
use std::io;
use std::{error::Error, sync::Mutex};

use crate::hash::generate_hash;

scoped_thread_local!(static CONTEXT: Context);

struct Context {
    count: Mutex<usize>,
    unique_salt: String,
}

impl Context {
    fn new(unique_salt: String) -> Self {
        Self {
            unique_salt,
            count: Mutex::new(0),
        }
    }

    fn get_unique_count(&self) -> usize {
        let mut count = self.count.lock().unwrap();
        *count += 1;
        *count
    }

    fn get_unique_hash(&self) -> Result<String, io::Error> {
        let count = self.get_unique_count();
        let hash_input = format!("{}+{}", self.unique_salt, count);
        generate_hash(&hash_input)
    }
}

fn unique(_: ArgumentResult, _: &mut Visitor) -> Result<Value, Box<grass_compiler::Error>> {
    let hash = CONTEXT.with(|context| context.get_unique_hash())?;
    Ok(Value::String(hash, QuoteKind::None))
}

const CLASS_NAME_HASH: &str = "__EX_CSS_CLASS_NAME_HASH__";

#[derive(PartialEq, Debug)]
pub struct Output {
    pub css: String,
    pub class_name: String,
}

pub fn compile<T: Into<String>>(
    input: T,
    helper: T,
    unique_salt: T,
) -> Result<Output, Box<dyn Error>> {
    let input = input.into();
    let helper = helper.into();
    let unique_salt: String = unique_salt.into();

    let result = CONTEXT.set(&Context::new(unique_salt), || {
        let option = grass::Options::default()
            .input_syntax(grass::InputSyntax::Scss)
            .add_custom_fn("unique", Builtin::new(unique));

        grass::from_string(
            format!("{}\n.{} {{\n{}\n}}", &helper, CLASS_NAME_HASH, &input),
            &option,
        )
    });

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
    // io::Error::new(io::ErrorKind::Other, err.to_string())
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
        let output = compile(code, "", "").unwrap();
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
        let error = compile(code, "", "").unwrap_err();
        assert_eq!(error.to_string(), "Undefined variable.");
    }
}
