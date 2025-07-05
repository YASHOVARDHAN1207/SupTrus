#!/bin/bash

echo "🚀 Deploying Backend Only (Skip Internet Identity)"
echo "================================================="

cd icp_backend

# Step 1: Deploy only your supply chain backend
echo "📦 Deploying supply chain backend only..."
dfx deploy supply_chain_backend

# Step 2: Set up Internet Identity manually
echo "🔐 Setting up Internet Identity manually..."

# Create Internet Identity canister
dfx canister create internet_identity --specified-id rdmx6-jaaaa-aaaaa-aaadq-cai

# Download Internet Identity wasm
echo "📥 Downloading Internet Identity wasm..."
curl -L -o internet_identity.wasm.gz \
  "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz"

gunzip internet_identity.wasm.gz

# Install Internet Identity
echo "🔧 Installing Internet Identity..."
dfx canister install internet_identity --wasm internet_identity.wasm --argument '(null)'

# Clean up
rm -f internet_identity.wasm

# Step 3: Get canister IDs
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity)

echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo "Supply Chain: $SUPPLY_CHAIN_ID"
echo "Internet Identity: $II_CANISTER_ID"

# Step 4: Update environment
cd ..
cat > .env.local << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID
EOF

echo ""
echo "🔗 URLs:"
echo "• App: http://localhost:3000"
echo "• Internet Identity: http://$II_CANISTER_ID.localhost:4943"
echo ""
echo "🎉 Ready to use! Run: npm run dev"
