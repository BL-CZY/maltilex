use futures::TryStreamExt;
use indicatif::ProgressBar;
use mongodb::{
    bson::{doc, oid::ObjectId, Bson, Document},
    Client,
};
use tokio::sync::OnceCell;

#[derive(Debug)]
pub struct Word {
    pub id: ObjectId,
    pub word: String,
    pub pos: String,
    /// [maltese tokens, english tokens]
    pub tokens: [Vec<String>; 2],
    pub en_display: Vec<String>,
}

pub static CLIENT: OnceCell<Client> = OnceCell::const_new();
// TOKENS[0] is Maltese
// TOKENS[1] is English
pub static WORDS: OnceCell<Vec<Word>> = OnceCell::const_new();

fn get_string_vec(arr: &Vec<Bson>) -> Vec<String> {
    arr.iter()
        .filter_map(|token| token.as_str())
        .map(|token| token.to_string())
        .collect::<Vec<String>>()
}

fn parse_doc(doc: &Document) -> Result<Word, Box<dyn std::error::Error>> {
    let id = doc.get_object_id("_id")?;
    let word = doc.get_str("word")?.to_string();
    let pos = doc.get_str("pos")?.to_string();

    let mt_tokens = get_string_vec(doc.get_array("mtTokens")?);
    let en_tokens = get_string_vec(doc.get_array("enTokens")?);

    let en_display = get_string_vec(doc.get_array("enDisplay")?);

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

pub async fn init(uri: &str) {
    CLIENT
        .set(Client::with_uri_str(uri).await.unwrap())
        .unwrap();

    let db = CLIENT.get().unwrap().database("local");
    let words = db.collection::<Document>("words");
    let mut result: Vec<Word> = vec![];
    let mut cursor = words.find(doc! {}).await.unwrap();

    println!("Loading words...");
    let bar =
        ProgressBar::new(words.count_documents(doc! {}).await.unwrap() as u64);

    while let Ok(Some(doc)) = cursor.try_next().await {
        if let Ok(w) = parse_doc(&doc) {
            result.push(w);
        }
        bar.inc(1);
    }

    WORDS.set(result).expect("Failed to initialize the search");
}
