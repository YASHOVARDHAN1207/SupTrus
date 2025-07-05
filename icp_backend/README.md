# Supply Chain Backend - Internet Computer

A decentralized supply chain tracking system built on the Internet Computer (ICP) blockchain using Rust canisters.

## Features

### 🔐 User Management
- Role-based access control (Manufacturer, Logistics, Retailer, etc.)
- User registration and verification
- Permission-based operations

### 📦 Product Management
- Product registration with comprehensive metadata
- Batch tracking and certification management
- Sustainability scoring
- Search and filtering capabilities

### 🚚 Supply Chain Tracking
- Immutable event logging for each supply chain stage
- Real-time status updates
- Location tracking
- Certification validation at each stage

### 🤝 Partner Network
- Partner registration and verification
- Reputation scoring
- Multi-stakeholder collaboration

### 📊 Analytics
- Real-time supply chain metrics
- Ethical scoring algorithms
- Performance analytics

## Architecture

### Canisters
- **supply_chain_backend**: Main canister handling all business logic

### Data Storage
- **Users**: Stable storage for user accounts and permissions
- **Products**: Product registry with metadata
- **Supply Chain Events**: Immutable event log
- **Partners**: Partner network registry

### Security Features
- Principal-based authentication
- Role-based access control
- Immutable audit trails
- Tamper-proof records

## Getting Started

### Prerequisites
- [dfx](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (Internet Computer SDK)
- [Rust](https://rustup.rs/) (latest stable version)
- [Node.js](https://nodejs.org/) (for frontend integration)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd icp_backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   # Install Rust dependencies
   cargo build
   
   # Install dfx (if not already installed)
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   \`\`\`

3. **Deploy locally**
   \`\`\`bash
   # Make deploy script executable
   chmod +x deploy.sh
   
   # Deploy to local replica
   ./deploy.sh
   \`\`\`

### API Usage

#### Register a User
\`\`\`bash
dfx canister call supply_chain_backend register_user '(record { 
  email="manufacturer@example.com"; 
  first_name="John"; 
  last_name="Doe"; 
  company="EcoTextiles Ltd."; 
  role=variant { Manufacturer } 
})'
\`\`\`

#### Register a Product
\`\`\`bash
dfx canister call supply_chain_backend register_product '(record { 
  name="Organic Cotton T-Shirt"; 
  category="Apparel"; 
  description=opt "Sustainable cotton t-shirt"; 
  batch_number=opt "BATCH001"; 
  production_date=1640995200000000000; 
  manufacturing_location="Mumbai, India"; 
  raw_materials=vec { "Organic Cotton"; "Natural Dyes" }; 
  certifications=vec { "GOTS"; "Fair Trade" }; 
  sustainability_score=opt 95.0; 
  estimated_value=opt 25.0 
})'
\`\`\`

#### Add Supply Chain Event
\`\`\`bash
dfx canister call supply_chain_backend add_supply_chain_event '(record { 
  product_id="CT-2024-001234"; 
  stage=variant { Shipping }; 
  location="Mumbai Port, India"; 
  status=variant { InProgress }; 
  details="Product shipped to distribution center"; 
  certifications=vec { "Export Certificate" }; 
  estimated_arrival=opt 1641081600000000000; 
  metadata=vec { record { "carrier"; "GlobalShip Logistics" } } 
})'
\`\`\`

#### Track a Product
\`\`\`bash
dfx canister call supply_chain_backend get_product '("CT-2024-001234")'
\`\`\`

## Data Models

### User Roles
- **Manufacturer**: Can register products and update supply chain
- **LogisticsProvider**: Can update shipping and distribution events
- **Retailer**: Can update retail and delivery events
- **QualityAssurance**: Can add quality control events
- **SupplyChainManager**: Full supply chain management access
- **Admin**: System administration privileges
- **Consumer**: Read-only access for product tracking

### Supply Chain Stages
1. **RawMaterialSourcing**: Initial material procurement
2. **Manufacturing**: Production and assembly
3. **QualityControl**: Testing and validation
4. **Packaging**: Final packaging and labeling
5. **Shipping**: Transportation to distribution
6. **Distribution**: Warehouse and distribution center
7. **Retail**: Final sale to consumer

### Product Status
- **Manufacturing**: In production phase
- **InTransit**: Being transported
- **Delivered**: Reached final destination
- **Recalled**: Product recall initiated

## Security Considerations

### Access Control
- All operations require valid Principal authentication
- Role-based permissions prevent unauthorized actions
- Admin-only functions for user verification

### Data Integrity
- Immutable event logging prevents tampering
- Cryptographic hashing for product IDs
- Stable storage ensures data persistence

### Privacy
- Sensitive data encrypted at rest
- Access logs for audit trails
- GDPR-compliant data handling

## Deployment

### Local Development
\`\`\`bash
# Start local replica
dfx start --background

# Deploy canister
dfx deploy supply_chain_backend

# Test deployment
dfx canister call supply_chain_backend get_canister_status
\`\`\`

### Production Deployment
\`\`\`bash
# Deploy to IC mainnet
dfx deploy --network ic supply_chain_backend

# Verify deployment
dfx canister --network ic call supply_chain_backend get_canister_status
\`\`\`

## Monitoring and Analytics

### Metrics Available
- Total products registered
- Active shipments in transit
- Completed deliveries
- Average ethical scores
- Partner network size
- User activity

### Health Checks
\`\`\`bash
# Check canister status
dfx canister call supply_chain_backend get_canister_status

# View analytics
dfx canister call supply_chain_backend get_analytics
\`\`\`

## Integration with Frontend

The backend provides a complete API for the Next.js frontend:

1. **Authentication**: User registration and role management
2. **Product Management**: CRUD operations for products
3. **Supply Chain Events**: Real-time event tracking
4. **Analytics**: Dashboard metrics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the Internet Computer documentation

---

Built with ❤️ on the Internet Computer blockchain
