#!/bin/bash

echo "📦 Populating Test Data"
echo "======================="

cd icp_backend

# Register test users
echo "👥 Registering test users..."

dfx canister call supply_chain_backend register_user '(record { 
  email="manufacturer@example.com"; 
  first_name="John"; 
  last_name="Manufacturer"; 
  company="EcoTextiles Ltd."; 
  role=variant { Manufacturer } 
})'

dfx canister call supply_chain_backend register_user '(record { 
  email="logistics@example.com"; 
  first_name="Sarah"; 
  last_name="Logistics"; 
  company="GlobalShip Logistics"; 
  role=variant { LogisticsProvider } 
})'

# Register test products
echo "📦 Registering test products..."

dfx canister call supply_chain_backend register_product '(record { 
  name="Organic Cotton T-Shirt"; 
  category="Apparel"; 
  description=opt "100% organic cotton t-shirt with natural dyes"; 
  batch_number=opt "BATCH-TEX-001"; 
  production_date=1704067200000000000; 
  manufacturing_location="Mumbai, India"; 
  raw_materials=vec { "Organic Cotton"; "Natural Dyes" }; 
  certifications=vec { "GOTS Certified"; "Fair Trade" }; 
  sustainability_score=opt 95.0; 
  estimated_value=opt 25.99 
})'

dfx canister call supply_chain_backend register_product '(record { 
  name="Solar Power Bank"; 
  category="Electronics"; 
  description=opt "Portable solar-powered charging device"; 
  batch_number=opt "BATCH-ELEC-001"; 
  production_date=1704067200000000000; 
  manufacturing_location="Shenzhen, China"; 
  raw_materials=vec { "Solar Cells"; "Lithium Battery"; "Recycled Aluminum" }; 
  certifications=vec { "RoHS Compliant"; "Energy Star" }; 
  sustainability_score=opt 85.0; 
  estimated_value=opt 89.99 
})'

echo "✅ Test data populated!"

# Show analytics
echo "📊 Current analytics:"
dfx canister call supply_chain_backend get_analytics
