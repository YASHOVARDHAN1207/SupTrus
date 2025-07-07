#!/bin/bash

echo "🔐 Fixing Internet Identity Connection"
echo "====================================="

# Step 1: Stop everything and start fresh
echo "🧹 Cleaning up and starting fresh..."
cd icp_backend
dfx stop
rm -rf .dfx/
dfx start --background --clean

# Wait for dfx to be ready
echo "⏳ Waiting for dfx to be ready..."
sleep 10

# Step 2: Deploy supply chain backend first
echo "📦 Deploying supply chain backend..."
dfx deploy supply_chain_backend

# Step 3: Set up Internet Identity using dfx deps (recommended method)
echo "🔐 Setting up Internet Identity using dfx deps..."

# Create deps directory if it doesn't exist
mkdir -p deps/

# Create deps.json file
cat > deps.json << 'EOF'
{
  "canisters": {
    "internet_identity": {
      "canister_id": "rdmx6-jaaaa-aaaaa-aaadq-cai"
    }
  }
}
EOF

# Try dfx deps method first
echo "📥 Pulling Internet Identity dependency..."
if dfx deps pull; then
    echo "✅ Successfully pulled Internet Identity"
    dfx deps init internet_identity --argument '(null)'
    dfx deps deploy
else
    echo "⚠️ dfx deps failed, using manual method..."
    
    # Manual method as fallback
    echo "📦 Manual Internet Identity setup..."
    
    # Create the canister
    dfx canister create internet_identity --specified-id rdmx6-jaaaa-aaaaa-aaadq-cai
    
    # Download Internet Identity wasm
    echo "📥 Downloading Internet Identity wasm..."
    curl -L -o internet_identity.wasm.gz \
      "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz"
    
    if [ -f internet_identity.wasm.gz ]; then
        gunzip internet_identity.wasm.gz
        
        # Install Internet Identity
        dfx canister install internet_identity \
          --wasm internet_identity.wasm \
          --argument '(null)' \
          --mode install
        
        # Clean up
        rm -f internet_identity.wasm
        echo "✅ Manual Internet Identity setup complete"
    else
        echo "❌ Failed to download Internet Identity wasm"
        exit 1
    fi
fi

# Step 4: Verify both canisters are running
echo "🔍 Verifying canister status..."
dfx canister status supply_chain_backend
dfx canister status internet_identity

# Step 5: Test the canisters
echo "🧪 Testing canisters..."
dfx canister call supply_chain_backend get_canister_status
dfx canister call internet_identity stats

# Step 6: Get canister IDs and update environment
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity)

echo ""
echo "📋 Canister IDs:"
echo "Supply Chain: $SUPPLY_CHAIN_ID"
echo "Internet Identity: $II_CANISTER_ID"

# Step 7: Update environment variables
cd ..
cat > .env.local << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID
EOF

echo ""
echo "✅ Internet Identity connection fix complete!"
echo "============================================"
echo ""
echo "🔗 Important URLs:"
echo "• Internet Identity: http://$II_CANISTER_ID.localhost:4943"
echo "• Your App: http://localhost:3000"
echo ""
echo "📚 Next steps:"
echo "1. Restart your Next.js app: npm run dev"
echo "2. Clear browser cache for localhost:3000"
echo "3. Try connecting Internet Identity"
echo ""
echo "💡 If still not working:"
echo "• Check that dfx is running: dfx ping"
echo "• Visit Internet Identity directly: http://$II_CANISTER_ID.localhost:4943"
echo "• Check browser console for errors"
