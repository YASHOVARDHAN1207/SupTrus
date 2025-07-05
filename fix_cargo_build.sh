#!/bin/bash

echo "🔧 Fixing Cargo Build Issues"
echo "============================"

cd icp_backend

# Step 1: Generate Cargo.lock file
echo "📦 Generating Cargo.lock file..."
cargo generate-lockfile

# Step 2: Update dependencies
echo "🔄 Updating Cargo dependencies..."
cargo update

# Step 3: Clean build cache
echo "🧹 Cleaning build cache..."
cargo clean

# Step 4: Build locally first to verify
echo "🔨 Testing local build..."
cargo build --target wasm32-unknown-unknown --release

# Step 5: Deploy with dfx
echo "🚀 Deploying with dfx..."
dfx deploy supply_chain_backend

echo "✅ Build fix complete!"
