#!/bin/bash

echo "🔧 Fixing Signature Verification Issues"
echo "======================================="

cd icp_backend

# Step 1: Stop dfx and clean everything
echo "🧹 Cleaning up dfx state..."
dfx stop
rm -rf .dfx/

# Step 2: Start fresh
echo "🔄 Starting fresh dfx instance..."
dfx start --background --clean

# Wait for dfx to be ready
sleep 5

# Step 3: Deploy supply chain backend first
echo "📦 Deploying supply chain backend..."
dfx deploy supply_chain_backend

# Step 4: Create Internet Identity with proper setup
echo "🔐 Setting up Internet Identity properly..."

# Create the canister first
dfx canister create internet_identity --specified-id rdmx6-jaaaa-aaaaa-aaadq-cai

# Download the latest Internet Identity wasm
echo "📥 Downloading Internet Identity wasm..."
curl -L -o internet_identity.wasm.gz \
  "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz"

gunzip internet_identity.wasm.gz

# Install with proper initialization
echo "🔧 Installing Internet Identity..."
dfx canister install internet_identity \
  --wasm internet_identity.wasm \
  --argument '(null)' \
  --mode install

# Clean up
rm -f internet_identity.wasm

# Step 5: Verify both canisters are working
echo "✅ Verifying canister status..."
dfx canister status supply_chain_backend
dfx canister status internet_identity

# Step 6: Test the supply chain canister
echo "🧪 Testing supply chain canister..."
dfx canister call supply_chain_backend get_canister_status

# Step 7: Update environment variables
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity)

cd ..
cat > .env.local << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID
EOF

echo ""
echo "✅ Signature verification fix complete!"
echo "======================================"
echo "Supply Chain Canister: $SUPPLY_CHAIN_ID"
echo "Internet Identity: $II_CANISTER_ID"
echo ""
echo "🔗 URLs:"
echo "• Internet Identity: http://$II_CANISTER_ID.localhost:4943"
echo "• Your App: http://localhost:3000"
echo ""
echo "📚 Next steps:"
echo "1. Restart your Next.js app: npm run dev"
echo "2. Clear browser cache and cookies for localhost:3000"
echo "3. Try connecting Internet Identity again"
echo "4. Register a product"
