#!/bin/bash

echo "🧪 Testing Product Management Functions"
echo "======================================"

cd icp_backend

echo "📊 Testing canister status..."
dfx canister call supply_chain_backend get_canister_status

echo ""
echo "📦 Testing get_all_products..."
dfx canister call supply_chain_backend get_all_products

echo ""
echo "👤 Testing get_user_products..."
dfx canister call supply_chain_backend get_user_products

echo ""
echo "📈 Testing analytics..."
dfx canister call supply_chain_backend get_analytics

echo ""
echo "🔍 Testing search_products..."
dfx canister call supply_chain_backend search_products '(record { 
  name=null; 
  category=null; 
  manufacturer=null; 
  status=null; 
  limit=opt 10 
})'

echo ""
echo "✅ Product management tests complete!"
echo ""
echo "💡 If you see empty results, register some products first:"
echo "1. Go to http://localhost:3000/register"
echo "2. Connect your Internet Identity"
echo "3. Register a product"
echo "4. Check the dashboard"
