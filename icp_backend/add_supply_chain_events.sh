#!/bin/bash

# Script to add supply chain events for testing
# Run this after populating test data

echo "🚚 Adding supply chain events for testing..."

# Function to add supply chain event
add_event() {
    local product_id=$1
    local stage=$2
    local location=$3
    local status=$4
    local details=$5
    local certs=$6
    
    echo "📍 Adding $stage event for product $product_id"
    dfx canister call supply_chain_backend add_supply_chain_event "(record { 
        product_id=\"$product_id\"; 
        stage=variant { $stage }; 
        location=\"$location\"; 
        status=variant { $status }; 
        details=\"$details\"; 
        certifications=$certs; 
        estimated_arrival=null; 
        metadata=vec {} 
    })"
    echo ""
}

# Get a product ID first (you'll need to replace this with actual IDs from your deployment)
echo "📋 First, let's get some product IDs..."
echo "Run this command to see available products:"
echo "dfx canister call supply_chain_backend search_products '(record { name=null; category=null; manufacturer=null; status=null; limit=opt 5 })'"
echo ""
echo "Then replace PRODUCT_ID_HERE in the examples below with actual product IDs"
echo ""

# Example events (replace PRODUCT_ID_HERE with actual product IDs)
cat << 'EOF'
# Example commands to add supply chain events:

# Manufacturing stage
dfx canister call supply_chain_backend add_supply_chain_event "(record { 
    product_id=\"PRODUCT_ID_HERE\"; 
    stage=variant { Manufacturing }; 
    location=\"Mumbai, India\"; 
    status=variant { Completed }; 
    details=\"Manufacturing completed with quality checks\"; 
    certifications=vec { \"ISO 9001\"; \"Quality Approved\" }; 
    estimated_arrival=null; 
    metadata=vec {} 
})"

# Quality Control stage
dfx canister call supply_chain_backend add_supply_chain_event "(record { 
    product_id=\"PRODUCT_ID_HERE\"; 
    stage=variant { QualityControl }; 
    location=\"Mumbai, India\"; 
    status=variant { Completed }; 
    details=\"Passed all quality control tests\"; 
    certifications=vec { \"QC Approved\"; \"Safety Tested\" }; 
    estimated_arrival=null; 
    metadata=vec {} 
})"

# Packaging stage
dfx canister call supply_chain_backend add_supply_chain_event "(record { 
    product_id=\"PRODUCT_ID_HERE\"; 
    stage=variant { Packaging }; 
    location=\"Mumbai, India\"; 
    status=variant { Completed }; 
    details=\"Packaged with eco-friendly materials\"; 
    certifications=vec { \"Eco-Packaging\" }; 
    estimated_arrival=null; 
    metadata=vec {} 
})"

# Shipping stage
dfx canister call supply_chain_backend add_supply_chain_event "(record { 
    product_id=\"PRODUCT_ID_HERE\"; 
    stage=variant { Shipping }; 
    location=\"Mumbai Port, India\"; 
    status=variant { InProgress }; 
    details=\"Shipped via container vessel to Los Angeles\"; 
    certifications=vec { \"Export Certificate\" }; 
    estimated_arrival=opt 1704153600000000000; 
    metadata=vec { record { \"carrier\"; \"GlobalShip Logistics\" }; record { \"vessel\"; \"MV Ocean Star\" } } 
})"

# Distribution stage
dfx canister call supply_chain_backend add_supply_chain_event "(record { 
    product_id=\"PRODUCT_ID_HERE\"; 
    stage=variant { Distribution }; 
    location=\"Los Angeles, CA, USA\"; 
    status=variant { Completed }; 
    details=\"Arrived at distribution center and sorted\"; 
    certifications=vec { \"Import Cleared\" }; 
    estimated_arrival=null; 
    metadata=vec { record { \"warehouse\"; \"LA Distribution Hub\" } } 
})"

# Retail stage
dfx canister call supply_chain_backend add_supply_chain_event "(record { 
    product_id=\"PRODUCT_ID_HERE\"; 
    stage=variant { Retail }; 
    location=\"San Francisco, CA, USA\"; 
    status=variant { Completed }; 
    details=\"Product delivered to retail store\"; 
    certifications=vec {}; 
    estimated_arrival=null; 
    metadata=vec { record { \"store\"; \"EcoStore Downtown\" } } 
})"
EOF

echo "💡 To use these commands:"
echo "1. First run the test_data.sh script to populate users and products"
echo "2. Get product IDs using the search command above"
echo "3. Replace PRODUCT_ID_HERE with actual product IDs"
echo "4. Run the commands to add supply chain events"
