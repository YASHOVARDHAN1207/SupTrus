"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, ArrowRight } from "lucide-react"
import { ProductRegistrationGuide } from "@/components/product-registration-guide"
import { WalletConnect } from "@/components/wallet-connect"

export default function RegistrationGuidePage() {
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">📦 How to Register Your Product on Blockchain</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn how to add your products to the Internet Computer blockchain for transparent, immutable supply chain
              tracking.
            </p>
          </div>

          <ProductRegistrationGuide />

          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/register">
                Start Registration
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
