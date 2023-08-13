use murmur3::murmur3_32;
use std::io;

pub fn generate_hash<T: AsRef<[u8]>>(value: &T) -> Result<String, io::Error> {
    let hash = murmur3_32(&mut io::Cursor::new(value), 0)?;
    Ok(if hash == 0 {
        "".to_string()
    } else {
        to_alphabet(hash as usize)
    })
}

const ALPHABET: &[u8] = b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

fn to_alphabet(mut value: usize) -> String {
    let mut result = Vec::new();

    loop {
        result.push(ALPHABET[value % ALPHABET.len()]);
        value /= ALPHABET.len();

        if value == 0 {
            break;
        }
    }

    result.reverse();
    String::from_utf8(result).unwrap()
}

#[cfg(test)]
mod tests {
    use super::{generate_hash, to_alphabet};

    #[test]
    fn to_alphabet_base() {
        assert_eq!(to_alphabet(0), "a".to_string());
        assert_eq!(
            to_alphabet(18446744073709551615),
            "cxFMKcQbCDip".to_string()
        );
    }

    #[test]
    fn generate_hash_base() {
        assert_eq!(generate_hash(&"").unwrap(), "".to_string());
        assert_eq!(generate_hash(&"color: red").unwrap(), "kYzJhn".to_string());
    }
}
