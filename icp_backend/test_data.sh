#!/bin/bash

# Test Data Script for ICP Supply Chain Backend
# This script registers multiple users and products for testing

echo "🧪 Populating ICP Supply Chain Backend with test data..."

# Check if dfx is running
if ! dfx ping > /dev/null 2>&1; then
    echo "❌ dfx is not running. Please start dfx first with 'dfx start --background'"
    exit 1
fi

# Get canister ID
CANISTER_ID=$(dfx canister id supply_chain_backend 2>/dev/null)
if [ -z "$CANISTER_ID" ]; then
    echo "❌ supply_chain_backend canister not found. Please deploy first with './deploy.sh'"
    exit 1
fi

echo "📋 Using canister ID: $CANISTER_ID"
echo ""

# Function to register a user
register_user() {
    local email=$1
    local first_name=$2
    local last_name=$3
    local company=$4
    local role=$5
    
    echo "👤 Registering user: $first_name $last_name ($email)"
    dfx canister call supply_chain_backend register_user "(record { 
        email=\"$email\"; 
        first_name=\"$first_name\"; 
        last_name=\"$last_name\"; 
        company=\"$company\"; 
        role=variant { $role } 
    })"
    echo ""
}

# Function to register a product
register_product() {
    local name=$1
    local category=$2
    local description=$3
    local batch=$4
    local location=$5
    local materials=$6
    local certs=$7
    local sustainability=$8
    local value=$9
    
    echo "📦 Registering product: $name"
    dfx canister call supply_chain_backend register_product "(record { 
        name=\"$name\"; 
        category=\"$category\"; 
        description=opt \"$description\"; 
        batch_number=opt \"$batch\"; 
        production_date=1704067200000000000; 
        manufacturing_location=\"$location\"; 
        raw_materials=$materials; 
        certifications=$certs; 
        sustainability_score=opt $sustainability; 
        estimated_value=opt $value 
    })"
    echo ""
}

# Register Test Users
echo "🔥 Registering test users..."
echo "================================"

# Manufacturer Users
register_user "john.doe@ecotextiles.com" "John" "Doe" "EcoTextiles Ltd." "Manufacturer"
register_user "sarah.green@organicfarms.com" "Sarah" "Green" "Organic Farms Co." "Manufacturer"
register_user "mike.chen@techcorp.com" "Mike" "Chen" "TechCorp Electronics" "Manufacturer"

# Logistics Users
register_user "lisa.transport@globalship.com" "Lisa" "Transport" "GlobalShip Logistics" "LogisticsProvider"
register_user "carlos.freight@fasttrack.com" "Carlos" "Freight" "FastTrack Shipping" "LogisticsProvider"

# Retailer Users
register_user "emma.retail@ecostore.com" "Emma" "Retail" "EcoStore Chain" "Retailer"
register_user "david.sales@techmart.com" "David" "Sales" "TechMart Retail" "Retailer"

# Quality Assurance Users
register_user "anna.quality@certifyplus.com" "Anna" "Quality" "CertifyPlus QA" "QualityAssurance"

# Supply Chain Manager
register_user "robert.manager@supplyhub.com" "Robert" "Manager" "SupplyHub Solutions" "SupplyChainManager"

# Admin User
register_user "admin@suptrus.com" "Admin" "User" "SupTrus Platform" "Admin"

echo "✅ User registration completed!"
echo ""

# Wait a moment for users to be processed
sleep 2

echo "🔥 Registering test products..."
echo "================================"

# Apparel Products
register_product \
    "Organic Cotton T-Shirt" \
    "Apparel" \
    "100% organic cotton t-shirt with natural dyes" \
    "BATCH-TEX-001" \
    "Mumbai, India" \
    "vec { \"Organic Cotton\"; \"Natural Dyes\"; \"Recycled Polyester\" }" \
    "vec { \"GOTS Certified\"; \"Fair Trade\"; \"OEKO-TEX Standard 100\" }" \
    "95.0" \
    "25.99"

register_product \
    "Bamboo Fiber Hoodie" \
    "Apparel" \
    "Sustainable bamboo fiber hoodie with organic cotton blend" \
    "BATCH-TEX-002" \
    "Bangalore, India" \
    "vec { \"Bamboo Fiber\"; \"Organic Cotton\"; \"Natural Dyes\" }" \
    "vec { \"GOTS Certified\"; \"Cradle to Cradle\" }" \
    "92.0" \
    "45.99"

register_product \
    "Recycled Denim Jeans" \
    "Apparel" \
    "Jeans made from 80% recycled denim and organic cotton" \
    "BATCH-TEX-003" \
    "Guatemala City, Guatemala" \
    "vec { \"Recycled Denim\"; \"Organic Cotton\"; \"Eco-friendly Dyes\" }" \
    "vec { \"Fair Trade\"; \"B Corp Certified\" }" \
    "88.0" \
    "65.99"

# Electronics Products
register_product \
    "Solar Power Bank" \
    "Electronics" \
    "Portable solar-powered charging device with recycled materials" \
    "BATCH-ELEC-001" \
    "Shenzhen, China" \
    "vec { \"Recycled Aluminum\"; \"Solar Cells\"; \"Lithium Battery\" }" \
    "vec { \"RoHS Compliant\"; \"Energy Star\"; \"ISO 14001\" }" \
    "85.0" \
    "89.99"

register_product \
    "Biodegradable Phone Case" \
    "Electronics" \
    "Compostable phone case made from plant-based materials" \
    "BATCH-ELEC-002" \
    "San Francisco, USA" \
    "vec { \"PLA Bioplastic\"; \"Bamboo Fiber\"; \"Natural Pigments\" }" \
    "vec { \"Biodegradable\"; \"Non-toxic\" }" \
    "90.0" \
    "19.99"

register_product \
    "Refurbished Laptop" \
    "Electronics" \
    "Professionally refurbished laptop with extended warranty" \
    "BATCH-ELEC-003" \
    "Austin, USA" \
    "vec { \"Recycled Components\"; \"New Battery\"; \"Refurbished Parts\" }" \
    "vec { \"EPEAT Gold\"; \"Energy Star\"; \"Warranty Certified\" }" \
    "78.0" \
    "599.99"

# Food & Beverage Products
register_product \
    "Fair Trade Coffee Beans" \
    "Food & Beverage" \
    "Single-origin arabica coffee beans from sustainable farms" \
    "BATCH-FOOD-001" \
    "Medellín, Colombia" \
    "vec { \"Arabica Coffee Beans\"; \"Natural Processing\" }" \
    "vec { \"Fair Trade\"; \"Organic\"; \"Rainforest Alliance\" }" \
    "94.0" \
    "12.99"

register_product \
    "Organic Quinoa" \
    "Food & Beverage" \
    "Premium organic quinoa from high-altitude farms" \
    "BATCH-FOOD-002" \
    "La Paz, Bolivia" \
    "vec { \"Organic Quinoa\"; \"Natural Packaging\" }" \
    "vec { \"Organic\"; \"Fair Trade\"; \"Non-GMO\" }" \
    "91.0" \
    "8.99"

register_product \
    "Sustainable Honey" \
    "Food & Beverage" \
    "Raw honey from bee-friendly sustainable apiaries" \
    "BATCH-FOOD-003" \
    "Auckland, New Zealand" \
    "vec { \"Raw Honey\"; \"Glass Packaging\" }" \
    "vec { \"Organic\"; \"Bee-Friendly\"; \"Sustainable Packaging\" }" \
    "89.0" \
    "15.99"

# Cosmetics Products
register_product \
    "Natural Face Cream" \
    "Cosmetics" \
    "Organic face cream with plant-based ingredients" \
    "BATCH-COSM-001" \
    "Provence, France" \
    "vec { \"Organic Shea Butter\"; \"Jojoba Oil\"; \"Lavender Extract\" }" \
    "vec { \"Organic\"; \"Cruelty-Free\"; \"Vegan\" }" \
    "93.0" \
    "29.99"

register_product \
    "Zero-Waste Shampoo Bar" \
    "Cosmetics" \
    "Solid shampoo bar with minimal packaging" \
    "BATCH-COSM-002" \
    "Portland, USA" \
    "vec { \"Coconut Oil\"; \"Essential Oils\"; \"Natural Surfactants\" }" \
    "vec { \"Zero Waste\"; \"Plastic-Free\"; \"Biodegradable\" }" \
    "96.0" \
    "12.99"

# Home & Garden Products
register_product \
    "Bamboo Cutting Board" \
    "Home & Garden" \
    "Sustainable bamboo cutting board with natural finish" \
    "BATCH-HOME-001" \
    "Hangzhou, China" \
    "vec { \"Bamboo\"; \"Natural Oil Finish\" }" \
    "vec { \"FSC Certified\"; \"Sustainable Harvesting\" }" \
    "87.0" \
    "24.99"

register_product \
    "Solar Garden Lights" \
    "Home & Garden" \
    "LED garden lights powered by solar energy" \
    "BATCH-HOME-002" \
    "Munich, Germany" \
    "vec { \"Solar Panels\"; \"LED Lights\"; \"Recycled Plastic\" }" \
    "vec { \"Energy Efficient\"; \"Weather Resistant\"; \"RoHS Compliant\" }" \
    "82.0" \
    "39.99"

echo "✅ Product registration completed!"
echo ""

# Display analytics
echo "📊 Checking analytics..."
echo "========================"
dfx canister call supply_chain_backend get_analytics
echo ""

# Display canister status
echo "🔍 Canister status:"
echo "==================="
dfx canister call supply_chain_backend get_canister_status
echo ""

echo "🎉 Test data population completed successfully!"
echo ""
echo "📚 What you can do now:"
echo "1. Search products: dfx canister call supply_chain_backend search_products '(record { name=opt \"Cotton\"; category=null; manufacturer=null; status=null; limit=opt 10 })'"
echo "2. Get specific product: dfx canister call supply_chain_backend get_product '(\"CT-2024-XXXXXX\")'"
echo "3. View all partners: dfx canister call supply_chain_backend get_partners"
echo "4. Check user info: dfx canister call supply_chain_backend get_user"
echo ""
echo "🌐 Frontend Integration:"
echo "Update your .env.local file with the canister ID: $CANISTER_ID"
echo "Then start your Next.js frontend: npm run dev"
