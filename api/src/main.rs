pub mod db;
pub mod search;

use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    let uri = std::env::var("MONGODB_URI").expect("MONGODB_URI must be set");
    db::init(&uri).await;

    // initialize tracing
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/", get(root))
        .route("/search", get(search::search));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    include_str!("root.txt")
}
