#!/bin/bash

echo "🔐 Manual Internet Identity Setup"
echo "================================="

cd icp_backend

# Step 1: Clean setup
dfx stop
dfx start --background --clean

# Step 2: Deploy your backend first
echo "📦 Deploying supply chain backend..."
dfx deploy supply_chain_backend

# Step 3: Create Internet Identity canister manually
echo "🔐 Creating Internet Identity canister..."
dfx canister create internet_identity --specified-id rdmx6-jaaaa-aaaaa-aaadq-cai

# Step 4: Download Internet Identity files
echo "📥 Downloading Internet Identity files..."

# Download the wasm file
curl -L -o internet_identity.wasm.gz \
  "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz"

# Download the candid file
curl -L -o internet_identity.did \
  "https://raw.githubusercontent.com/dfinity/internet-identity/main/src/internet_identity/internet_identity.did"

# Extract wasm
gunzip internet_identity.wasm.gz

# Step 5: Install Internet Identity
echo "🔧 Installing Internet Identity..."
dfx canister install internet_identity \
  --wasm internet_identity.wasm \
  --argument '(null)'

# Step 6: Verify installation
echo "✅ Verifying installation..."
dfx canister status internet_identity
dfx canister status supply_chain_backend

# Step 7: Get canister IDs
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity)

echo ""
echo "✅ Manual setup complete!"
echo "========================="
echo "Supply Chain Canister: $SUPPLY_CHAIN_ID"
echo "Internet Identity: $II_CANISTER_ID"

# Step 8: Update environment
cd ..
cat > .env.local << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID
EOF

echo ""
echo "🔗 URLs:"
echo "• Internet Identity: http://$II_CANISTER_ID.localhost:4943"
echo "• Your App: http://localhost:3000"

# Clean up downloaded files
cd icp_backend
rm -f internet_identity.wasm internet_identity.did

echo ""
echo "🎉 Setup complete! You can now:"
echo "1. Run: npm run dev"
echo "2. Visit: http://localhost:3000"
echo "3. Click 'Connect Internet Identity'"
