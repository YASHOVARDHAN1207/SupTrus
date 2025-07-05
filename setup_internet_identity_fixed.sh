#!/bin/bash

echo "🔐 Setting up Internet Identity for SupTrus (Fixed Version)"
echo "=========================================="

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install dfx first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Navigate to the backend directory
cd icp_backend

# Stop any existing dfx process
echo "🔄 Stopping any existing dfx processes..."
dfx stop

# Start local replica
echo "🔄 Starting local replica..."
dfx start --background --clean

# Wait for replica to be ready
echo "⏳ Waiting for replica to be ready..."
sleep 5

# Install Internet Identity using dfx deps
echo "🔄 Installing Internet Identity dependency..."
dfx deps pull
dfx deps init internet_identity --argument '(null)'
dfx deps deploy

# Deploy supply chain backend
echo "🔄 Deploying supply chain backend..."
dfx deploy supply_chain_backend

# Get canister IDs
echo "📋 Getting canister IDs..."
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity)

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo "Internet Identity Canister ID: $II_CANISTER_ID"
echo "Supply Chain Canister ID: $SUPPLY_CHAIN_ID"
echo ""

# Update .env.local in parent directory
echo "🔄 Updating .env.local..."
cd ..
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
echo "🧪 Testing setup..."
cd icp_backend
dfx canister status internet_identity
dfx canister status supply_chain_backend

echo ""
echo "📚 Next Steps:"
echo "1. Start your Next.js development server: npm run dev"
echo "2. Visit your app: http://localhost:3000"
echo "3. Click 'Connect Internet Identity'"
echo "4. Visit Internet Identity: http://$II_CANISTER_ID.localhost:4943"
echo ""

echo "🔗 Useful URLs:"
echo "• Your App: http://localhost:3000"
echo "• Internet Identity: http://$II_CANISTER_ID.localhost:4943"
echo "• Debug Page: http://localhost:3000/debug"
echo ""

echo "🎉 Internet Identity setup complete!"
