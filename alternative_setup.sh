#!/bin/bash

echo "🔄 Alternative Setup Method"
echo "=========================="

# Method 2: Manual Internet Identity setup
echo "📦 Setting up Internet Identity manually..."

cd icp_backend

# Stop dfx
dfx stop

# Start clean
dfx start --background --clean

# Create Internet Identity canister manually
dfx canister create internet_identity

# Install Internet Identity wasm
echo "📥 Downloading Internet Identity wasm..."
curl -o internet_identity.wasm.gz "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz"
gunzip internet_identity.wasm.gz

# Install the wasm
dfx canister install internet_identity --wasm internet_identity.wasm --argument '(null)'

# Deploy your backend
dfx deploy supply_chain_backend

# Get IDs
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity)

# Update env
cd ..
cat > .env.local << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID
EOF

echo "✅ Alternative setup complete!"
echo "Internet Identity: http://$II_CANISTER_ID.localhost:4943"

# Clean up
cd icp_backend
rm -f internet_identity.wasm
