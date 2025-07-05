use ic_cdk::api::time;
use sha2::{Digest, Sha256};

pub fn generate_product_id(category: &str) -> String {
    let timestamp = time();
    let mut hasher = Sha256::new();
    hasher.update(format!("{}-{}", category, timestamp));
    let hash = hasher.finalize();
    
    // Create a simple timestamp-based ID
    let year = 2024; // You can calculate this from timestamp if needed
    let hash_part = &hash[..3].iter().fold(0u32, |acc, &b| acc * 256 + b as u32);
    
    format!("CT-{}-{:06X}", year, hash_part)
}

pub fn generate_event_id() -> String {
    let timestamp = time();
    let mut hasher = Sha256::new();
    hasher.update(timestamp.to_string());
    let hash = hasher.finalize();
    
    format!("EVT-{:08X}", 
        &hash[..4].iter().fold(0u32, |acc, &b| acc * 256 + b as u32)
    )
}
