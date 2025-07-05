#!/bin/bash

# Deploy script for ICP Supply Chain Backend

echo "🚀 Deploying Supply Chain Backend to Internet Computer..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install dfx first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Start local replica if not running
echo "🔄 Starting local replica..."
dfx start --background --clean

# Deploy the canister
echo "📦 Building and deploying canister..."
dfx deploy supply_chain_backend

# Get canister ID
CANISTER_ID=$(dfx canister id supply_chain_backend)
echo "✅ Canister deployed successfully!"
echo "📋 Canister ID: $CANISTER_ID"

# Test basic functionality
echo "🧪 Testing basic functionality..."
dfx canister call supply_chain_backend get_canister_status

echo "🎉 Deployment complete!"
echo ""
echo "📚 Next steps:"
echo "1. Register a user: dfx canister call supply_chain_backend register_user '(record { email=\"test@example.com\"; first_name=\"Test\"; last_name=\"User\"; company=\"Test Company\"; role=variant { Manufacturer } })'"
echo "2. Register a product: dfx canister call supply_chain_backend register_product '(record { name=\"Test Product\"; category=\"Electronics\"; description=opt \"A test product\"; batch_number=opt \"BATCH001\"; production_date=1640995200000000000; manufacturing_location=\"Factory A\"; raw_materials=vec { \"Silicon\"; \"Plastic\" }; certifications=vec { \"ISO 9001\" }; sustainability_score=opt 85.0; estimated_value=opt 100.0 })'"
echo "3. View analytics: dfx canister call supply_chain_backend get_analytics"
