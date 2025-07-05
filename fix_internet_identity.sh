#!/bin/bash

echo "🔐 Fixing Internet Identity Setup"
echo "================================="

cd icp_backend

# Step 1: Clean up any existing deps
echo "🧹 Cleaning up existing deps..."
rm -rf deps/
rm -rf .dfx/local/canisters/internet_identity/

# Step 2: Stop and restart dfx clean
echo "🔄 Restarting dfx clean..."
dfx stop
dfx start --background --clean

# Step 3: Deploy supply chain backend first (this works)
echo "📦 Deploying supply chain backend first..."
dfx deploy supply_chain_backend

# Step 4: Create deps directory structure
echo "📁 Creating deps directory structure..."
mkdir -p deps/candid/
mkdir -p deps/pulled/

# Step 5: Download Internet Identity candid file manually
echo "📥 Downloading Internet Identity candid file..."
curl -o deps/candid/rdmx6-jaaaa-aaaaa-aaadq-cai.did \
  "https://raw.githubusercontent.com/dfinity/internet-identity/main/src/internet_identity/internet_identity.did"

# Step 6: Try dfx deps approach
echo "🔄 Setting up Internet Identity with dfx deps..."
dfx deps pull
dfx deps init internet_identity --argument '(null)'
dfx deps deploy

# If that fails, try alternative method
if [ $? -ne 0 ]; then
    echo "⚠️ dfx deps failed, trying alternative method..."
    
    # Method 2: Manual Internet Identity setup
    echo "📦 Setting up Internet Identity manually..."
    
    # Create Internet Identity canister
    dfx canister create internet_identity --specified-id rdmx6-jaaaa-aaaaa-aaadq-cai
    
    # Download and install Internet Identity wasm
    echo "📥 Downloading Internet Identity wasm..."
    curl -L -o internet_identity.wasm.gz \
      "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz"
    
    gunzip internet_identity.wasm.gz
    
    # Install the wasm
    dfx canister install internet_identity --wasm internet_identity.wasm --argument '(null)'
    
    # Clean up
    rm -f internet_identity.wasm
fi

# Step 7: Get canister IDs and update env
echo "📋 Getting canister IDs..."
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity)

echo "✅ Canister IDs:"
echo "Supply Chain: $SUPPLY_CHAIN_ID"
echo "Internet Identity: $II_CANISTER_ID"

# Step 8: Update environment file
cd ..
cat > .env.local << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID
EOF

echo "✅ Internet Identity setup complete!"
echo ""
echo "🔗 Test URLs:"
echo "• Internet Identity: http://$II_CANISTER_ID.localhost:4943"
echo "• Your App: http://localhost:3000"
