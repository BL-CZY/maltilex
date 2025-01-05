use futures::TryStreamExt;
use indicatif::ProgressBar;
use mongodb::{
    bson::{doc, oid::ObjectId, Bson, Document},
    Client,
};
use tokio::sync::OnceCell;

pub static CLIENT: OnceCell<Client> = OnceCell::const_new();
// TOKENS[0] is Maltese
// TOKENS[1] is English
pub static TOKENS: OnceCell<[Vec<(String, ObjectId)>; 2]> =
    OnceCell::const_new();

pub async fn init(uri: &str) {
    CLIENT
        .set(Client::with_uri_str(uri).await.unwrap())
        .unwrap();

    let db = CLIENT.get().unwrap().database("local");
    let mt_tokens = db.collection::<Document>("mt-tokens");
    let mut mt_vec: Vec<(String, ObjectId)> = vec![];
    let mut mt_cursor = mt_tokens.find(doc! {}).await.unwrap();

    println!("Loading Maltese tokens...");
    let bar = ProgressBar::new(
        mt_tokens.count_documents(doc! {}).await.unwrap() as u64,
    );
    while let Ok(Some(doc)) = mt_cursor.try_next().await {
        if let Ok(str) = doc.get_str("exact") {
            if let Some(Bson::ObjectId(id)) = doc.get("word") {
                mt_vec.push((str.to_string(), *id));
            }
        }
        bar.inc(1);
    }

    let en_tokens = db.collection::<Document>("en-tokens");
    let mut en_vec: Vec<(String, ObjectId)> = vec![];
    let mut en_cursor = en_tokens.find(doc! {}).await.unwrap();

    println!("Loading English tokens...");
    let bar_en = ProgressBar::new(
        en_tokens.count_documents(doc! {}).await.unwrap() as u64,
    );
    while let Ok(Some(doc)) = en_cursor.try_next().await {
        if let Ok(str) = doc.get_str("exact") {
            if let Some(Bson::ObjectId(id)) = doc.get("word") {
                en_vec.push((str.to_string(), *id));
            }
        }
        bar_en.inc(1);
    }

    let result = [mt_vec, en_vec];
    TOKENS.set(result).expect("Failed to initialize the search");
}
