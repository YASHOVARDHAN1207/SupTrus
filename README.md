# SupTrus (ICP Supply Chain Tracker)

A decentralized supply chain tracking application built on the Internet Computer Protocol (ICP) using Next.js and Rust. This application allows users to register products, track their supply chain journey, and view analytics through a secure, blockchain-based system.

## 🌟 Features

- **Product Registration**: Register products with detailed information on the blockchain
- **Supply Chain Tracking**: Track products through their entire supply chain journey
- **Real-time Analytics**: View comprehensive analytics and insights
- **Internet Identity Authentication**: Secure authentication using ICP's Internet Identity
- **Decentralized Storage**: All data stored securely on the Internet Computer
- **QR Code Generation**: Generate QR codes for easy product tracking
- **Dashboard Management**: Manage all your registered products in one place

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Rust and Cargo
- DFX (Internet Computer SDK)
- Git

### Installation

1. **Clone the repository**:
   \`\`\`bash
   git clone <your-repo-url>
   cd icp-supply-chain
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Internet Identity and Backend** (IMPORTANT - This fixes connection issues):
   \`\`\`bash
   chmod +x fix_internet_identity_connection.sh
   ./fix_internet_identity_connection.sh
   \`\`\`

4. **Start the Next.js application**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Internet Identity: http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943

## 🔧 Setup Details

### Backend Deployment

The `fix_internet_identity_connection.sh` script handles:
- Setting up the ICP backend canister
- Deploying Internet Identity locally
- Configuring environment variables
- Testing canister connections

### Manual Setup (if needed)

If the automated script doesn't work, you can set up manually:

1. **Start DFX**:
   \`\`\`bash
   cd icp_backend
   dfx start --background --clean
   \`\`\`

2. **Deploy the backend**:
   \`\`\`bash
   dfx deploy supply_chain_backend
   \`\`\`

3. **Set up Internet Identity**:
   \`\`\`bash
   dfx deps pull
   dfx deps init internet_identity --argument '(null)'
   dfx deps deploy
   \`\`\`

4. **Update environment variables**:
   \`\`\`bash
   # Get canister IDs
   SUPPLY_CHAIN_ID=$(dfx canister id supply_chain_backend)
   II_CANISTER_ID=$(dfx canister id internet_identity)
   
   # Create .env.local
   echo "NEXT_PUBLIC_DFX_NETWORK=local" > .env.local
   echo "NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=$SUPPLY_CHAIN_ID" >> .env.local
   echo "NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID" >> .env.local
   \`\`\`

## 📱 How to Use

### 1. Connect Your Wallet
- Visit http://localhost:3000
- Click "Connect Wallet"
- Create or use existing Internet Identity

### 2. Register a Product
- Go to "Register Product" page
- Fill in product details:
  - Product name and description
  - Manufacturer information
  - Category and batch number
  - Manufacturing date
- Submit to register on blockchain

### 3. Track Products
- Use the "Track Product" page
- Enter product ID or scan QR code
- View complete supply chain history

### 4. Manage Products
- Access your dashboard
- View all registered products
- See analytics and insights
- Track product performance

## 🛠️ Troubleshooting

### Internet Identity Not Connecting

**Solution**: Run the connection fix script:
\`\`\`bash
chmod +x fix_internet_identity_connection.sh
./fix_internet_identity_connection.sh
\`\`\`

### Products Not Showing in Dashboard

1. **Redeploy backend with latest functions**:
   \`\`\`bash
   chmod +x redeploy_backend.sh
   ./redeploy_backend.sh
   \`\`\`

2. **Test the connection**:
   \`\`\`bash
   chmod +x test_product_management.sh
   ./test_product_management.sh
   \`\`\`

### Common Issues

1. **DFX not running**:
   \`\`\`bash
   dfx ping
   # If fails, restart:
   dfx start --background
   \`\`\`

2. **Canister errors**:
   \`\`\`bash
   dfx canister status supply_chain_backend
   dfx canister status internet_identity
   \`\`\`

3. **Clear browser cache**:
   - Clear cache for localhost:3000
   - Try incognito/private browsing

4. **Environment variables**:
   - Check `.env.local` exists
   - Verify canister IDs are correct

## 📁 Project Structure

\`\`\`
icp-supply-chain/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Dashboard page
│   ├── register/                # Product registration
│   ├── track/                   # Product tracking
│   └── auth/                    # Authentication pages
├── components/                   # React components
│   ├── ui/                      # UI components
│   ├── wallet-connect.tsx       # Wallet connection
│   └── product-registration-guide.tsx
├── lib/                         # Utility libraries
│   └── icp-client.ts           # ICP blockchain client
├── hooks/                       # React hooks
│   └── use-icp-wallet.ts       # Wallet management
├── icp_backend/                 # Rust backend
│   ├── src/
│   │   ├── lib.rs              # Main backend logic
│   │   ├── types.rs            # Data structures
│   │   ├── storage.rs          # Data storage
│   │   └── utils.rs            # Utility functions
│   ├── dfx.json                # DFX configuration
│   └── supply_chain_backend.did # Candid interface
└── scripts/                     # Setup and utility scripts
    ├── fix_internet_identity_connection.sh
    ├── redeploy_backend.sh
    └── test_product_management.sh
\`\`\`

## 🔐 Security Features

- **Internet Identity**: Secure, passwordless authentication
- **Blockchain Storage**: Immutable product records
- **Cryptographic Signatures**: Verified product authenticity
- **Decentralized**: No single point of failure

## 🧪 Testing

### Test Product Registration
\`\`\`bash
# Register a test product
dfx canister call supply_chain_backend register_product '(
  record {
    name = "Test Product";
    description = "A test product for demonstration";
    manufacturer = "Test Manufacturer";
    manufacturing_date = "2024-01-15";
    category = "Electronics";
    batch_number = "BATCH001";
  }
)'
\`\`\`

### Test Product Retrieval
\`\`\`bash
# Get all products
dfx canister call supply_chain_backend get_all_products

# Get user products
dfx canister call supply_chain_backend get_user_products
\`\`\`

## 🚀 Deployment

### Local Development
- Use the setup scripts provided
- Access via localhost:3000

### Production Deployment
1. Deploy to IC mainnet:
   \`\`\`bash
   dfx deploy --network ic
   \`\`\`

2. Update environment variables for production
3. Configure custom domain (optional)

## 📚 API Reference

### Backend Functions

- `register_product(ProductInput)` - Register a new product
- `get_product(ProductId)` - Get product details
- `get_user_products()` - Get current user's products
- `get_all_products()` - Get all products (admin)
- `add_supply_chain_event(ProductId, SupplyChainEvent)` - Add tracking event
- `get_supply_chain_history(ProductId)` - Get product history

### Frontend Hooks

- `useICPWallet()` - Wallet connection and management
- `useToast()` - Toast notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## 🆘 Support

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Run the fix scripts**:
   \`\`\`bash
   chmod +x fix_internet_identity_connection.sh
   ./fix_internet_identity_connection.sh
   \`\`\`
3. **Check DFX status**: `dfx ping`
4. **Clear browser cache**
5. **Restart the development server**

## 🔗 Useful Links

- [Internet Computer Documentation](https://internetcomputer.org/docs)
- [DFX SDK Documentation](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Candid Documentation](https://internetcomputer.org/docs/current/developer-docs/backend/candid/)
- [Internet Identity](https://identity.ic0.app/)

---

**Happy tracking! 🚚📦**
