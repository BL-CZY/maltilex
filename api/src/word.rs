use std::str::FromStr;

use axum::{extract::Path, Json};
use mongodb::{
    bson::{doc, oid::ObjectId, Document},
    Collection, Database,
};
use serde::Serialize;

use crate::db::CLIENT;

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
                word: Some(doc),
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
