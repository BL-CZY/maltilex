use std::{collections::HashMap, str::FromStr};

use axum::{extract::Path, Json};
use lazy_static::lazy_static;
use mongodb::{
    bson::{doc, oid::ObjectId, Bson, Document},
    Collection, Database,
};
use serde::Serialize;

use crate::db::CLIENT;

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
            ("n", "num"),
            ("g", "gender"),
            ("p", "part_of_speech"),
            ("s", "subject"),
            ("o", "object"),
            ("on", "object_number"),
            ("og", "object_gender"),
            ("io", "indirect_object"),
            ("ion", "indirect_object_number"),
            ("iog", "indirect_object_gender"),
            ("t", "tense"),
        ]
        .into_iter()
        .map(|s| (s.0.to_string(), s.1.to_string()))
        .collect()
    };
    static ref FORM_VAL_TABLE: HashMap<String, String> = {
        [
            ("sg", "singular"),
            ("pl", "plural"),
            ("m", "male"),
            ("f", "female"),
            ("p", "perfect"),
            ("ip", "imperfect"),
            ("im", "imperative"),
            ("pa", "passive"),
        ]
        .into_iter()
        .map(|s| (s.0.to_string(), s.1.to_string()))
        .collect()
    };
}

fn expand_word(mut doc: Document) -> Document {
    if let Ok(arr) = doc.get_array_mut("f") {
        arr.iter_mut().for_each(|d| {
            if let Some(form) = d.as_document_mut() {
                // set values
                form.iter_mut().for_each(|(k, v)| {
                    if k == "w" || k == "ph" || k == "en" {
                        return;
                    }

                    if let Some(a) = v.as_array_mut() {
                        a.iter_mut().for_each(|ele| {
                            if let Bson::String(field) = ele {
                                if let Some(val) = FORM_VAL_TABLE.get(field) {
                                    *ele = Bson::String(val.clone());
                                }
                            }
                        });
                    }
                });

                // set keys
                FORM_KEYS_TABLE.iter().for_each(|(key, replace)| {
                    if let Some(b) = form.get(key) {
                        form.insert(replace, b.clone());
                        form.remove(key);
                    }
                });
            }
        });
    }

    WORD_KEYS_TABLE.iter().for_each(|(key, replace)| {
        if let Some(b) = doc.get(key) {
            doc.insert(replace, b.clone());
            doc.remove(key);
        }
    });

    doc
}

pub async fn get_word(Path(str): Path<String>) -> Json<WordResult> {
    let id = if let Ok(id) = ObjectId::from_str(&str) {
        id
    } else {
        return Json(WordResult {
            error: Some("Cannot parse id".to_string()),
            word: None,
        });
    };

    let db: Database = CLIENT.get().unwrap().database("local");
    let col: Collection<Document> = db.collection("words");

    match col.find_one(doc! {"_id": id}).await {
        Ok(Some(mut doc)) => {
            doc.remove("mt_tokens");
            doc.remove("en_tokens");

            Json(WordResult {
                error: None,
                word: Some(expand_word(doc)),
            })
        }
        _ => Json(WordResult {
            error: Some("Cannot find word".to_string()),
            word: None,
        }),
    }
}

#[derive(Serialize, Clone)]
pub struct WordResult {
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    word: Option<Document>,
}
