# ICP Wallet Integration Guide

This guide explains how to integrate and use the ICP wallet functionality in SupTrus.

## Features

### 🔐 Internet Identity Authentication
- Secure, decentralized authentication using Internet Computer's Internet Identity
- No passwords or private keys to manage
- Biometric authentication support

### 💰 ICP Wallet Management
- View ICP token balance
- Send ICP tokens to other principals
- Real-time balance updates
- Transaction history (coming soon)

### 🔗 Canister Integration
- Direct communication with ICP canisters
- Authenticated API calls
- Automatic principal-based authorization

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install @dfinity/agent @dfinity/auth-client @dfinity/candid @dfinity/identity @dfinity/principal
\`\`\`

### 2. Configure Environment Variables
Create a `.env.local` file with your canister IDs:
\`\`\`env
NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID=your-canister-id-here
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
NEXT_PUBLIC_DFX_NETWORK=local
\`\`\`

### 3. Deploy Your Canisters
\`\`\`bash
# Start local replica
dfx start --background

# Deploy canisters
dfx deploy

# Get canister IDs
dfx canister id supply_chain_backend
\`\`\`

## Usage

### Connecting Wallet
1. Click "Connect Wallet" button
2. Authenticate with Internet Identity
3. Wallet shows connected status with balance

### Sending ICP Tokens
1. Click on wallet balance to open wallet dialog
2. Enter recipient principal ID
3. Enter amount to send
4. Click "Send ICP"
5. Confirm transaction

### Viewing Balance
- Balance is displayed in the header
- Click to refresh balance
- Automatic updates after transactions

## Integration with Supply Chain

### Product Registration
- Requires wallet connection for authentication
- Uses principal ID for ownership tracking
- Transactions recorded on-chain

### Supply Chain Updates
- Authenticated updates using wallet identity
- Role-based permissions based on principal
- Immutable audit trail

### Analytics Access
- Wallet-based access control
- Principal-specific data filtering
- Secure analytics queries

## Security Features

### Authentication
- No passwords stored locally
- Biometric authentication support
- Session management with Internet Identity

### Transaction Security
- All transactions signed with private key
- Principal-based authorization
- Immutable transaction records

### Data Privacy
- Principal-based data access
- Encrypted communication with canisters
- No sensitive data in local storage

## Development

### Local Testing
\`\`\`bash
# Start local replica
dfx start --background --clean

# Deploy Internet Identity canister
dfx deploy internet_identity

# Deploy your canisters
dfx deploy supply_chain_backend

# Start Next.js development server
npm run dev
\`\`\`

### Production Deployment
1. Deploy canisters to IC mainnet
2. Update environment variables
3. Build and deploy frontend

## Troubleshooting

### Common Issues

**Wallet not connecting:**
- Check Internet Identity canister is running
- Verify canister IDs in environment variables
- Clear browser cache and try again

**Balance not updating:**
- Check network connection
- Verify canister is deployed and running
- Try refreshing balance manually

**Transaction failures:**
- Ensure sufficient ICP balance
- Verify recipient principal ID format
- Check canister permissions

### Debug Mode
Enable debug logging by adding to your environment:
\`\`\`env
NEXT_PUBLIC_DEBUG=true
\`\`\`

## API Reference

### ICPClient Methods
- `init()` - Initialize the client
- `login()` - Connect to Internet Identity
- `logout()` - Disconnect wallet
- `isAuthenticated()` - Check connection status
- `getPrincipal()` - Get user's principal ID
- `getICPBalance()` - Get ICP token balance
- `transferICP(to, amount)` - Send ICP tokens

### useICPWallet Hook
- `isConnected` - Connection status
- `principal` - User's principal ID
- `balance` - ICP token balance
- `connect()` - Connect wallet
- `disconnect()` - Disconnect wallet
- `transfer(to, amount)` - Send tokens

## Support

For issues and questions:
- Check the Internet Computer documentation
- Review dfx logs for canister errors
- Test with local replica first
- Contact development team for assistance
