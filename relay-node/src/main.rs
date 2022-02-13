use actix_cors::Cors;
use actix_web::{error, get, App, Error, HttpRequest, HttpResponse, HttpServer};
use std::str::FromStr;
use std::sync::Arc;
use std::thread;
use std::time::Duration;
use tokio;

#[get("/query")]
async fn index() -> Result<HttpResponse, Error> {
    // println!("hit /query");
    // match req.app_data::<Arc<RpcClient>>() {
    //     Some(client) => {
    //         let sol = client.clone();
    //         let child1 = thread::spawn(move || {
    //             let res = sol.get_block_height().unwrap();
    //             println!("blockheight {:#?}", res);
    //             let streamflow_addr =
    //                 Pubkey::from_str("8e72pYCDaxu3GqMfeQ5r8wFgoZSYk6oua1Qo9XpsZjX").unwrap();
    //             println!("account {:#?}", streamflow_addr);
    //             let res = sol.get_program_accounts(&streamflow_addr).unwrap();
    //             println!("accounts {:#?}", res);
    //             res.len()
    //         });
    //         let accounts_strmflw = child1.join().unwrap();
    //         // let blockheight = child1.join().unwrap();
    //         Ok(HttpResponse::Ok().json(accounts_strmflw))
    //     }
    //     _ => Err(error::ErrorBadRequest("overflow")),
    // }
    Ok(HttpResponse::Ok().json("working"))
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    println!("Server Started!");
    // let timeout = Duration::from_secs(60);
    // let url = "https://api.mainnet-beta.solana.com".to_string();
    // let rpc_client = Arc::new(RpcClient::new_with_timeout(url, timeout));
    // println!("RPC Client connected!");
    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            // .app_data(rpc_client.clone())
            .service(index)
    })
    .bind("127.0.0.1:8080")
    .unwrap()
    .run()
    .await
}
