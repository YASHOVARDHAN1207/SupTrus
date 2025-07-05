#!/bin/bash

echo "🎉 Post-Deployment Setup"
echo "========================"

cd icp_backend

# Get the canister IDs from the deployment
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity)

echo "📋 Canister IDs:"
echo "Supply Chain: $SUPPLY_CHAIN_ID"
echo "Internet Identity: $II_CANISTER_ID"

# Update environment variables
echo "🌐 Updating environment variables..."
cd ..
cat > .env.local << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID
EOF

echo "✅ Environment updated!"

# Test canister status
echo "🧪 Testing canister status..."
cd icp_backend
dfx canister status supply_chain_backend
dfx canister status internet_identity

echo ""
echo "🔗 Important URLs:"
echo "================================"
echo "• Your App: http://localhost:3000"
echo "• Internet Identity: http://$II_CANISTER_ID.localhost:4943"
echo "• Supply Chain Candid UI: http://127.0.0.1:4943/?canisterId=u6s2n-gx777-77774-qaaba-cai&id=$SUPPLY_CHAIN_ID"
echo "• Internet Identity Candid UI: http://127.0.0.1:4943/?canisterId=u6s2n-gx777-77774-qaaba-cai&id=$II_CANISTER_ID"

echo ""
echo "📚 Next Steps:"
echo "1. Start frontend: npm run dev"
echo "2. Visit: http://localhost:3000"
echo "3. Connect Internet Identity"
echo "4. Register your first product!"
