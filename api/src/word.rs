use std::collections::HashMap;

use axum::{extract::Path, Json};
use lazy_static::lazy_static;
use serde::Serialize;
use serde_json::{Map, Value};

use crate::db::get_client;

lazy_static! {
    static ref WORD_KEYS_TABLE: HashMap<String, String> = {
        [
            ("w", "word"),
            ("ph", "phonetic"),
            ("p", "part_of_speech"),
            ("r", "root"),
            ("f", "forms"),
            ("ed", "en_display"),
            ("ex", "examples"),
            ("c", "contributors"),
            ("re", "related"),
        ]
        .into_iter()
        .map(|s| (s.0.to_string(), s.1.to_string()))
        .collect()
    };
    static ref FORM_KEYS_TABLE: HashMap<String, String> = {
        [
            ("w", "word"),
            ("ph", "phonetic"),
            ("en", "english"),
            ("n", "number"),
            ("g", "gender"),
            ("p", "polarity"),
            ("s", "subject"),
            ("o", "object"),
            ("on", "object_number"),
            ("og", "object_gender"),
            ("io", "indirect_object"),
            ("ion", "indirect_object_number"),
            ("iog", "indirect_object_gender"),
            ("t", "tense"),
            ("e", "extra"),
        ]
        .into_iter()
        .map(|s| (s.0.to_string(), s.1.to_string()))
        .collect()
    };
    static ref FORM_VAL_TABLE: HashMap<String, String> = {
        [
            ("sg", "singular"),
            ("pl", "plural"),
            ("bp", "bi-plural"),
            ("m", "male"),
            ("f", "female"),
            ("p", "perfect"),
            ("ip", "imperfect"),
            ("im", "imperative"),
            ("pa", "passive"),
            ("pos", "positive"),
            ("neg", "negative"),
        ]
        .into_iter()
        .map(|s| (s.0.to_string(), s.1.to_string()))
        .collect()
    };
}

fn expand_word(mut obj: Map<String, Value>) -> Map<String, Value> {
    if let Some(Value::Array(arr)) = obj.get_mut("f") {
        arr.iter_mut().for_each(|element| {
            if let Value::Object(form) = element {
                // set values
                form.iter_mut().for_each(|(k, v)| {
                    if k == "w" || k == "ph" || k == "en" {
                        return;
                    }

                    if let Value::Array(fields) = v {
                        fields.iter_mut().for_each(|ele| {
                            if let Value::String(field) = ele {
                                if let Some(val) = FORM_VAL_TABLE.get(field) {
                                    *ele = Value::String(val.to_string());
                                }
                            }
                        });
                    }
                });

                // set keys
                FORM_KEYS_TABLE.iter().for_each(|(key, replace)| {
                    if let Some(val) = form.get(key) {
                        form.insert(replace.clone(), val.clone());
                        form.remove(key);
                    }
                });
            }
        });
    }

    WORD_KEYS_TABLE.iter().for_each(|(key, replace)| {
        if let Some(val) = obj.get(key) {
            obj.insert(replace.clone(), val.clone());
            obj.remove(key);
        }
    });

    obj
}

pub async fn get_word(Path(str): Path<String>) -> Json<WordResult> {
    let id = if let Ok(id) = str.parse::<u64>() {
        id
    } else {
        return Json(WordResult {
            error: Some("Cannot parse id".to_string()),
            word: None,
        });
    };

    let client = get_client();
    let resp = client
        .from("words")
        .eq("id", id.to_string())
        .execute()
        .await;

    match resp {
        Ok(res) => match res.text().await {
            Ok(text) => {
                let arr = if let Ok(Value::Array(arr)) =
                    serde_json::from_str(&text)
                {
                    arr
                } else {
                    return Json(WordResult {
                        error: Some("Cannot parse return data".into()),
                        word: None,
                    });
                };

                if arr.is_empty() {
                    return Json(WordResult {
                        error: Some(format!("Can't find word")),
                        word: None,
                    });
                }

                let value = arr.get(0).unwrap().to_owned();

                if let Value::Object(obj) = value {
                    return Json(WordResult {
                        error: None,
                        word: Some(expand_word(obj)),
                    });
                } else {
                    return Json(WordResult {
                        error: Some(format!("Can't find word")),
                        word: None,
                    });
                }
            }
            Err(e) => {
                return Json(WordResult {
                    error: Some(format!("Error when fetching data: {}", e)),
                    word: None,
                })
            }
        },
        Err(e) => {
            return Json(WordResult {
                error: Some(format!("Error when fetching data: {}", e)),
                word: None,
            })
        }
    }
}

#[derive(Serialize, Clone)]
pub struct WordResult {
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    word: Option<Map<String, Value>>,
}
