"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, Copy, Send, RefreshCw, LogOut, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"
import { useICPWallet } from "@/hooks/use-icp-wallet"
import { useToast } from "@/hooks/use-toast"
import { icpClient } from "@/lib/icp-client"

export function WalletConnect() {
  const { isConnected, principal, balance, isLoading, error, connect, disconnect, transfer, refreshBalance } =
    useICPWallet()
  const { toast } = useToast()
  const [transferAmount, setTransferAmount] = useState("")
  const [transferTo, setTransferTo] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleConnect = async () => {
    try {
      console.log("🔄 Starting Internet Identity connection...")
      toast({
        title: "Connecting...",
        description: "Opening Internet Identity authentication",
      })

      const success = await connect()

      if (success) {
        toast({
          title: "✅ Connected Successfully!",
          description: "Your Internet Identity is now connected to SupTrus",
        })
      } else {
        toast({
          title: "❌ Connection Failed",
          description: "Failed to connect to Internet Identity. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        title: "❌ Connection Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from Internet Identity",
    })
  }

  const handleTransfer = async () => {
    if (!transferTo || !transferAmount) {
      toast({
        title: "Invalid Input",
        description: "Please enter both recipient and amount",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(transferAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough ICP tokens",
        variant: "destructive",
      })
      return
    }

    setIsTransferring(true)
    try {
      const success = await transfer(transferTo, amount)
      if (success) {
        toast({
          title: "Transfer Successful",
          description: `Successfully transferred ${amount} ICP`,
        })
        setTransferAmount("")
        setTransferTo("")
      }
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsTransferring(false)
    }
  }

  const copyPrincipal = () => {
    if (principal) {
      navigator.clipboard.writeText(principal.toString())
      toast({
        title: "Copied!",
        description: "Principal ID copied to clipboard",
      })
    }
  }

  const testConnection = async () => {
    try {
      const success = await icpClient.testConnection()
      toast({
        title: success ? "✅ Connection Test Passed" : "❌ Connection Test Failed",
        description: success
          ? "Successfully connected to the supply chain canister"
          : "Failed to connect to the canister. Check console for details.",
        variant: success ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "❌ Test Failed",
        description: "Connection test failed. Check console for details.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Button disabled>
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex items-center space-x-2">
        {error && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        )}
        <Button onClick={handleConnect} className="bg-blue-600 hover:bg-blue-700">
          <Wallet className="h-4 w-4 mr-2" />
          Connect Internet Identity
        </Button>
      </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 bg-white border-green-200 hover:bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="hidden sm:inline text-green-700">{balance.toFixed(2)} ICP</span>
          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
            Connected
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Internet Identity Wallet
          </DialogTitle>
          <DialogDescription>Manage your Internet Computer identity and ICP tokens</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Connection Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Connected to Internet Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Balance:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{balance.toFixed(4)} ICP</span>
                  <Button size="sm" variant="ghost" onClick={refreshBalance} className="h-6 w-6 p-0">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Principal:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded max-w-32 truncate">
                    {principal?.toString()}
                  </span>
                  <Button size="sm" variant="ghost" onClick={copyPrincipal} className="h-6 w-6 p-0">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Button size="sm" variant="outline" onClick={() => setShowDetails(!showDetails)} className="w-full">
                {showDetails ? "Hide Details" : "Show Details"}
              </Button>

              {showDetails && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Network:</span>
                      <Badge variant="outline">{process.env.NEXT_PUBLIC_DFX_NETWORK || "local"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Canister:</span>
                      <span className="font-mono text-xs">
                        {process.env.NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID?.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={testConnection} className="w-full bg-transparent">
                    Test Connection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transfer Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Send ICP Tokens</CardTitle>
              <CardDescription>Transfer ICP tokens to another principal (Demo)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="transferTo">Recipient Principal</Label>
                <Input
                  id="transferTo"
                  placeholder="Enter principal ID..."
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="transferAmount">Amount (ICP)</Label>
                <Input
                  id="transferAmount"
                  type="number"
                  step="0.0001"
                  min="0"
                  max={balance}
                  placeholder="0.0000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
              </div>

              <Button
                onClick={handleTransfer}
                disabled={isTransferring || !transferTo || !transferAmount}
                className="w-full"
              >
                {isTransferring ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send ICP (Demo)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => window.open("https://identity.ic0.app", "_blank")}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage Internet Identity
            </Button>

            <Button variant="outline" onClick={handleDisconnect} className="w-full bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
