import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AnalyticsData {
  'completed_deliveries' : bigint,
  'total_users' : bigint,
  'active_shipments' : bigint,
  'total_products' : bigint,
  'average_ethical_score' : number,
  'total_partners' : bigint,
}
export interface CanisterStatus {
  'total_users' : bigint,
  'total_products' : bigint,
  'version' : string,
  'uptime' : bigint,
  'total_events' : bigint,
}
export type EventStatus = { 'Failed' : null } |
  { 'InProgress' : null } |
  { 'Completed' : null } |
  { 'Pending' : null };
export interface Partner {
  'id' : Principal,
  'verified' : boolean,
  'contact_person' : string,
  'contact_email' : string,
  'company_name' : string,
  'partner_type' : PartnerType,
  'created_at' : bigint,
  'certifications' : Array<string>,
  'reputation_score' : number,
}
export interface PartnerRegistration {
  'contact_person' : string,
  'contact_email' : string,
  'company_name' : string,
  'partner_type' : PartnerType,
  'certifications' : Array<string>,
}
export type PartnerType = { 'Distributor' : null } |
  { 'Supplier' : null } |
  { 'LogisticsProvider' : null } |
  { 'CertificationBody' : null } |
  { 'Retailer' : null } |
  { 'Manufacturer' : null };
export interface Product {
  'id' : string,
  'batch_number' : [] | [string],
  'updated_at' : bigint,
  'production_date' : bigint,
  'manufacturer' : string,
  'estimated_value' : [] | [number],
  'sustainability_score' : [] | [number],
  'name' : string,
  'description' : [] | [string],
  'created_at' : bigint,
  'current_location' : string,
  'category' : string,
  'current_status' : ProductStatus,
  'certifications' : Array<string>,
  'raw_materials' : Array<string>,
  'manufacturer_id' : Principal,
}
export interface ProductRegistration {
  'batch_number' : [] | [string],
  'production_date' : bigint,
  'estimated_value' : [] | [number],
  'sustainability_score' : [] | [number],
  'name' : string,
  'description' : [] | [string],
  'manufacturing_location' : string,
  'category' : string,
  'certifications' : Array<string>,
  'raw_materials' : Array<string>,
}
export interface ProductSearchQuery {
  'status' : [] | [ProductStatus],
  'manufacturer' : [] | [string],
  'name' : [] | [string],
  'limit' : [] | [number],
  'category' : [] | [string],
}
export type ProductStatus = { 'InTransit' : null } |
  { 'Delivered' : null } |
  { 'Recalled' : null } |
  { 'Manufacturing' : null };
export interface ProductWithHistory {
  'supply_chain_events' : Array<SupplyChainEvent>,
  'ethical_score' : number,
  'product' : Product,
}
export type Result = { 'Ok' : User } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : ProductWithHistory } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : Array<SupplyChainEvent> } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : null } |
  { 'Err' : string };
export interface SupplyChainEvent {
  'id' : string,
  'status' : EventStatus,
  'actor' : string,
  'product_id' : string,
  'estimated_arrival' : [] | [bigint],
  'metadata' : Array<[string, string]>,
  'actor_id' : Principal,
  'stage' : SupplyChainStage,
  'timestamp' : bigint,
  'details' : string,
  'certifications' : Array<string>,
  'location' : string,
}
export interface SupplyChainEventInput {
  'status' : EventStatus,
  'product_id' : string,
  'estimated_arrival' : [] | [bigint],
  'metadata' : Array<[string, string]>,
  'stage' : SupplyChainStage,
  'details' : string,
  'certifications' : Array<string>,
  'location' : string,
}
export type SupplyChainStage = { 'QualityControl' : null } |
  { 'Shipping' : null } |
  { 'Retail' : null } |
  { 'Packaging' : null } |
  { 'Distribution' : null } |
  { 'RawMaterialSourcing' : null } |
  { 'Manufacturing' : null };
export interface User {
  'id' : Principal,
  'permissions' : UserPermissions,
  'role' : UserRole,
  'created_at' : bigint,
  'email' : string,
  'company' : string,
  'is_verified' : boolean,
  'first_name' : string,
  'last_name' : string,
}
export interface UserPermissions {
  'can_register_products' : boolean,
  'can_verify_users' : boolean,
  'can_view_analytics' : boolean,
  'can_manage_partners' : boolean,
  'can_update_supply_chain' : boolean,
}
export interface UserRegistration {
  'role' : UserRole,
  'email' : string,
  'company' : string,
  'first_name' : string,
  'last_name' : string,
}
export type UserRole = { 'LogisticsProvider' : null } |
  { 'QualityAssurance' : null } |
  { 'Retailer' : null } |
  { 'Consumer' : null } |
  { 'SupplyChainManager' : null } |
  { 'Admin' : null } |
  { 'Manufacturer' : null };
export interface _SERVICE {
  'add_supply_chain_event' : ActorMethod<[SupplyChainEventInput], Result_1>,
  'get_analytics' : ActorMethod<[], AnalyticsData>,
  'get_canister_status' : ActorMethod<[], CanisterStatus>,
  'get_partners' : ActorMethod<[], Array<Partner>>,
  'get_product' : ActorMethod<[string], Result_2>,
  'get_supply_chain_events' : ActorMethod<[string], Result_3>,
  'get_user' : ActorMethod<[], Result>,
  'register_partner' : ActorMethod<[PartnerRegistration], Result_4>,
  'register_product' : ActorMethod<[ProductRegistration], Result_1>,
  'register_user' : ActorMethod<[UserRegistration], Result>,
  'search_products' : ActorMethod<[ProductSearchQuery], Array<Product>>,
  'update_user_verification' : ActorMethod<[Principal, boolean], Result_4>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
