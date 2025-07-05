import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Shield, Truck, Package, CheckCircle, Globe, Lock, Users } from "lucide-react"
import Link from "next/link"
import { WalletConnect } from "@/components/wallet-connect"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SupTrus</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/track" className="text-gray-600 hover:text-blue-600 transition-colors">
              Track Product
            </Link>
            <Link href="/register" className="text-gray-600 hover:text-blue-600 transition-colors">
              Register Product
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <WalletConnect />
            <Button variant="outline" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transparent Supply Chain
            <span className="block text-blue-600">Powered by ICP Blockchain</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track every stage of your product's journey with immutable, tamper-proof records. From production to
            delivery, ensure authenticity and build consumer trust.
          </p>

          {/* Quick Search */}
          <div className="max-w-md mx-auto mb-12">
            <div className="flex space-x-2">
              <Input placeholder="Enter Product ID to track..." className="flex-1" />
              <Button size="lg" asChild>
                <Link href="/track">
                  <Search className="h-4 w-4 mr-2" />
                  Track
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Products Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Verified Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose ChainTrack?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Tamper-Proof Records</CardTitle>
                <CardDescription>
                  All data is immutably stored on ICP blockchain, ensuring complete transparency and preventing
                  manipulation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Real-Time Tracking</CardTitle>
                <CardDescription>
                  Monitor your products in real-time as they move through the supply chain from production to delivery.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Ethical Sourcing</CardTitle>
                <CardDescription>
                  Verify ethical sourcing and sustainability practices with complete audit trails and certifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Global Network</CardTitle>
                <CardDescription>
                  Connect with manufacturers, logistics partners, and retailers worldwide on a unified platform.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Built on Internet Computer with enterprise-grade security and privacy controls for sensitive data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Multi-Stakeholder</CardTitle>
                <CardDescription>
                  Designed for manufacturers, logistics providers, retailers, and consumers to collaborate seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Supply Chain?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of companies already using SupTrus for transparent, secure supply chain management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/demo">Request Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-6 w-6" />
                <span className="text-xl font-bold">SupTrus</span>
              </div>
              <p className="text-gray-400">
                Decentralized supply chain tracking powered by Internet Computer blockchain.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/track" className="hover:text-white">
                    Track Products
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Register Products
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/docs" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SupTrus. All rights reserved. Powered by Internet Computer.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
