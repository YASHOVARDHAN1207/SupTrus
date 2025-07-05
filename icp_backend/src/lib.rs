use candid::Principal;
use ic_cdk::api::time;
use ic_cdk_macros::*;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

mod types;
mod storage;
mod utils;

use types::*;
use storage::*;
use utils::*;

type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static PRODUCTS: RefCell<StableBTreeMap<String, Product, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );

    static USERS: RefCell<StableBTreeMap<Principal, User, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
        )
    );

    static SUPPLY_CHAIN_EVENTS: RefCell<StableBTreeMap<String, SupplyChainEventList, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),
        )
    );

    static PARTNERS: RefCell<StableBTreeMap<Principal, Partner, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),
        )
    );
}

// User Management Functions
#[update]
fn register_user(user_data: UserRegistration) -> Result<User, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot register".to_string());
    }

    let permissions = get_default_permissions(&user_data.role);

    let user = User {
        id: caller,
        email: user_data.email,
        first_name: user_data.first_name,
        last_name: user_data.last_name,
        company: user_data.company,
        role: user_data.role,
        created_at: time(),
        is_verified: false,
        permissions,
    };

    USERS.with(|users| {
        users.borrow_mut().insert(caller, user.clone());
    });

    Ok(user)
}

#[query]
fn get_user() -> Result<User, String> {
    let caller = ic_cdk::caller();
    
    USERS.with(|users| {
        users.borrow().get(&caller)
            .ok_or_else(|| "User not found".to_string())
    })
}

#[update]
fn update_user_verification(user_id: Principal, verified: bool) -> Result<(), String> {
    let caller = ic_cdk::caller();
    
    // Only admin users can verify others
    if !is_admin(&caller)? {
        return Err("Unauthorized: Admin access required".to_string());
    }

    USERS.with(|users| {
        let mut users_map = users.borrow_mut();
        if let Some(mut user) = users_map.get(&user_id) {
            user.is_verified = verified;
            users_map.insert(user_id, user);
            Ok(())
        } else {
            Err("User not found".to_string())
        }
    })
}

// Product Management Functions
#[update]
fn register_product(product_data: ProductRegistration) -> Result<String, String> {
    let caller = ic_cdk::caller();
    
    // Verify user exists and has permission
    let user = get_user_by_principal(&caller)?;
    if !user.permissions.can_register_products {
        return Err("Unauthorized: Cannot register products".to_string());
    }

    let product_id = generate_product_id(&product_data.category);
    let current_time = time();

    let product = Product {
        id: product_id.clone(),
        name: product_data.name,
        category: product_data.category,
        description: product_data.description,
        manufacturer: user.company.clone(),
        manufacturer_id: caller,
        batch_number: product_data.batch_number,
        production_date: product_data.production_date,
        raw_materials: product_data.raw_materials,
        certifications: product_data.certifications.clone(),
        sustainability_score: product_data.sustainability_score,
        estimated_value: product_data.estimated_value,
        current_status: ProductStatus::Manufacturing,
        current_location: product_data.manufacturing_location.clone(),
        created_at: current_time,
        updated_at: current_time,
    };

    // Create initial supply chain event
    let initial_event = SupplyChainEvent {
        id: generate_event_id(),
        product_id: product_id.clone(),
        stage: SupplyChainStage::RawMaterialSourcing,
        location: product_data.manufacturing_location,
        timestamp: current_time,
        actor: user.company,
        actor_id: caller,
        status: EventStatus::Completed,
        details: "Product registered and initial sourcing completed".to_string(),
        certifications: product_data.certifications,
        estimated_arrival: None,
        metadata: std::collections::HashMap::new(),
    };

    PRODUCTS.with(|products| {
        products.borrow_mut().insert(product_id.clone(), product);
    });

    SUPPLY_CHAIN_EVENTS.with(|events| {
        events.borrow_mut().insert(product_id.clone(), SupplyChainEventList(vec![initial_event]));
    });

    Ok(product_id)
}

#[query]
fn get_product(product_id: String) -> Result<ProductWithHistory, String> {
    let product = PRODUCTS.with(|products| {
        products.borrow().get(&product_id)
            .ok_or_else(|| "Product not found".to_string())
    })?;

    let events = SUPPLY_CHAIN_EVENTS.with(|events| {
        events.borrow().get(&product_id)
            .map(|event_list| event_list.0)
            .unwrap_or_default()
    });

    Ok(ProductWithHistory {
        product,
        supply_chain_events: events,
        ethical_score: calculate_ethical_score(&product_id)?,
    })
}

#[query]
fn search_products(query: ProductSearchQuery) -> Vec<Product> {
    PRODUCTS.with(|products| {
        products.borrow()
            .iter()
            .filter_map(|(_, product)| {
                let matches_name = query.name.as_ref()
                    .map_or(true, |name| product.name.to_lowercase().contains(&name.to_lowercase()));
                
                let matches_category = query.category.as_ref()
                    .map_or(true, |category| product.category == *category);
                
                let matches_manufacturer = query.manufacturer.as_ref()
                    .map_or(true, |manufacturer| product.manufacturer.to_lowercase().contains(&manufacturer.to_lowercase()));
                
                let matches_status = query.status.as_ref()
                    .map_or(true, |status| product.current_status == *status);

                if matches_name && matches_category && matches_manufacturer && matches_status {
                    Some(product)
                } else {
                    None
                }
            })
            .take(query.limit.unwrap_or(50) as usize)
            .collect()
    })
}

// Supply Chain Event Functions
#[update]
fn add_supply_chain_event(event_data: SupplyChainEventInput) -> Result<String, String> {
    let caller = ic_cdk::caller();
    
    // Verify user exists and has permission
    let user = get_user_by_principal(&caller)?;
    if !user.permissions.can_update_supply_chain {
        return Err("Unauthorized: Cannot update supply chain".to_string());
    }

    // Verify product exists
    let mut product = PRODUCTS.with(|products| {
        products.borrow().get(&event_data.product_id)
            .ok_or_else(|| "Product not found".to_string())
    })?;

    let event_id = generate_event_id();
    let current_time = time();

    let event = SupplyChainEvent {
        id: event_id.clone(),
        product_id: event_data.product_id.clone(),
        stage: event_data.stage.clone(),
        location: event_data.location.clone(),
        timestamp: current_time,
        actor: user.company.clone(),
        actor_id: caller,
        status: event_data.status,
        details: event_data.details,
        certifications: event_data.certifications,
        estimated_arrival: event_data.estimated_arrival,
        metadata: event_data.metadata,
    };

    // Update product status and location
    product.current_status = stage_to_product_status(&event_data.stage);
    product.current_location = event_data.location;
    product.updated_at = current_time;

    PRODUCTS.with(|products| {
        products.borrow_mut().insert(event_data.product_id.clone(), product);
    });

    SUPPLY_CHAIN_EVENTS.with(|events| {
        let mut events_map = events.borrow_mut();
        let mut product_events = events_map.get(&event_data.product_id)
            .map(|event_list| event_list.0)
            .unwrap_or_default();
        product_events.push(event);
        events_map.insert(event_data.product_id, SupplyChainEventList(product_events));
    });

    Ok(event_id)
}

#[query]
fn get_supply_chain_events(product_id: String) -> Result<Vec<SupplyChainEvent>, String> {
    // Verify product exists
    PRODUCTS.with(|products| {
        products.borrow().get(&product_id)
            .ok_or_else(|| "Product not found".to_string())
    })?;

    let events = SUPPLY_CHAIN_EVENTS.with(|events| {
        events.borrow().get(&product_id)
            .map(|event_list| event_list.0)
            .unwrap_or_default()
    });

    Ok(events)
}

// Partner Management Functions
#[update]
fn register_partner(partner_data: PartnerRegistration) -> Result<(), String> {
    let caller = ic_cdk::caller();
    
    // Verify user exists and has permission
    let user = get_user_by_principal(&caller)?;
    if !user.permissions.can_manage_partners {
        return Err("Unauthorized: Cannot manage partners".to_string());
    }

    let partner = Partner {
        id: caller,
        company_name: partner_data.company_name,
        partner_type: partner_data.partner_type,
        contact_email: partner_data.contact_email,
        contact_person: partner_data.contact_person,
        certifications: partner_data.certifications,
        verified: false,
        created_at: time(),
        reputation_score: 0,
    };

    PARTNERS.with(|partners| {
        partners.borrow_mut().insert(caller, partner);
    });

    Ok(())
}

#[query]
fn get_partners() -> Vec<Partner> {
    PARTNERS.with(|partners| {
        partners.borrow()
            .iter()
            .map(|(_, partner)| partner)
            .collect()
    })
}

// Analytics Functions
#[query]
fn get_analytics() -> AnalyticsData {
    let total_products = PRODUCTS.with(|products| products.borrow().len());
    
    let (active_shipments, completed_deliveries) = PRODUCTS.with(|products| {
        products.borrow()
            .iter()
            .fold((0u64, 0u64), |(active, completed), (_, product)| {
                match product.current_status {
                    ProductStatus::InTransit => (active + 1, completed),
                    ProductStatus::Delivered => (active, completed + 1),
                    _ => (active, completed),
                }
            })
    });

    let average_ethical_score = PRODUCTS.with(|products| {
        let products_map = products.borrow();
        if products_map.is_empty() {
            return 0.0;
        }
        
        let total_score: f64 = products_map
            .iter()
            .map(|(product_id, _)| calculate_ethical_score(&product_id).unwrap_or(0.0))
            .sum();
        
        total_score / products_map.len() as f64
    });

    AnalyticsData {
        total_products,
        active_shipments,
        completed_deliveries,
        average_ethical_score,
        total_partners: PARTNERS.with(|partners| partners.borrow().len()),
        total_users: USERS.with(|users| users.borrow().len()),
    }
}

// Utility Functions
#[query]
fn get_canister_status() -> CanisterStatus {
    CanisterStatus {
        version: "1.0.0".to_string(),
        total_products: PRODUCTS.with(|products| products.borrow().len()),
        total_users: USERS.with(|users| users.borrow().len()),
        total_events: SUPPLY_CHAIN_EVENTS.with(|events| {
            events.borrow()
                .iter()
                .map(|(_, event_list)| event_list.0.len() as u64)
                .sum()
        }),
        uptime: time(),
    }
}

// Helper Functions
fn get_user_by_principal(principal: &Principal) -> Result<User, String> {
    USERS.with(|users| {
        users.borrow().get(principal)
            .ok_or_else(|| "User not found".to_string())
    })
}

fn is_admin(principal: &Principal) -> Result<bool, String> {
    let user = get_user_by_principal(principal)?;
    Ok(user.role == UserRole::Admin)
}

fn calculate_ethical_score(product_id: &String) -> Result<f64, String> {
    let product = PRODUCTS.with(|products| {
        products.borrow().get(product_id)
            .ok_or_else(|| "Product not found".to_string())
    })?;

    let events = SUPPLY_CHAIN_EVENTS.with(|events| {
        events.borrow().get(product_id)
            .map(|event_list| event_list.0)
            .unwrap_or_default()
    });

    let mut score = product.sustainability_score.unwrap_or(50.0);
    
    // Add points for certifications
    score += (product.certifications.len() as f64) * 5.0;
    
    // Add points for completed stages with certifications
    for event in events {
        if !event.certifications.is_empty() {
            score += 2.0;
        }
    }

    // Cap at 100
    Ok(score.min(100.0))
}

fn stage_to_product_status(stage: &SupplyChainStage) -> ProductStatus {
    match stage {
        SupplyChainStage::RawMaterialSourcing => ProductStatus::Manufacturing,
        SupplyChainStage::Manufacturing => ProductStatus::Manufacturing,
        SupplyChainStage::QualityControl => ProductStatus::Manufacturing,
        SupplyChainStage::Packaging => ProductStatus::Manufacturing,
        SupplyChainStage::Shipping => ProductStatus::InTransit,
        SupplyChainStage::Distribution => ProductStatus::InTransit,
        SupplyChainStage::Retail => ProductStatus::Delivered,
    }
}

// Export candid interface
ic_cdk::export_candid!();
