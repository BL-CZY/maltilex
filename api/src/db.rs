use postgrest::Postgrest;
use serde_json::{Map, Value};
use thiserror::Error;
use tokio::sync::OnceCell;

#[derive(Debug)]
pub struct Word {
    pub id: u64,
    pub word: String,
    pub pos: String,
    /// [maltese tokens, english tokens]
    pub tokens: [Vec<String>; 2],
    pub en_display: Vec<String>,
}

// TOKENS[0] is Maltese
// TOKENS[1] is English
pub static WORDS: OnceCell<Vec<Word>> = OnceCell::const_new();

pub fn get_client() -> Postgrest {
    use std::env::var;
    Postgrest::new(var("SUPABASE_URL").unwrap())
        .insert_header("apikey", var("SUPABASE_ANON_PUBLIC").unwrap())
        .insert_header(
            "Authorization",
            format!("Bearer {}", var("SUPABASE_SERVICE_ROLE").unwrap()),
        )
}

#[derive(Error, Debug)]
enum ParseError {
    #[error("Cannot find the value by the key {key:?}")]
    CannotFindValue { key: String },
    #[error("It's not an array")]
    NotAnArray,
}

fn parse_array(
    obj: &Map<String, Value>,
    key: &str,
) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    if let Some(Value::Array(vals)) = obj.get(key) {
        Ok(vals
            .iter()
            .filter_map(|val| {
                if let Value::String(str) = val {
                    Some(str.to_string())
                } else {
                    None
                }
            })
            .collect())
    } else {
        Err(Box::new(ParseError::NotAnArray))
    }
}

fn parse_obj(
    obj: &Map<String, Value>,
) -> Result<Word, Box<dyn std::error::Error>> {
    let id = if let Some(Value::Number(num)) = obj.get("id") {
        num.as_u64().unwrap()
    } else {
        return Err(Box::new(ParseError::CannotFindValue { key: "id".into() }));
    };

    let word = if let Some(Value::String(str)) = obj.get("w") {
        str.to_string()
    } else {
        return Err(Box::new(ParseError::CannotFindValue { key: "w".into() }));
    };

    let pos = if let Some(Value::String(str)) = obj.get("p") {
        str.to_string()
    } else {
        return Err(Box::new(ParseError::CannotFindValue { key: "w".into() }));
    };

    let mt_tokens = parse_array(obj, "mt")?;
    let en_tokens = parse_array(obj, "et")?;
    let en_display = parse_array(obj, "ed")?;

    let en_display = if en_display.len() > 2 {
        let mut res: Vec<String> =
            en_display.iter().take(2).map(|e| e.to_string()).collect();
        res.push("...".into());
        res
    } else {
        en_display
    };

    Ok(Word {
        id,
        word,
        pos,
        tokens: [mt_tokens, en_tokens],
        en_display,
    })
}

pub async fn init() {
    println!("Loading words...");
    let raw_result = get_client()
        .from("words")
        .select("*")
        .execute()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    let json: Value = serde_json::from_str(&raw_result).unwrap();
    let mut result = vec![];

    if let Value::Array(objs) = json {
        objs.iter().for_each(|ele| {
            if let Value::Object(obj) = ele {
                result.push(parse_obj(obj).unwrap());
            }
        });
    } else {
        panic!("Text returned is not an array")
    }

    WORDS.set(result).unwrap();
}
