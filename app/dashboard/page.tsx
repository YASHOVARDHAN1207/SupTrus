"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Plus, Search, TrendingUp, Truck, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { WalletConnect } from "@/components/wallet-connect"
import { useICPWallet } from "@/hooks/use-icp-wallet"
import { icpClient } from "@/lib/icp-client"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { isConnected } = useICPWallet()
  const { toast } = useToast()

  const [products, setProducts] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Load data when component mounts or when wallet connects
  useEffect(() => {
    if (isConnected) {
      loadDashboardData()
    } else {
      setIsLoading(false)
      setProducts([])
      setAnalytics(null)
    }
  }, [isConnected])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      console.log("🔄 Loading dashboard data...")

      // Load user products and analytics in parallel
      const [productsResult, analyticsResult] = await Promise.allSettled([
        icpClient.getUserProducts(), // Get only user's products
        icpClient.getAnalytics(),
      ])

      // Handle products result
      if (productsResult.status === "fulfilled") {
        const transformedProducts = productsResult.value.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          status: getStatusFromICP(product.current_status),
          lastUpdate: new Date(Number(product.updated_at) / 1000000).toLocaleDateString(),
          ethicalScore: product.sustainability_score || 0,
          currentStage: getCurrentStage(product.current_status),
          manufacturer: product.manufacturer,
          location: product.current_location,
        }))
        setProducts(transformedProducts)
        console.log("✅ Loaded user products:", transformedProducts.length)
      } else {
        console.error("❌ Failed to load products:", productsResult.reason)
        setProducts([])

        // Show user-friendly error message
        toast({
          title: "Failed to Load Products",
          description: "Could not load your products. This might be because you haven't registered any products yet.",
          variant: "destructive",
        })
      }

      // Handle analytics result
      if (analyticsResult.status === "fulfilled") {
        setAnalytics({
          totalProducts: Number(analyticsResult.value.total_products),
          activeShipments: Number(analyticsResult.value.active_shipments),
          completedDeliveries: Number(analyticsResult.value.completed_deliveries),
          averageEthicalScore: analyticsResult.value.average_ethical_score,
        })
        console.log("✅ Loaded analytics:", analyticsResult.value)
      } else {
        console.error("❌ Failed to load analytics:", analyticsResult.reason)
        setAnalytics({
          totalProducts: 0,
          activeShipments: 0,
          completedDeliveries: 0,
          averageEthicalScore: 0,
        })
      }
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error)
      toast({
        title: "Connection Error",
        description: "Could not connect to the blockchain. Please check your Internet Identity connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions to transform ICP data
  const getStatusFromICP = (icpStatus) => {
    if (icpStatus.Manufacturing) return "Manufacturing"
    if (icpStatus.InTransit) return "In Transit"
    if (icpStatus.Delivered) return "Delivered"
    if (icpStatus.Recalled) return "Recalled"
    return "Unknown"
  }

  const getCurrentStage = (icpStatus) => {
    if (icpStatus.Manufacturing) return "Production"
    if (icpStatus.InTransit) return "Shipping"
    if (icpStatus.Delivered) return "Delivered"
    if (icpStatus.Recalled) return "Recalled"
    return "Unknown"
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in transit":
        return "bg-blue-100 text-blue-800"
      case "manufacturing":
        return "bg-yellow-100 text-yellow-800"
      case "recalled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "in transit":
        return <Truck className="h-4 w-4" />
      case "manufacturing":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Get unique categories for filter
  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SupTrus</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/track" className="text-gray-600 hover:text-blue-600">
              Track Product
            </Link>
            <Link href="/register" className="text-gray-600 hover:text-blue-600">
              Register Product
            </Link>
            <WalletConnect />
            <Button asChild>
              <Link href="/register">
                <Plus className="h-4 w-4 mr-2" />
                New Product
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage and monitor your supply chain products on the blockchain</p>
          </div>
          <Button onClick={loadDashboardData} disabled={isLoading || !isConnected} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <span>Connect your Internet Identity wallet to view your registered products</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">Products you've registered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalProducts}</div>
                <p className="text-xs text-muted-foreground">All products on platform</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeShipments}</div>
                <p className="text-xs text-muted-foreground">Currently in transit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Ethical Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.averageEthicalScore.toFixed(1)}/100</div>
                <p className="text-xs text-muted-foreground">Platform average</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">My Products ({products.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  View and manage your registered products on the Internet Computer blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search your products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="in transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Loading your products from blockchain...</p>
                  </div>
                )}

                {/* No Products State */}
                {!isLoading && products.length === 0 && isConnected && (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't registered any products yet. Start by registering your first product on the
                      blockchain.
                    </p>
                    <Button asChild>
                      <Link href="/register">
                        <Plus className="h-4 w-4 mr-2" />
                        Register First Product
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Products Table */}
                {!isLoading && filteredProducts.length > 0 && (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Current Stage</TableHead>
                          <TableHead>Ethical Score</TableHead>
                          <TableHead>Last Update</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500 font-mono">{product.id}</div>
                              </div>
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(product.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(product.status)}
                                  {product.status}
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>{product.currentStage}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium">{product.ethicalScore}/100</div>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${product.ethicalScore}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{product.lastUpdate}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/track?id=${product.id}`}>Track</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Filtered Results Empty */}
                {!isLoading && products.length > 0 && filteredProducts.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matching Products</h3>
                    <p className="text-gray-600">No products match your current search and filter criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Insights and metrics about your supply chain performance</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Product Statistics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Your Products:</span>
                          <span className="font-medium">{products.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Platform Products:</span>
                          <span className="font-medium">{analytics.totalProducts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Shipments:</span>
                          <span className="font-medium">{analytics.activeShipments}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completed Deliveries:</span>
                          <span className="font-medium">{analytics.completedDeliveries}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Quality Metrics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Platform Avg. Ethical Score:</span>
                          <span className="font-medium">{analytics.averageEthicalScore.toFixed(1)}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${analytics.averageEthicalScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Analytics</h3>
                    <p className="text-gray-600">Please connect your wallet to view analytics data.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
