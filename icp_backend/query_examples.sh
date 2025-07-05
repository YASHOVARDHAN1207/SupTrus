#!/bin/bash

# Example queries for testing the ICP Supply Chain Backend

echo "🔍 ICP Supply Chain Backend - Query Examples"
echo "============================================="

# Function to run query with description
run_query() {
    local description=$1
    local command=$2
    
    echo ""
    echo "📋 $description"
    echo "Command: $command"
    echo "Result:"
    eval $command
    echo ""
    echo "----------------------------------------"
}

# Basic status checks
run_query "Get Canister Status" \
    "dfx canister call supply_chain_backend get_canister_status"

run_query "Get Analytics Dashboard" \
    "dfx canister call supply_chain_backend get_analytics"

# User queries
run_query "Get Current User Info" \
    "dfx canister call supply_chain_backend get_user"

# Product queries
run_query "Search All Products (limit 5)" \
    "dfx canister call supply_chain_backend search_products '(record { name=null; category=null; manufacturer=null; status=null; limit=opt 5 })'"

run_query "Search Products by Category (Apparel)" \
    "dfx canister call supply_chain_backend search_products '(record { name=null; category=opt \"Apparel\"; manufacturer=null; status=null; limit=opt 10 })'"

run_query "Search Products by Name (Cotton)" \
    "dfx canister call supply_chain_backend search_products '(record { name=opt \"Cotton\"; category=null; manufacturer=null; status=null; limit=opt 10 })'"

run_query "Search Products by Status (Manufacturing)" \
    "dfx canister call supply_chain_backend search_products '(record { name=null; category=null; manufacturer=null; status=opt variant { Manufacturing }; limit=opt 10 })'"

# Partner queries
run_query "Get All Partners" \
    "dfx canister call supply_chain_backend get_partners"

echo ""
echo "💡 Additional Commands You Can Try:"
echo ""
echo "🔸 Get specific product details:"
echo "   dfx canister call supply_chain_backend get_product '(\"PRODUCT_ID_HERE\")'"
echo ""
echo "🔸 Get supply chain events for a product:"
echo "   dfx canister call supply_chain_backend get_supply_chain_events '(\"PRODUCT_ID_HERE\")'"
echo ""
echo "🔸 Register a new user:"
echo "   dfx canister call supply_chain_backend register_user '(record { email=\"test@example.com\"; first_name=\"Test\"; last_name=\"User\"; company=\"Test Company\"; role=variant { Consumer } })'"
echo ""
echo "🔸 Register a new product:"
echo "   dfx canister call supply_chain_backend register_product '(record { name=\"Test Product\"; category=\"Test\"; description=opt \"A test product\"; batch_number=opt \"TEST001\"; production_date=1704067200000000000; manufacturing_location=\"Test Location\"; raw_materials=vec { \"Test Material\" }; certifications=vec { \"Test Cert\" }; sustainability_score=opt 80.0; estimated_value=opt 50.0 })'"
echo ""
