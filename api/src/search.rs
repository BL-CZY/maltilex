use std::{
    collections::HashSet,
    sync::{Arc, Mutex},
};

use axum::Json;
use futures::future::join_all;
use levenshtein::levenshtein;
use mongodb::{
    bson::{doc, oid::ObjectId, Bson, Document},
    Collection,
};
use rayon::{
    iter::{IntoParallelRefIterator, ParallelIterator},
    slice::ParallelSliceMut,
};
use serde::{Deserialize, Serialize};

use crate::db::{CLIENT, TOKENS};

// TODO: the new search algorithm should go like:
// TODO: find the form with the least distance
// TODO: put them into a vector

async fn search_in_tokens<'a>(
    query: &Query,
    found: Arc<Mutex<HashSet<ObjectId>>>,
    tokens: &'a [(String, ObjectId)],
) -> Vec<(usize, &'a str, &'a ObjectId)> {
    tokens
        .par_iter()
        .filter_map(|element| {
            let mut guard = found.lock().unwrap_or_else(|p| p.into_inner());
            let dis = levenshtein(&query.keyword, &element.0);
            if dis <= query.max_dis && !guard.contains(&element.1) {
                guard.insert(element.1);
                Some((dis, element.0.as_str(), &element.1))
            } else {
                None
            }
        })
        .collect::<Vec<(usize, &str, &ObjectId)>>()
}

async fn get_ids(query: &Query) -> Vec<(usize, &str, &ObjectId)> {
    let mut result = vec![];
    let search_map = [query.search_mt, query.search_en];
    let found: Arc<Mutex<HashSet<ObjectId>>> =
        Arc::new(Mutex::new(HashSet::new()));

    for (ind, tokens) in TOKENS.get().iter().enumerate() {
        if search_map[ind] {
            let res =
                search_in_tokens(query, found.clone(), &tokens[ind]).await;
            result.extend(res.iter());
        }
    }

    result
}

fn filter_ids<'a>(
    query: &Query,
    ids: &'a mut [(usize, &str, &ObjectId)],
) -> Vec<(usize, &'a str, &'a ObjectId)> {
    ids.par_sort_by(|a, b| a.0.cmp(&b.0));
    ids.iter()
        .skip(query.skip)
        .take(query.limit)
        .map(|element| (element.0, element.1, element.2))
        .collect()
}

pub async fn search(
    axum::extract::Query(query): axum::extract::Query<Query>,
) -> Json<Vec<SearchResultEntry>> {
    let mut ids = get_ids(&query).await;
    let ids = filter_ids(&query, &mut ids);
    let words: Collection<Document> =
        CLIENT.get().unwrap().database("local").collection("words");

    let result = ids
        // use rayon
        .par_iter()
        // map it
        .map(|element| async {
            // clone the element so that it doesn't outlive
            let element = (*element).clone();

            // if the word can be found
            if let Ok(Some(doc)) = words.find_one(doc! {"_id": element.2}).await
            {
                SearchResultEntry {
                    // get the word or let it be error
                    word: doc.get_str("surf").unwrap_or("error").to_string(),
                    distance: element.0,
                    // get the pos or let it be error
                    pos: doc.get_str("pos").unwrap_or("error").to_string(),
                    // get the en array and convert it into an array of strings or errors
                    en: doc
                        .get_array("en")
                        .unwrap_or(&vec![Bson::String("error".to_string())])
                        .iter()
                        // only take the first 3
                        .take(3)
                        .map(|b| b.as_str().unwrap_or("error").to_string())
                        .collect(),
                    matched: element.1.to_string(),
                }
            } else {
                // error
                SearchResultEntry {
                    word: "error".into(),
                    distance: element.0,
                    pos: "error".into(),
                    en: vec![],
                    matched: element.1.to_string(),
                }
            }
        })
        // collects into a vector of turues as an async closure is used
        .collect::<Vec<_>>();

    // await them
    let mut result = join_all(result).await;

    result.par_sort_by(|a, b| a.distance.cmp(&b.distance));

    Json(result)
}

#[derive(Deserialize, Debug)]
pub struct Query {
    #[serde(default = "default_keyword")]
    keyword: String,
    #[serde(default = "default_mode")]
    #[serde(rename(deserialize = "searchMt"))]
    search_mt: bool,
    #[serde(default = "default_mode")]
    #[serde(rename(deserialize = "searchEn"))]
    search_en: bool,
    #[serde(default = "default_skip")]
    skip: usize,
    #[serde(default = "default_limit")]
    limit: usize,
    #[serde(default = "default_max_dis")]
    #[serde(rename(deserialize = "maxDis"))]
    max_dis: usize,
}

#[derive(Serialize)]
pub struct SearchResultEntry {
    word: String,
    distance: usize,
    pos: String,
    en: Vec<String>,
    matched: String,
}

fn default_keyword() -> String {
    "".to_string()
}

fn default_mode() -> bool {
    true
}

fn default_skip() -> usize {
    0
}

fn default_limit() -> usize {
    10
}

fn default_max_dis() -> usize {
    5
}
