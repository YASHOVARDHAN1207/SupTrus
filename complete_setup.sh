#!/bin/bash

echo "🚀 Complete SupTrus Setup"
echo "========================"

# Navigate to backend directory
cd icp_backend

# Step 1: Fix Rust dependencies
echo "🔧 Step 1: Fixing Rust dependencies..."
cargo generate-lockfile
cargo update
cargo clean

# Step 2: Install wasm32 target if not present
echo "🎯 Step 2: Installing wasm32 target..."
rustup target add wasm32-unknown-unknown

# Step 3: Test local build
echo "🔨 Step 3: Testing local build..."
cargo build --target wasm32-unknown-unknown --release

if [ $? -ne 0 ]; then
    echo "❌ Local build failed. Please check Rust setup."
    exit 1
fi

# Step 4: Stop and restart dfx
echo "🔄 Step 4: Restarting dfx..."
dfx stop
dfx start --background --clean

# Step 5: Deploy supply chain backend only first
echo "📦 Step 5: Deploying supply chain backend..."
dfx deploy supply_chain_backend

# Step 6: Setup Internet Identity
echo "🔐 Step 6: Setting up Internet Identity..."
dfx deps pull
dfx deps init internet_identity --argument '(null)'
dfx deps deploy

# Step 7: Get canister IDs
echo "📋 Step 7: Getting canister IDs..."
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity)

# Step 8: Update environment variables
echo "🌐 Step 8: Updating environment variables..."
cd ..
cat > .env.local << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID
EOF

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo "Supply Chain Canister: $SUPPLY_CHAIN_ID"
echo "Internet Identity: $II_CANISTER_ID"
echo ""
echo "🔗 URLs:"
echo "• App: http://localhost:3000"
echo "• Internet Identity: http://$II_CANISTER_ID.localhost:4943"
echo ""
echo "📚 Next steps:"
echo "1. Run: npm run dev"
echo "2. Visit: http://localhost:3000"
echo "3. Click 'Connect Internet Identity'"
