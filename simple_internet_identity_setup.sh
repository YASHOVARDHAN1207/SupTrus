#!/bin/bash

echo "🔐 Simple Internet Identity Setup"
echo "================================="

cd icp_backend

# Clean start
dfx stop
dfx start --background --clean

# Deploy backend first
echo "📦 Deploying supply chain backend..."
dfx deploy supply_chain_backend

# Simple Internet Identity setup without deps
echo "🔐 Setting up Internet Identity (simple method)..."

# Create Internet Identity canister with specific ID
dfx canister create internet_identity --specified-id rdmx6-jaaaa-aaaaa-aaadq-cai

# Download Internet Identity wasm
echo "📥 Downloading Internet Identity..."
curl -L -o ii.wasm.gz "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz"
gunzip ii.wasm.gz

# Install Internet Identity
dfx canister install internet_identity --wasm ii.wasm --argument '(null)'

# Clean up
rm -f ii.wasm

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

echo "✅ Simple setup complete!"
echo "Internet Identity: http://$II_CANISTER_ID.localhost:4943"
