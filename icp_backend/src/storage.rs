use crate::types::*;

pub fn get_default_permissions(role: &UserRole) -> UserPermissions {
    match role {
        UserRole::Manufacturer => UserPermissions {
            can_register_products: true,
            can_update_supply_chain: true,
            can_manage_partners: false,
            can_view_analytics: true,
            can_verify_users: false,
        },
        UserRole::LogisticsProvider => UserPermissions {
            can_register_products: false,
            can_update_supply_chain: true,
            can_manage_partners: false,
            can_view_analytics: true,
            can_verify_users: false,
        },
        UserRole::Retailer => UserPermissions {
            can_register_products: false,
            can_update_supply_chain: true,
            can_manage_partners: false,
            can_view_analytics: true,
            can_verify_users: false,
        },
        UserRole::QualityAssurance => UserPermissions {
            can_register_products: false,
            can_update_supply_chain: true,
            can_manage_partners: false,
            can_view_analytics: true,
            can_verify_users: false,
        },
        UserRole::SupplyChainManager => UserPermissions {
            can_register_products: true,
            can_update_supply_chain: true,
            can_manage_partners: true,
            can_view_analytics: true,
            can_verify_users: false,
        },
        UserRole::Admin => UserPermissions {
            can_register_products: true,
            can_update_supply_chain: true,
            can_manage_partners: true,
            can_view_analytics: true,
            can_verify_users: true,
        },
        UserRole::Consumer => UserPermissions {
            can_register_products: false,
            can_update_supply_chain: false,
            can_manage_partners: false,
            can_view_analytics: false,
            can_verify_users: false,
        },
    }
}
