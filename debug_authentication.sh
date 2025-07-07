#!/bin/bash

echo "🔍 Debugging Authentication Issues"
echo "================================="

cd icp_backend

echo "📊 Checking canister status..."
dfx canister status supply_chain_backend
dfx canister status internet_identity

echo ""
echo "🧪 Testing canister calls..."
dfx canister call supply_chain_backend get_canister_status

echo ""
echo "📋 Checking dfx identity..."
dfx identity whoami
dfx identity get-principal

echo ""
echo "🔗 Checking network configuration..."
dfx ping

echo ""
echo "📦 Checking canister IDs..."
echo "Supply Chain: $(dfx canister id supply_chain_backend)"
echo "Internet Identity: $(dfx canister id internet_identity)"

echo ""
echo "🌐 Environment variables:"
cd ..
cat .env.local

echo ""
echo "💡 If issues persist:"
echo "1. Clear browser cache completely"
echo "2. Try incognito/private browsing"
echo "3. Check browser console for errors"
echo "4. Restart dfx: dfx stop && dfx start --background --clean"
