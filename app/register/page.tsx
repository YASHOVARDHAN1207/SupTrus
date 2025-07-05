"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Plus, X, CheckCircle, Wallet, User } from "lucide-react"
import Link from "next/link"
import { WalletConnect } from "@/components/wallet-connect"
import { useICPWallet } from "@/hooks/use-icp-wallet"
import { icpClient } from "@/lib/icp-client"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const { isConnected, principal } = useICPWallet()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    description: "",
    manufacturer: "",
    batchNumber: "",
    productionDate: "",
    rawMaterials: [],
    certifications: [],
    sustainabilityScore: "",
    location: "",
    estimatedValue: "",
  })

  const [newMaterial, setNewMaterial] = useState("")
  const [newCertification, setNewCertification] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [registeredProductId, setRegisteredProductId] = useState("")
  const [userProfile, setUserProfile] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)

  const categories = [
    "Apparel",
    "Electronics",
    "Food & Beverage",
    "Pharmaceuticals",
    "Automotive",
    "Cosmetics",
    "Home & Garden",
    "Sports & Recreation",
    "Textiles",
    "Agriculture",
    "Manufacturing",
    "Other",
  ]

  const commonCertifications = [
    "ISO 9001 (Quality Management)",
    "ISO 14001 (Environmental)",
    "GOTS (Global Organic Textile)",
    "Fair Trade Certified",
    "OEKO-TEX Standard 100",
    "Organic Certified",
    "FSC Certified (Forest)",
    "Energy Star",
    "CE Marking",
    "FDA Approved",
    "GMP (Good Manufacturing)",
    "HACCP (Food Safety)",
    "Cradle to Cradle",
    "B Corp Certified",
    "Carbon Neutral",
    "Rainforest Alliance",
  ]

  // Load user profile when connected
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isConnected && principal) {
        setIsLoadingUser(true)
        try {
          const result = await icpClient.getUser()
          if (result.Ok) {
            setUserProfile(result.Ok)
            setFormData((prev) => ({
              ...prev,
              manufacturer: result.Ok.company || "",
            }))
          }
        } catch (error) {
          console.log("User not registered yet, that's okay")
        } finally {
          setIsLoadingUser(false)
        }
      }
    }

    loadUserProfile()
  }, [isConnected, principal])

  const addMaterial = () => {
    if (newMaterial.trim() && !formData.rawMaterials.includes(newMaterial.trim())) {
      setFormData((prev) => ({
        ...prev,
        rawMaterials: [...prev.rawMaterials, newMaterial.trim()],
      }))
      setNewMaterial("")
    }
  }

  const removeMaterial = (material: string) => {
    setFormData((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter((m) => m !== material),
    }))
  }

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }))
      setNewCertification("")
    }
  }

  const removeCertification = (certification: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== certification),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Internet Identity wallet first",
        variant: "destructive",
      })
      return
    }

    // Validate required fields
    if (!formData.productName || !formData.category || !formData.manufacturer || !formData.location) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare product data for ICP canister
      const productData = {
        name: formData.productName,
        category: formData.category,
        description: formData.description ? [formData.description] : [],
        batch_number: formData.batchNumber ? [formData.batchNumber] : [],
        production_date: formData.productionDate
          ? BigInt(new Date(formData.productionDate).getTime() * 1000000) // Convert to nanoseconds
          : BigInt(Date.now() * 1000000),
        manufacturing_location: formData.location,
        raw_materials: formData.rawMaterials,
        certifications: formData.certifications,
        sustainability_score: formData.sustainabilityScore ? [Number.parseFloat(formData.sustainabilityScore)] : [],
        estimated_value: formData.estimatedValue ? [Number.parseFloat(formData.estimatedValue)] : [],
      }

      console.log("🔄 Registering product with data:", productData)

      // Register product on ICP blockchain
      const result = await icpClient.registerProduct(productData)

      console.log("📦 Product registration result:", result)

      if (result.Ok) {
        setRegisteredProductId(result.Ok)
        setIsSuccess(true)
        toast({
          title: "🎉 Product Registered Successfully!",
          description: `Your product has been added to the blockchain with ID: ${result.Ok}`,
        })
      } else {
        throw new Error(result.Err || "Failed to register product")
      }
    } catch (error) {
      console.error("❌ Product registration failed:", error)
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Product Registered Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Your product has been permanently recorded on the Internet Computer blockchain.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800 font-medium mb-2">Product ID:</p>
              <Badge className="text-lg px-4 py-2 bg-blue-600">{registeredProductId}</Badge>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href={`/track?id=${registeredProductId}`}>📍 Track This Product</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/register">➕ Register Another Product</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/dashboard">📊 Go to Dashboard</Link>
              </Button>
            </div>

            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-800">
                ✅ Your product is now immutably stored on the blockchain and can be tracked throughout its supply chain
                journey.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            <Link href="/track" className="text-gray-600 hover:text-blue-600">
              Track Product
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
            <WalletConnect />
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">📦 Register New Product on Blockchain</h1>

          {/* Connection Status */}
          {!isConnected && (
            <Alert className="mb-6">
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                <strong>Connect your wallet first!</strong> You need to connect your Internet Identity to register
                products on the blockchain.
              </AlertDescription>
            </Alert>
          )}

          {isConnected && !userProfile && !isLoadingUser && (
            <Alert className="mb-6">
              <User className="h-4 w-4" />
              <AlertDescription>
                <strong>User profile not found.</strong> You may need to register as a user first.
                <Link href="/auth/register" className="text-blue-600 hover:underline ml-1">
                  Register here
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {isConnected && userProfile && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Ready to register!</strong> Connected as {userProfile.first_name} {userProfile.last_name} from{" "}
                {userProfile.company}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Basic Information</CardTitle>
                <CardDescription>Enter the fundamental details about your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, productName: e.target.value }))}
                      placeholder="e.g., Organic Cotton T-Shirt"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your product, its features, and benefits..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Manufacturing Details */}
            <Card>
              <CardHeader>
                <CardTitle>🏭 Manufacturing Details</CardTitle>
                <CardDescription>Information about production and manufacturing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manufacturer">Manufacturer/Company *</Label>
                    <Input
                      id="manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData((prev) => ({ ...prev, manufacturer: e.target.value }))}
                      placeholder="Your company name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="batchNumber">Batch Number</Label>
                    <Input
                      id="batchNumber"
                      value={formData.batchNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, batchNumber: e.target.value }))}
                      placeholder="e.g., BATCH-2024-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productionDate">Production Date</Label>
                    <Input
                      id="productionDate"
                      type="date"
                      value={formData.productionDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, productionDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Manufacturing Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Mumbai, India"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Raw Materials */}
            <Card>
              <CardHeader>
                <CardTitle>🌱 Raw Materials</CardTitle>
                <CardDescription>List the raw materials used in production</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    placeholder="e.g., Organic Cotton, Recycled Polyester..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMaterial())}
                  />
                  <Button type="button" onClick={addMaterial}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.rawMaterials.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.rawMaterials.map((material, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {material}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeMaterial(material)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>🏆 Certifications</CardTitle>
                <CardDescription>Add relevant certifications and standards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Select value={newCertification} onValueChange={setNewCertification}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select certification" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonCertifications.map((cert) => (
                        <SelectItem key={cert} value={cert}>
                          {cert}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addCertification}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Or enter custom certification..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                  />
                  <Button type="button" onClick={addCertification}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {cert}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeCertification(cert)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Additional Information</CardTitle>
                <CardDescription>Optional details for enhanced tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sustainabilityScore">Sustainability Score (0-100)</Label>
                    <Input
                      id="sustainabilityScore"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.sustainabilityScore}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sustainabilityScore: e.target.value }))}
                      placeholder="e.g., 85"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedValue">Estimated Value (USD)</Label>
                    <Input
                      id="estimatedValue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.estimatedValue}
                      onChange={(e) => setFormData((prev) => ({ ...prev, estimatedValue: e.target.value }))}
                      placeholder="e.g., 25.99"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex space-x-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting || !isConnected}>
                {isSubmitting ? (
                  <>
                    <Package className="h-4 w-4 mr-2 animate-pulse" />
                    Registering on Blockchain...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Register Product on Blockchain
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>

            {!isConnected && (
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  🔒 Connect your Internet Identity wallet to register products on the blockchain
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
