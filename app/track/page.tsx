"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, MapPin, Calendar, User, CheckCircle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"
import { WalletConnect } from "@/components/wallet-connect"

// Mock data for demonstration
const mockProductData = {
  id: "CT-2024-001234",
  name: "Organic Cotton T-Shirt",
  category: "Apparel",
  manufacturer: "EcoTextiles Ltd.",
  currentStatus: "In Transit",
  ethicalScore: 95,
  timeline: [
    {
      id: 1,
      stage: "Raw Material Sourcing",
      location: "Gujarat, India",
      timestamp: "2024-01-15T08:00:00Z",
      actor: "Organic Cotton Farm Co.",
      status: "completed",
      details: "Certified organic cotton harvested from sustainable farms",
      certifications: ["GOTS Certified", "Fair Trade"],
    },
    {
      id: 2,
      stage: "Manufacturing",
      location: "Mumbai, India",
      timestamp: "2024-01-22T10:30:00Z",
      actor: "EcoTextiles Ltd.",
      status: "completed",
      details: "T-shirt manufactured using eco-friendly dyes and processes",
      certifications: ["ISO 14001", "OEKO-TEX Standard 100"],
    },
    {
      id: 3,
      stage: "Quality Control",
      location: "Mumbai, India",
      timestamp: "2024-01-25T14:15:00Z",
      actor: "QualityCheck Inc.",
      status: "completed",
      details: "Passed all quality and safety standards",
      certifications: ["Quality Approved"],
    },
    {
      id: 4,
      stage: "Packaging",
      location: "Mumbai, India",
      timestamp: "2024-01-26T09:00:00Z",
      actor: "EcoTextiles Ltd.",
      status: "completed",
      details: "Packaged using biodegradable materials",
      certifications: ["Eco-Packaging"],
    },
    {
      id: 5,
      stage: "Shipping",
      location: "Mumbai Port, India",
      timestamp: "2024-01-28T16:45:00Z",
      actor: "GlobalShip Logistics",
      status: "in_progress",
      details: "In transit to distribution center",
      estimatedArrival: "2024-02-05T12:00:00Z",
    },
    {
      id: 6,
      stage: "Distribution",
      location: "Los Angeles, CA, USA",
      timestamp: null,
      actor: "RetailHub Distribution",
      status: "pending",
      details: "Awaiting arrival at distribution center",
    },
    {
      id: 7,
      stage: "Retail",
      location: "Various Locations",
      timestamp: null,
      actor: "EcoWear Stores",
      status: "pending",
      details: "Will be distributed to retail locations",
    },
  ],
}

export default function TrackPage() {
  const [productId, setProductId] = useState("")
  const [productData, setProductData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!productId.trim()) return

    setIsLoading(true)
    // Simulate API call to ICP canister
    setTimeout(() => {
      if (productId === "CT-2024-001234") {
        setProductData(mockProductData)
      } else {
        setProductData(null)
      }
      setIsLoading(false)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-gray-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

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
            <Link href="/register" className="text-gray-600 hover:text-blue-600">
              Register Product
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
            <WalletConnect />
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Track Your Product</h1>
          <Card>
            <CardHeader>
              <CardTitle>Enter Product ID</CardTitle>
              <CardDescription>Enter your product ID to view its complete supply chain history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g., CT-2024-001234"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? "Searching..." : "Track"}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Try: CT-2024-001234 for demo data</p>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {productData && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Product Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{productData.name}</CardTitle>
                    <CardDescription className="text-lg">
                      ID: {productData.id} • {productData.category}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(productData.currentStatus.toLowerCase().replace(" ", "_"))}>
                    {productData.currentStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Manufacturer</p>
                      <p className="font-medium">{productData.manufacturer}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Ethical Score</p>
                      <p className="font-medium text-green-600">{productData.ethicalScore}/100</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Total Stages</p>
                      <p className="font-medium">{productData.timeline.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Timeline</CardTitle>
                <CardDescription>Complete journey from production to delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {productData.timeline.map((stage, index) => (
                    <div key={stage.id} className="flex space-x-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(stage.status)}
                        {index < productData.timeline.length - 1 && <div className="w-px h-16 bg-gray-200 mt-2" />}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{stage.stage}</h3>
                          <Badge className={getStatusColor(stage.status)}>{stage.status.replace("_", " ")}</Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{stage.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{stage.actor}</span>
                          </div>
                          {stage.timestamp && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(stage.timestamp).toLocaleString()}</span>
                            </div>
                          )}
                          {stage.estimatedArrival && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Est. Arrival: {new Date(stage.estimatedArrival).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 mt-2">{stage.details}</p>
                        {stage.certifications && stage.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {stage.certifications.map((cert, certIndex) => (
                              <Badge key={certIndex} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {productData === null && productId && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
                <p className="text-gray-600">
                  No product found with ID "{productId}". Please check the ID and try again.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
