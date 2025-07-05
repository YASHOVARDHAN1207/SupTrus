#!/bin/bash

echo "⚡ Quick Fix - Deploy Backend Only"
echo "=================================="

cd icp_backend

# Remove Internet Identity from dfx.json temporarily
echo "📝 Updating dfx.json to remove Internet Identity..."
cat > dfx.json << 'EOF'
{
  "version": 1,
  "canisters": {
    "supply_chain_backend": {
      "type": "rust",
      "package": "supply_chain_backend",
      "candid": "supply_chain_backend.did"
    }
  },
  "defaults": {
    "build": {
      "args": "",
      "packtool": ""
    }
  },
  "output_env_file": ".env",
  "networks": {
    "local": {
      "bind": "127.0.0.1:4943",
      "type": "ephemeral"
    },
    "ic": {
      "providers": ["https://ic0.app"],
      "type": "persistent"
    }
  }
}
EOF

# Deploy your backend
echo "🚀 Deploying supply chain backend..."
dfx deploy

# Manual Internet Identity setup
echo "🔐 Setting up Internet Identity manually..."
dfx canister create internet_identity --specified-id rdmx6-jaaaa-aaaaa-aaadq-cai

# Download and install Internet Identity
curl -L -o ii.wasm.gz "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz"
gunzip ii.wasm.gz
dfx canister install internet_identity --wasm ii.wasm --argument '(null)'
rm ii.wasm

# Get IDs and update environment
SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
II_CANISTER_ID=$(dfx canister id internet_identity)

cd ..
cat > .env.local << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID
EOF

echo "✅ Quick fix complete!"
echo "Supply Chain: $SUPPLY_CHAIN_ID"
echo "Internet Identity: $II_CANISTER_ID"
echo ""
echo "🎯 Next: npm run dev"
