use std::collections::HashSet;

use indicatif::ProgressBar;
use mongodb::{
    bson::{self, doc, oid::ObjectId, Bson, Document},
    sync::{Client, Collection},
};
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};

const URI: &str = "mongodb://localhost:27017";

fn load_word(word: &Document, word_col: &Collection<Document>) {
    word_col.insert_one(word).run().unwrap();
}

fn load_words(word_col: &Collection<Document>) {
    use std::fs;
    let root = fs::read_to_string(".env").unwrap();
    let files = fs::read_dir(&root.trim()).unwrap();
    let count = files.count() as u64;
    let mut files = fs::read_dir(&root.trim()).unwrap();
    let bar = ProgressBar::new(count);
    loop {
        match files.next() {
            Some(Ok(entry)) => {
                let path = entry.path();
                let str = std::fs::read_to_string(path).unwrap();
                let filter = serde_json::from_str::<serde_json::Value>(&str).unwrap();
                let word = bson::to_document(&filter).unwrap();
                load_word(&word, word_col);
            }
            _ => break,
        }
        bar.inc(1);
    }
}

fn load_en(arr: &Vec<Bson>, extra: &Vec<Bson>, col: &Collection<Document>, id: &ObjectId) {
    arr.par_iter().for_each(|bson| {
        if let Bson::String(str) = bson {
            col.insert_one(doc! {
                "exact": str,
                "word": id.clone(),
            })
            .run()
            .unwrap();
        }
    });

    extra.par_iter().for_each(|bson| {
        if let Bson::String(str) = bson {
            col.insert_one(doc! {
                "exact": str,
                "word": id.clone(),
            })
            .run()
            .unwrap();
        }
    });
}

fn load_mt(forms: &Vec<Bson>, extra: &Vec<Bson>, col: &Collection<Document>, id: &ObjectId) {
    use std::sync::{Arc, Mutex};
    let existing: Arc<Mutex<HashSet<String>>> = Arc::new(Mutex::new(HashSet::new()));

    forms.par_iter().for_each(|form| {
        if let Bson::Document(doc) = form {
            if let Ok(str) = doc.get_str("word") {
                if !existing.lock().unwrap().contains(str) {
                    col.insert_one(doc! {
                        "exact": str,
                        "word": id.clone(),
                    })
                    .run()
                    .unwrap();

                    existing.lock().unwrap().insert(str.to_string());
                }
            }
        }
    });

    extra.par_iter().for_each(|bson| {
        if let Bson::String(str) = bson {
            col.insert_one(doc! {
                "exact": str,
                "word": id.clone(),
            })
            .run()
            .unwrap();
        }
    });
}

fn process_word(word: &Document, mt_col: &Collection<Document>, en_col: &Collection<Document>) {
    let id = if let Some(Bson::ObjectId(val)) = word.get("_id") {
        val
    } else {
        return;
    };

    let forms: &Vec<Bson> = if let Some(Bson::Array(arr)) = word.get("forms") {
        arr
    } else {
        &Vec::new()
    };

    if let Some(Bson::Array(en_extra)) = word.get("en-extra") {
        if let Some(Bson::Array(en)) = word.get("en") {
            load_en(en, en_extra, en_col, id);
        }
    }

    if let Some(Bson::Array(mt_extra)) = word.get("mt-extra") {
        load_mt(forms, mt_extra, mt_col, id);
    }
}

fn load_tokens(
    word_col: &Collection<Document>,
    mt_col: &Collection<Document>,
    en_col: &Collection<Document>,
) {
    let bar = ProgressBar::new(word_col.count_documents(doc! {}).run().unwrap());
    let mut cursor = word_col.find(doc! {}).run().unwrap();
    while let Some(Ok(doc)) = cursor.next() {
        process_word(&doc, mt_col, en_col);
        bar.inc(1);
    }
}

fn main() -> mongodb::error::Result<()> {
    let client = Client::with_uri_str(URI)?;
    let db = client.database("local");
    let en_col = db.collection::<Document>("en-tokens");
    let mt_col = db.collection::<Document>("mt-tokens");
    let word_col = db.collection::<Document>("words");

    en_col.drop().run().unwrap();
    mt_col.drop().run().unwrap();
    word_col.drop().run().unwrap();

    db.create_collection("en-tokens").run().unwrap();
    db.create_collection("mt-tokens").run().unwrap();
    db.create_collection("words").run().unwrap();

    let en_col = db.collection::<Document>("en-tokens");
    let mt_col = db.collection::<Document>("mt-tokens");
    let word_col = db.collection::<Document>("words");

    load_words(&word_col);
    load_tokens(&word_col, &mt_col, &en_col);

    Ok(())
}
