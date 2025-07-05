#!/bin/bash

echo "🧪 Testing Canister Functions"
echo "============================="

cd icp_backend

echo "📊 Getting canister status..."
dfx canister call supply_chain_backend get_canister_status

echo ""
echo "📈 Getting analytics..."
dfx canister call supply_chain_backend get_analytics

echo ""
echo "👤 Testing user registration..."
dfx canister call supply_chain_backend register_user '(record { 
  email="test@example.com"; 
  first_name="Test"; 
  last_name="User"; 
  company="Test Company"; 
  role=variant { Manufacturer } 
})'

echo ""
echo "📦 Testing product registration..."
dfx canister call supply_chain_backend register_product '(record { 
  name="Test Product"; 
  category="Electronics"; 
  description=opt "A test product for demo"; 
  batch_number=opt "TEST001"; 
  production_date=1704067200000000000; 
  manufacturing_location="Test Location"; 
  raw_materials=vec { "Silicon"; "Plastic" }; 
  certifications=vec { "ISO 9001" }; 
  sustainability_score=opt 85.0; 
  estimated_value=opt 100.0 
})'

echo ""
echo "✅ Canister tests complete!"
