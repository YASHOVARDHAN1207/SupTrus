#!/bin/bash

echo "🔄 Redeploying Backend with Product Management Fixes"
echo "=================================================="

cd icp_backend

# Step 1: Stop dfx and clean build
echo "🧹 Cleaning build..."
dfx stop
cargo clean

# Step 2: Build locally first
echo "🔨 Building locally..."
cargo build --target wasm32-unknown-unknown --release

if [ $? -ne 0 ]; then
    echo "❌ Local build failed. Please check Rust code."
    exit 1
fi

# Step 3: Start dfx and redeploy
echo "🚀 Starting dfx and redeploying..."
dfx start --background --clean
sleep 5

# Deploy supply chain backend
dfx deploy supply_chain_backend

# Step 4: Verify deployment
echo "✅ Verifying deployment..."
dfx canister status supply_chain_backend

# Step 5: Test new functions
echo "🧪 Testing new functions..."
dfx canister call supply_chain_backend get_canister_status
dfx canister call supply_chain_backend get_all_products

# Step 6: Get canister IDs and update environment
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity 2>/dev/null || echo "rdmx6-jaaaa-aaaaa-aaadq-cai")

cd ..
cat > .env.local << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID
EOF

echo ""
echo "✅ Backend redeployment complete!"
echo "================================="
echo "Supply Chain Canister: $SUPPLY_CHAIN_ID"
echo "Internet Identity: $II_CANISTER_ID"
echo ""
echo "📚 Next steps:"
echo "1. Restart your Next.js app: npm run dev"
echo "2. Connect your Internet Identity wallet"
echo "3. Register some products"
echo "4. Check the dashboard - your products should now appear!"
echo ""
echo "🔗 URLs:"
echo "• Dashboard: http://localhost:3000/dashboard"
echo "• Register: http://localhost:3000/register"
