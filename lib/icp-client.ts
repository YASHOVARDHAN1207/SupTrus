import { AuthClient } from "@dfinity/auth-client"
import { Actor, HttpAgent } from "@dfinity/agent"
import type { Principal } from "@dfinity/principal"

// ICP Network Configuration
const NETWORK = process.env.NEXT_PUBLIC_DFX_NETWORK || "local"
const HOST = NETWORK === "ic" ? "https://ic0.app" : "http://localhost:4943"

// Internet Identity Configuration
const INTERNET_IDENTITY_CANISTER_ID =
  NETWORK === "ic"
    ? "rdmx6-jaaaa-aaaaa-aaadq-cai" // Mainnet Internet Identity
    : process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID || "be2us-64aaa-aaaaa-qaabq-cai" // Local II

const IDENTITY_PROVIDER =
  NETWORK === "ic" ? "https://identity.ic0.app" : `http://${INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`

// Supply Chain Canister ID
const SUPPLY_CHAIN_CANISTER_ID = process.env.NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID || "rdmx6-jaaaa-aaaaa-aaadq-cai"

console.log("🔧 ICP Client Configuration:")
console.log("Network:", NETWORK)
console.log("Host:", HOST)
console.log("Identity Provider:", IDENTITY_PROVIDER)
console.log("Internet Identity Canister:", INTERNET_IDENTITY_CANISTER_ID)
console.log("Supply Chain Canister:", SUPPLY_CHAIN_CANISTER_ID)

// Candid Interface for Supply Chain Backend
const idlFactory = ({ IDL }: any) => {
  const UserRole = IDL.Variant({
    Manufacturer: IDL.Null,
    LogisticsProvider: IDL.Null,
    Retailer: IDL.Null,
    QualityAssurance: IDL.Null,
    SupplyChainManager: IDL.Null,
    Admin: IDL.Null,
    Consumer: IDL.Null,
  })

  const UserRegistration = IDL.Record({
    email: IDL.Text,
    first_name: IDL.Text,
    last_name: IDL.Text,
    company: IDL.Text,
    role: UserRole,
  })

  const ProductRegistration = IDL.Record({
    name: IDL.Text,
    category: IDL.Text,
    description: IDL.Opt(IDL.Text),
    batch_number: IDL.Opt(IDL.Text),
    production_date: IDL.Nat64,
    manufacturing_location: IDL.Text,
    raw_materials: IDL.Vec(IDL.Text),
    certifications: IDL.Vec(IDL.Text),
    sustainability_score: IDL.Opt(IDL.Float64),
    estimated_value: IDL.Opt(IDL.Float64),
  })

  return IDL.Service({
    register_user: IDL.Func([UserRegistration], [IDL.Variant({ Ok: IDL.Record({}), Err: IDL.Text })], []),
    register_product: IDL.Func([ProductRegistration], [IDL.Variant({ Ok: IDL.Text, Err: IDL.Text })], []),
    get_product: IDL.Func([IDL.Text], [IDL.Variant({ Ok: IDL.Record({}), Err: IDL.Text })], ["query"]),
    get_analytics: IDL.Func([], [IDL.Record({})], ["query"]),
    get_canister_status: IDL.Func([], [IDL.Record({})], ["query"]),
    get_user: IDL.Func([], [IDL.Variant({ Ok: IDL.Record({}), Err: IDL.Text })], ["query"]),
  })
}

export class ICPClient {
  private authClient: AuthClient | null = null
  private actor: any = null
  private agent: HttpAgent | null = null
  private isInitialized = false

  async init() {
    try {
      console.log("🔄 Initializing ICP Client...")

      // Create AuthClient with proper configuration
      this.authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true,
        },
      })

      console.log("✅ AuthClient created successfully")

      // Check if already authenticated
      const isAuthenticated = await this.authClient.isAuthenticated()
      console.log("🔐 Authentication status:", isAuthenticated)

      if (isAuthenticated) {
        console.log("🔄 User already authenticated, setting up actor...")
        await this.setupActor()
      }

      this.isInitialized = true
      console.log("✅ ICP Client initialized successfully")
    } catch (error) {
      console.error("❌ Failed to initialize ICP Client:", error)
      throw error
    }
  }

  async login(): Promise<boolean> {
    try {
      console.log("🔄 Starting Internet Identity login...")

      if (!this.authClient) {
        console.log("🔄 AuthClient not initialized, initializing...")
        await this.init()
      }

      return new Promise((resolve) => {
        const loginOptions = {
          identityProvider: IDENTITY_PROVIDER,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
          windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
          onSuccess: async () => {
            console.log("✅ Internet Identity login successful!")
            try {
              await this.setupActor()
              console.log("✅ Actor setup complete")
              resolve(true)
            } catch (error) {
              console.error("❌ Failed to setup actor after login:", error)
              resolve(false)
            }
          },
          onError: (error?: string) => {
            console.error("❌ Internet Identity login failed:", error)
            resolve(false)
          },
        }

        console.log("🔄 Opening Internet Identity with options:", loginOptions)
        this.authClient!.login(loginOptions)
      })
    } catch (error) {
      console.error("❌ Login process failed:", error)
      return false
    }
  }

  async logout() {
    try {
      console.log("🔄 Logging out from Internet Identity...")
      if (this.authClient) {
        await this.authClient.logout()
        this.actor = null
        this.agent = null
        console.log("✅ Logout successful")
      }
    } catch (error) {
      console.error("❌ Logout failed:", error)
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      if (!this.authClient) {
        await this.init()
      }
      const isAuth = await this.authClient!.isAuthenticated()
      console.log("🔐 Current authentication status:", isAuth)
      return isAuth
    } catch (error) {
      console.error("❌ Failed to check authentication:", error)
      return false
    }
  }

  async getIdentity() {
    if (!this.authClient) {
      await this.init()
    }
    return this.authClient!.getIdentity()
  }

  async getPrincipal(): Promise<Principal | null> {
    try {
      const identity = await this.getIdentity()
      const principal = identity?.getPrincipal()
      console.log("👤 User Principal:", principal?.toString())
      return principal || null
    } catch (error) {
      console.error("❌ Failed to get principal:", error)
      return null
    }
  }

  private async setupActor() {
    try {
      console.log("🔄 Setting up actor...")
      const identity = await this.getIdentity()

      this.agent = new HttpAgent({
        host: HOST,
        identity,
      })

      // Fetch root key for local development
      if (NETWORK === "local") {
        console.log("🔄 Fetching root key for local development...")
        try {
          await this.agent.fetchRootKey()
          console.log("✅ Root key fetched successfully")
        } catch (error) {
          console.error("⚠️ Failed to fetch root key (this is normal for mainnet):", error)
        }
      }

      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId: SUPPLY_CHAIN_CANISTER_ID,
      })

      console.log("✅ Actor created successfully")
      console.log("📋 Connected to canister:", SUPPLY_CHAIN_CANISTER_ID)
    } catch (error) {
      console.error("❌ Failed to setup actor:", error)
      throw error
    }
  }

  // Test connection to canister
  async testConnection(): Promise<boolean> {
    try {
      if (!this.actor) {
        console.log("❌ No actor available for testing")
        return false
      }

      console.log("🧪 Testing canister connection...")
      const status = await this.actor.get_canister_status()
      console.log("✅ Canister connection test successful:", status)
      return true
    } catch (error) {
      console.error("❌ Canister connection test failed:", error)
      return false
    }
  }

  // Supply Chain Methods
  async registerUser(userData: any) {
    if (!this.actor) throw new Error("Not authenticated - please connect your wallet first")
    console.log("🔄 Registering user:", userData)
    return await this.actor.register_user(userData)
  }

  async registerProduct(productData: any) {
    if (!this.actor) throw new Error("Not authenticated - please connect your wallet first")
    console.log("🔄 Registering product:", productData)
    return await this.actor.register_product(productData)
  }

  async getProduct(productId: string) {
    if (!this.actor) throw new Error("Not authenticated - please connect your wallet first")
    console.log("🔄 Getting product:", productId)
    return await this.actor.get_product(productId)
  }

  async getAnalytics() {
    if (!this.actor) throw new Error("Not authenticated - please connect your wallet first")
    console.log("🔄 Getting analytics...")
    return await this.actor.get_analytics()
  }

  async getCanisterStatus() {
    if (!this.actor) throw new Error("Not authenticated - please connect your wallet first")
    console.log("🔄 Getting canister status...")
    return await this.actor.get_canister_status()
  }

  async getUser() {
    if (!this.actor) throw new Error("Not authenticated - please connect your wallet first")
    console.log("🔄 Getting user...")
    return await this.actor.get_user()
  }

  // Mock wallet methods for demo
  async getICPBalance(): Promise<number> {
    try {
      const principal = await this.getPrincipal()
      if (!principal) return 0

      console.log("💰 Getting ICP balance for:", principal.toString())
      // In a real app, you'd call the ICP ledger canister here
      return 10.5 // Mock balance
    } catch (error) {
      console.error("❌ Error getting ICP balance:", error)
      return 0
    }
  }

  async transferICP(to: string, amount: number): Promise<boolean> {
    try {
      console.log(`🔄 Mock transfer: ${amount} ICP to ${to}`)
      // In a real app, you'd call the ICP ledger canister here
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("✅ Mock transfer completed")
      return true
    } catch (error) {
      console.error("❌ Transfer failed:", error)
      return false
    }
  }
}

// Singleton instance
export const icpClient = new ICPClient()
