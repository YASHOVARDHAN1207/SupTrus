use candid::{CandidType, Deserialize, Principal};
use ic_stable_structures::Storable;
use serde::Serialize;
use std::borrow::Cow;
use std::collections::HashMap;

// User Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub id: Principal,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub company: String,
    pub role: UserRole,
    pub created_at: u64,
    pub is_verified: bool,
    pub permissions: UserPermissions,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserRegistration {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub company: String,
    pub role: UserRole,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq, Copy)]
pub enum UserRole {
    Manufacturer,
    LogisticsProvider,
    Retailer,
    QualityAssurance,
    SupplyChainManager,
    Admin,
    Consumer,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserPermissions {
    pub can_register_products: bool,
    pub can_update_supply_chain: bool,
    pub can_manage_partners: bool,
    pub can_view_analytics: bool,
    pub can_verify_users: bool,
}

// Product Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub category: String,
    pub description: Option<String>,
    pub manufacturer: String,
    pub manufacturer_id: Principal,
    pub batch_number: Option<String>,
    pub production_date: u64,
    pub raw_materials: Vec<String>,
    pub certifications: Vec<String>,
    pub sustainability_score: Option<f64>,
    pub estimated_value: Option<f64>,
    pub current_status: ProductStatus,
    pub current_location: String,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ProductRegistration {
    pub name: String,
    pub category: String,
    pub description: Option<String>,
    pub batch_number: Option<String>,
    pub production_date: u64,
    pub manufacturing_location: String,
    pub raw_materials: Vec<String>,
    pub certifications: Vec<String>,
    pub sustainability_score: Option<f64>,
    pub estimated_value: Option<f64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ProductStatus {
    Manufacturing,
    InTransit,
    Delivered,
    Recalled,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ProductWithHistory {
    pub product: Product,
    pub supply_chain_events: Vec<SupplyChainEvent>,
    pub ethical_score: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ProductSearchQuery {
    pub name: Option<String>,
    pub category: Option<String>,
    pub manufacturer: Option<String>,
    pub status: Option<ProductStatus>,
    pub limit: Option<u32>,
}

// Supply Chain Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SupplyChainEvent {
    pub id: String,
    pub product_id: String,
    pub stage: SupplyChainStage,
    pub location: String,
    pub timestamp: u64,
    pub actor: String,
    pub actor_id: Principal,
    pub status: EventStatus,
    pub details: String,
    pub certifications: Vec<String>,
    pub estimated_arrival: Option<u64>,
    pub metadata: HashMap<String, String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SupplyChainEventInput {
    pub product_id: String,
    pub stage: SupplyChainStage,
    pub location: String,
    pub status: EventStatus,
    pub details: String,
    pub certifications: Vec<String>,
    pub estimated_arrival: Option<u64>,
    pub metadata: HashMap<String, String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum SupplyChainStage {
    RawMaterialSourcing,
    Manufacturing,
    QualityControl,
    Packaging,
    Shipping,
    Distribution,
    Retail,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum EventStatus {
    Pending,
    InProgress,
    Completed,
    Failed,
}

// Partner Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Partner {
    pub id: Principal,
    pub company_name: String,
    pub partner_type: PartnerType,
    pub contact_email: String,
    pub contact_person: String,
    pub certifications: Vec<String>,
    pub verified: bool,
    pub created_at: u64,
    pub reputation_score: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PartnerRegistration {
    pub company_name: String,
    pub partner_type: PartnerType,
    pub contact_email: String,
    pub contact_person: String,
    pub certifications: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum PartnerType {
    Manufacturer,
    Supplier,
    LogisticsProvider,
    Distributor,
    Retailer,
    CertificationBody,
}

// Analytics Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnalyticsData {
    pub total_products: u64,
    pub active_shipments: u64,
    pub completed_deliveries: u64,
    pub average_ethical_score: f64,
    pub total_partners: u64,
    pub total_users: u64,
}

// System Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CanisterStatus {
    pub version: String,
    pub total_products: u64,
    pub total_users: u64,
    pub total_events: u64,
    pub uptime: u64,
}

// Wrapper type for Vec<SupplyChainEvent> to implement Storable
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SupplyChainEventList(pub Vec<SupplyChainEvent>);

// Implement Storable for stable storage
impl Storable for User {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 1024,
        is_fixed_size: false,
    };
}

impl Storable for Product {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 2048,
        is_fixed_size: false,
    };
}

impl Storable for SupplyChainEventList {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 8192,
        is_fixed_size: false,
    };
}

impl Storable for Partner {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 1024,
        is_fixed_size: false,
    };
}
