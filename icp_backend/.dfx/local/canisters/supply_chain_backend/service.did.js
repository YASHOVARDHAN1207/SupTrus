export const idlFactory = ({ IDL }) => {
  const EventStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'InProgress' : IDL.Null,
    'Completed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const SupplyChainStage = IDL.Variant({
    'QualityControl' : IDL.Null,
    'Shipping' : IDL.Null,
    'Retail' : IDL.Null,
    'Packaging' : IDL.Null,
    'Distribution' : IDL.Null,
    'RawMaterialSourcing' : IDL.Null,
    'Manufacturing' : IDL.Null,
  });
  const SupplyChainEventInput = IDL.Record({
    'status' : EventStatus,
    'product_id' : IDL.Text,
    'estimated_arrival' : IDL.Opt(IDL.Nat64),
    'metadata' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'stage' : SupplyChainStage,
    'details' : IDL.Text,
    'certifications' : IDL.Vec(IDL.Text),
    'location' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const AnalyticsData = IDL.Record({
    'completed_deliveries' : IDL.Nat64,
    'total_users' : IDL.Nat64,
    'active_shipments' : IDL.Nat64,
    'total_products' : IDL.Nat64,
    'average_ethical_score' : IDL.Float64,
    'total_partners' : IDL.Nat64,
  });
  const CanisterStatus = IDL.Record({
    'total_users' : IDL.Nat64,
    'total_products' : IDL.Nat64,
    'version' : IDL.Text,
    'uptime' : IDL.Nat64,
    'total_events' : IDL.Nat64,
  });
  const PartnerType = IDL.Variant({
    'Distributor' : IDL.Null,
    'Supplier' : IDL.Null,
    'LogisticsProvider' : IDL.Null,
    'CertificationBody' : IDL.Null,
    'Retailer' : IDL.Null,
    'Manufacturer' : IDL.Null,
  });
  const Partner = IDL.Record({
    'id' : IDL.Principal,
    'verified' : IDL.Bool,
    'contact_person' : IDL.Text,
    'contact_email' : IDL.Text,
    'company_name' : IDL.Text,
    'partner_type' : PartnerType,
    'created_at' : IDL.Nat64,
    'certifications' : IDL.Vec(IDL.Text),
    'reputation_score' : IDL.Nat32,
  });
  const SupplyChainEvent = IDL.Record({
    'id' : IDL.Text,
    'status' : EventStatus,
    'actor' : IDL.Text,
    'product_id' : IDL.Text,
    'estimated_arrival' : IDL.Opt(IDL.Nat64),
    'metadata' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'actor_id' : IDL.Principal,
    'stage' : SupplyChainStage,
    'timestamp' : IDL.Nat64,
    'details' : IDL.Text,
    'certifications' : IDL.Vec(IDL.Text),
    'location' : IDL.Text,
  });
  const ProductStatus = IDL.Variant({
    'InTransit' : IDL.Null,
    'Delivered' : IDL.Null,
    'Recalled' : IDL.Null,
    'Manufacturing' : IDL.Null,
  });
  const Product = IDL.Record({
    'id' : IDL.Text,
    'batch_number' : IDL.Opt(IDL.Text),
    'updated_at' : IDL.Nat64,
    'production_date' : IDL.Nat64,
    'manufacturer' : IDL.Text,
    'estimated_value' : IDL.Opt(IDL.Float64),
    'sustainability_score' : IDL.Opt(IDL.Float64),
    'name' : IDL.Text,
    'description' : IDL.Opt(IDL.Text),
    'created_at' : IDL.Nat64,
    'current_location' : IDL.Text,
    'category' : IDL.Text,
    'current_status' : ProductStatus,
    'certifications' : IDL.Vec(IDL.Text),
    'raw_materials' : IDL.Vec(IDL.Text),
    'manufacturer_id' : IDL.Principal,
  });
  const ProductWithHistory = IDL.Record({
    'supply_chain_events' : IDL.Vec(SupplyChainEvent),
    'ethical_score' : IDL.Float64,
    'product' : Product,
  });
  const Result_2 = IDL.Variant({ 'Ok' : ProductWithHistory, 'Err' : IDL.Text });
  const Result_3 = IDL.Variant({
    'Ok' : IDL.Vec(SupplyChainEvent),
    'Err' : IDL.Text,
  });
  const UserPermissions = IDL.Record({
    'can_register_products' : IDL.Bool,
    'can_verify_users' : IDL.Bool,
    'can_view_analytics' : IDL.Bool,
    'can_manage_partners' : IDL.Bool,
    'can_update_supply_chain' : IDL.Bool,
  });
  const UserRole = IDL.Variant({
    'LogisticsProvider' : IDL.Null,
    'QualityAssurance' : IDL.Null,
    'Retailer' : IDL.Null,
    'Consumer' : IDL.Null,
    'SupplyChainManager' : IDL.Null,
    'Admin' : IDL.Null,
    'Manufacturer' : IDL.Null,
  });
  const User = IDL.Record({
    'id' : IDL.Principal,
    'permissions' : UserPermissions,
    'role' : UserRole,
    'created_at' : IDL.Nat64,
    'email' : IDL.Text,
    'company' : IDL.Text,
    'is_verified' : IDL.Bool,
    'first_name' : IDL.Text,
    'last_name' : IDL.Text,
  });
  const Result = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const PartnerRegistration = IDL.Record({
    'contact_person' : IDL.Text,
    'contact_email' : IDL.Text,
    'company_name' : IDL.Text,
    'partner_type' : PartnerType,
    'certifications' : IDL.Vec(IDL.Text),
  });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const ProductRegistration = IDL.Record({
    'batch_number' : IDL.Opt(IDL.Text),
    'production_date' : IDL.Nat64,
    'estimated_value' : IDL.Opt(IDL.Float64),
    'sustainability_score' : IDL.Opt(IDL.Float64),
    'name' : IDL.Text,
    'description' : IDL.Opt(IDL.Text),
    'manufacturing_location' : IDL.Text,
    'category' : IDL.Text,
    'certifications' : IDL.Vec(IDL.Text),
    'raw_materials' : IDL.Vec(IDL.Text),
  });
  const UserRegistration = IDL.Record({
    'role' : UserRole,
    'email' : IDL.Text,
    'company' : IDL.Text,
    'first_name' : IDL.Text,
    'last_name' : IDL.Text,
  });
  const ProductSearchQuery = IDL.Record({
    'status' : IDL.Opt(ProductStatus),
    'manufacturer' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'limit' : IDL.Opt(IDL.Nat32),
    'category' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'add_supply_chain_event' : IDL.Func(
        [SupplyChainEventInput],
        [Result_1],
        [],
      ),
    'get_analytics' : IDL.Func([], [AnalyticsData], ['query']),
    'get_canister_status' : IDL.Func([], [CanisterStatus], ['query']),
    'get_partners' : IDL.Func([], [IDL.Vec(Partner)], ['query']),
    'get_product' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'get_supply_chain_events' : IDL.Func([IDL.Text], [Result_3], ['query']),
    'get_user' : IDL.Func([], [Result], ['query']),
    'register_partner' : IDL.Func([PartnerRegistration], [Result_4], []),
    'register_product' : IDL.Func([ProductRegistration], [Result_1], []),
    'register_user' : IDL.Func([UserRegistration], [Result], []),
    'search_products' : IDL.Func(
        [ProductSearchQuery],
        [IDL.Vec(Product)],
        ['query'],
      ),
    'update_user_verification' : IDL.Func(
        [IDL.Principal, IDL.Bool],
        [Result_4],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
