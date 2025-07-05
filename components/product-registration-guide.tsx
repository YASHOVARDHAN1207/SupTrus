"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Wallet, User, FileText, Award, Leaf, DollarSign } from "lucide-react"

export function ProductRegistrationGuide() {
  const steps = [
    {
      icon: <Wallet className="h-5 w-5" />,
      title: "Connect Internet Identity",
      description: "Connect your Internet Identity wallet to authenticate with the blockchain",
      status: "required",
    },
    {
      icon: <User className="h-5 w-5" />,
      title: "User Profile",
      description: "Ensure you have a registered user profile (manufacturer, supplier, etc.)",
      status: "recommended",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Product Details",
      description: "Fill in basic product information: name, category, description",
      status: "required",
    },
    {
      icon: <Package className="h-5 w-5" />,
      title: "Manufacturing Info",
      description: "Add manufacturing details: location, batch number, production date",
      status: "required",
    },
    {
      icon: <Leaf className="h-5 w-5" />,
      title: "Raw Materials",
      description: "List all raw materials used in production for transparency",
      status: "optional",
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Certifications",
      description: "Add relevant certifications (ISO, Fair Trade, Organic, etc.)",
      status: "optional",
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Additional Data",
      description: "Include sustainability score and estimated value",
      status: "optional",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "required":
        return "bg-red-100 text-red-800"
      case "recommended":
        return "bg-yellow-100 text-yellow-800"
      case "optional":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Product Registration Guide
        </CardTitle>
        <CardDescription>
          Follow these steps to register your product on the Internet Computer blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
              <div className="flex-shrink-0 mt-0.5">{step.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <Badge className={getStatusColor(step.status)}>{step.status}</Badge>
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">🔗 What happens when you register?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your product gets a unique blockchain ID</li>
            <li>• All data is immutably stored on Internet Computer</li>
            <li>• Supply chain tracking becomes possible</li>
            <li>• Consumers can verify product authenticity</li>
            <li>• You can add supply chain events as product moves</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">✅ Benefits of Blockchain Registration</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>
              • <strong>Immutable Records:</strong> Cannot be tampered with or deleted
            </li>
            <li>
              • <strong>Full Transparency:</strong> Complete supply chain visibility
            </li>
            <li>
              • <strong>Consumer Trust:</strong> Verifiable product authenticity
            </li>
            <li>
              • <strong>Compliance:</strong> Meet regulatory requirements
            </li>
            <li>
              • <strong>Sustainability:</strong> Track environmental impact
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
