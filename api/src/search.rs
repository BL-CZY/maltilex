use std::{cmp::Ordering, usize::MAX};

use axum::Json;
use levenshtein::levenshtein;
use mongodb::bson::doc;
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use serde::{Deserialize, Serialize};

use crate::db::{Word, WORDS};

fn get_min_token<'a>(
    tokens: &'a Vec<String>,
    query: &Query,
) -> Option<(usize, Option<&'a str>)> {
    // find the smallest distance in this list
    tokens
        .par_iter()
        .filter_map(|token| {
            let dis = levenshtein(&token, &query.keyword);
            if dis <= query.max_dis {
                Some((dis, Some(token.as_str())))
            } else {
                None
            }
        })
        .min_by(|a, b| a.0.cmp(&b.0))
}

fn process_word<'a>(
    word: &'a Word,
    query: &Query,
    search_grid: &[bool; 2],
) -> Option<SearchResultEntry<'a>> {
    let mut min_res: (usize, Option<&str>) = (MAX, None);

    // loop through the two token lists
    word.tokens.iter().enumerate().for_each(|(ind, tokens)| {
        // search this token list if it's toggled
        if search_grid[ind] {
            // find the smallest distance in this list
            let min = get_min_token(tokens, query);

            // see if the smallest distance exists
            let min = if let Some(num) = min {
                num
            } else {
                return;
            };

            if let Ordering::Less = min_res.0.cmp(&min.0) {
                min_res = min.clone();
            }
        }
    });

    // see if a result is found
    if !min_res.1.is_none() {
        Some(SearchResultEntry {
            word: &word.word,
            distance: min_res.0,
            pos: &word.pos,
            en: &word.en_display,
            matched: min_res.1.unwrap(),
        })
    } else {
        None
    }
}

fn search_in_words<'a>(
    query: &Query,
    words: &'a Vec<Word>,
) -> Vec<SearchResultEntry<'a>> {
    let search_grid = [query.search_mt, query.search_en];

    // parallel computes the lowest distance for each word
    words
        .par_iter()
        .filter_map(|word| process_word(word, query, &search_grid))
        .collect()
}

pub async fn search<'a>(
    axum::extract::Query(query): axum::extract::Query<Query>,
) -> Json<Vec<SearchResultEntry<'a>>> {
    Json(
        search_in_words(&query, WORDS.get().unwrap())
            .iter()
            .skip(query.skip)
            .take(query.limit)
            .cloned()
            .collect::<Vec<SearchResultEntry<'a>>>(),
    )
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

#[derive(Serialize, Clone)]
pub struct SearchResultEntry<'a> {
    word: &'a str,
    distance: usize,
    pos: &'a str,
    en: &'a [String],
    matched: &'a str,
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
