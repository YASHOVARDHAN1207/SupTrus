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
    : process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID || "rdmx6-jaaaa-aaaaa-aaadq-cai" // Local II

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

  const UserPermissions = IDL.Record({
    can_register_products: IDL.Bool,
    can_update_supply_chain: IDL.Bool,
    can_manage_partners: IDL.Bool,
    can_view_analytics: IDL.Bool,
    can_verify_users: IDL.Bool,
  })

  const User = IDL.Record({
    id: IDL.Principal,
    email: IDL.Text,
    first_name: IDL.Text,
    last_name: IDL.Text,
    company: IDL.Text,
    role: UserRole,
    created_at: IDL.Nat64,
    is_verified: IDL.Bool,
    permissions: UserPermissions,
  })

  const UserRegistration = IDL.Record({
    email: IDL.Text,
    first_name: IDL.Text,
    last_name: IDL.Text,
    company: IDL.Text,
    role: UserRole,
  })

  const ProductStatus = IDL.Variant({
    Manufacturing: IDL.Null,
    InTransit: IDL.Null,
    Delivered: IDL.Null,
    Recalled: IDL.Null,
  })

  const Product = IDL.Record({
    id: IDL.Text,
    name: IDL.Text,
    category: IDL.Text,
    description: IDL.Opt(IDL.Text),
    manufacturer: IDL.Text,
    manufacturer_id: IDL.Principal,
    batch_number: IDL.Opt(IDL.Text),
    production_date: IDL.Nat64,
    raw_materials: IDL.Vec(IDL.Text),
    certifications: IDL.Vec(IDL.Text),
    sustainability_score: IDL.Opt(IDL.Float64),
    estimated_value: IDL.Opt(IDL.Float64),
    current_status: ProductStatus,
    current_location: IDL.Text,
    created_at: IDL.Nat64,
    updated_at: IDL.Nat64,
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

  const SupplyChainStage = IDL.Variant({
    RawMaterialSourcing: IDL.Null,
    Manufacturing: IDL.Null,
    QualityControl: IDL.Null,
    Packaging: IDL.Null,
    Shipping: IDL.Null,
    Distribution: IDL.Null,
    Retail: IDL.Null,
  })

  const EventStatus = IDL.Variant({
    Pending: IDL.Null,
    InProgress: IDL.Null,
    Completed: IDL.Null,
    Failed: IDL.Null,
  })

  const SupplyChainEvent = IDL.Record({
    id: IDL.Text,
    product_id: IDL.Text,
    stage: SupplyChainStage,
    location: IDL.Text,
    timestamp: IDL.Nat64,
    actor: IDL.Text,
    actor_id: IDL.Principal,
    status: EventStatus,
    details: IDL.Text,
    certifications: IDL.Vec(IDL.Text),
    estimated_arrival: IDL.Opt(IDL.Nat64),
    metadata: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  })

  const ProductWithHistory = IDL.Record({
    product: Product,
    supply_chain_events: IDL.Vec(SupplyChainEvent),
    ethical_score: IDL.Float64,
  })

  const ProductSearchQuery = IDL.Record({
    name: IDL.Opt(IDL.Text),
    category: IDL.Opt(IDL.Text),
    manufacturer: IDL.Opt(IDL.Text),
    status: IDL.Opt(ProductStatus),
    limit: IDL.Opt(IDL.Nat32),
  })

  const AnalyticsData = IDL.Record({
    total_products: IDL.Nat64,
    active_shipments: IDL.Nat64,
    completed_deliveries: IDL.Nat64,
    average_ethical_score: IDL.Float64,
    total_partners: IDL.Nat64,
    total_users: IDL.Nat64,
  })

  const CanisterStatus = IDL.Record({
    version: IDL.Text,
    total_products: IDL.Nat64,
    total_users: IDL.Nat64,
    total_events: IDL.Nat64,
    uptime: IDL.Nat64,
  })

  const Result = IDL.Variant({ Ok: User, Err: IDL.Text })
  const Result_1 = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text })
  const Result_2 = IDL.Variant({ Ok: ProductWithHistory, Err: IDL.Text })

  return IDL.Service({
    register_user: IDL.Func([UserRegistration], [Result], []),
    get_user: IDL.Func([], [Result], ["query"]),
    register_product: IDL.Func([ProductRegistration], [Result_1], []),
    get_product: IDL.Func([IDL.Text], [Result_2], ["query"]),
    get_analytics: IDL.Func([], [AnalyticsData], ["query"]),
    get_canister_status: IDL.Func([], [CanisterStatus], ["query"]),
    search_products: IDL.Func([ProductSearchQuery], [IDL.Vec(Product)], ["query"]),
    get_user_products: IDL.Func([], [IDL.Vec(Product)], ["query"]),
    get_all_products: IDL.Func([], [IDL.Vec(Product)], ["query"]),
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

      // Test if Internet Identity is accessible
      try {
        const testResponse = await fetch(IDENTITY_PROVIDER, { mode: "no-cors" })
        console.log("✅ Internet Identity is accessible")
      } catch (error) {
        console.error("❌ Internet Identity not accessible:", IDENTITY_PROVIDER)
        throw new Error(
          `Internet Identity not accessible at ${IDENTITY_PROVIDER}. Make sure dfx is running and Internet Identity is deployed.`,
        )
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

      if (!identity) {
        throw new Error("No identity available")
      }

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
          console.error("⚠️ Failed to fetch root key:", error)
          // Don't throw here, continue with actor creation
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
    if (!this.actor) {
      throw new Error("Not authenticated - please connect your wallet first")
    }

    console.log("🔄 Registering product:", productData)

    try {
      // Ensure we're properly authenticated before making the call
      const isAuth = await this.isAuthenticated()
      if (!isAuth) {
        throw new Error("Authentication expired - please reconnect your wallet")
      }

      const result = await this.actor.register_product(productData)
      console.log("📦 Raw registration result:", result)
      return result
    } catch (error) {
      console.error("❌ Product registration error:", error)
      throw error
    }
  }

  async getProduct(productId: string) {
    if (!this.actor) {
      throw new Error("Not authenticated - please connect your wallet first")
    }

    console.log("🔄 Getting product:", productId)

    try {
      const result = await this.actor.get_product(productId)
      console.log("📦 Raw product result:", result)
      return result
    } catch (error) {
      console.error("❌ Get product error:", error)
      throw error
    }
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

  // NEW: Get user's products
  async getUserProducts() {
    if (!this.actor) throw new Error("Not authenticated - please connect your wallet first")
    console.log("🔄 Getting user products...")
    return await this.actor.get_user_products()
  }

  // NEW: Get all products
  async getAllProducts() {
    if (!this.actor) throw new Error("Not authenticated - please connect your wallet first")
    console.log("🔄 Getting all products...")
    return await this.actor.get_all_products()
  }

  async searchProducts(query: any) {
    if (!this.actor) throw new Error("Not authenticated - please connect your wallet first")
    console.log("🔄 Searching products with query:", query)

    try {
      const result = await this.actor.search_products(query)
      console.log("🔍 Search results:", result)
      return result
    } catch (error) {
      console.error("❌ Search products error:", error)
      throw error
    }
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
