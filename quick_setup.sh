#!/bin/bash

echo "🚀 Quick Setup for SupTrus Internet Identity"
echo "============================================"

# Method 1: Use dfx deps (Recommended)
echo "📦 Method 1: Using dfx deps..."

cd icp_backend

# Stop and clean start dfx
dfx stop
dfx start --background --clean

# Pull and deploy Internet Identity as dependency
dfx deps pull
dfx deps init internet_identity --argument '(null)'
dfx deps deploy

# Deploy your backend
dfx deploy supply_chain_backend

# Get IDs and update env
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity)

cd ..
echo "NEXT_PUBLIC_DFX_NETWORK=local" > .env.local
echo "NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID" >> .env.local
echo "NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID" >> .env.local

echo "✅ Setup complete!"
echo "Internet Identity: http://$II_CANISTER_ID.localhost:4943"
echo "Your app: http://localhost:3000"
