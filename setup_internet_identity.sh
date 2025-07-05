#!/bin/bash

echo "🔐 Setting up Internet Identity for SupTrus"
echo "=========================================="

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install dfx first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Start local replica if not running
echo "🔄 Starting local replica..."
dfx start --background

# Check if Internet Identity is already deployed
if dfx canister status internet_identity &> /dev/null; then
    echo "✅ Internet Identity already deployed"
    II_CANISTER_ID=$(dfx canister id internet_identity)
else
    echo "🔄 Deploying Internet Identity canister..."
    
    # Deploy Internet Identity
    dfx deploy internet_identity
    
    if [ $? -eq 0 ]; then
        echo "✅ Internet Identity deployed successfully"
        II_CANISTER_ID=$(dfx canister id internet_identity)
    else
        echo "❌ Failed to deploy Internet Identity"
        echo "💡 Try running: dfx canister create internet_identity"
        exit 1
    fi
fi

# Deploy supply chain backend if not already deployed
if ! dfx canister status supply_chain_backend &> /dev/null; then
    echo "🔄 Deploying supply chain backend..."
    dfx deploy supply_chain_backend
fi

# Get canister IDs
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo "Internet Identity Canister ID: $II_CANISTER_ID"
echo "Supply Chain Canister ID: $SUPPLY_CHAIN_ID"
echo ""

# Update .env.local
echo "🔄 Updating .env.local..."
cat > .env.local << EOF
# ICP Configuration for Internet Identity
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID

# For production deployment on IC mainnet, use:
# NEXT_PUBLIC_DFX_NETWORK=ic
# NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=your-mainnet-canister-id
# NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
EOF

echo "✅ .env.local updated with canister IDs"
echo ""

# Test the setup
echo "🧪 Testing Internet Identity setup..."
echo "Internet Identity URL: http://$II_CANISTER_ID.localhost:4943"
echo ""

echo "📚 Next Steps:"
echo "1. Restart your Next.js development server: npm run dev"
echo "2. Visit your app and click 'Connect Internet Identity'"
echo "3. You'll be redirected to Internet Identity for authentication"
echo "4. Create a new identity or use an existing one"
echo "5. After authentication, you'll be connected to SupTrus"
echo ""

echo "🔗 Useful URLs:"
echo "• Your App: http://localhost:3000"
echo "• Internet Identity: http://$II_CANISTER_ID.localhost:4943"
echo "• Debug Page: http://localhost:3000/debug"
echo ""

echo "🎉 Internet Identity setup complete!"
