"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useICPWallet } from "@/hooks/use-icp-wallet"
import { icpClient } from "@/lib/icp-client"
import { AlertCircle, CheckCircle, RefreshCw, ExternalLink } from "lucide-react"

export function WalletDebug() {
  const { isConnected, principal, balance, isLoading, error, connect, disconnect } = useICPWallet()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isDebugging, setIsDebugging] = useState(false)

  const runDebugChecks = async () => {
    setIsDebugging(true)
    const debug: any = {}

    try {
      // Check environment variables
      debug.env = {
        network: process.env.NEXT_PUBLIC_DFX_NETWORK || "local",
        canisterId: process.env.NEXT_PUBLIC_SUPPLY_CHAIN_CANISTER_ID,
        internetIdentityId: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID,
        nodeEnv: process.env.NODE_ENV,
      }

      // Check if dfx is running (for local development)
      if (debug.env.network === "local") {
        try {
          const response = await fetch("http://localhost:4943/api/v2/status")
          debug.dfxStatus = response.ok ? "Running" : "Not responding"
          debug.dfxDetails = response.ok ? await response.json() : null
        } catch {
          debug.dfxStatus = "Not running"
        }
      }

      // Check Internet Identity accessibility
      const iiCanisterId = debug.env.internetIdentityId
      if (iiCanisterId) {
        const iiUrl = debug.env.network === "ic" ? "https://identity.ic0.app" : `http://${iiCanisterId}.localhost:4943`

        debug.internetIdentity = {
          canisterId: iiCanisterId,
          url: iiUrl,
        }

        try {
          const response = await fetch(iiUrl, { mode: "no-cors" })
          debug.internetIdentity.accessible = "Likely accessible"
        } catch {
          debug.internetIdentity.accessible = "May not be accessible"
        }
      }

      // Check authentication status
      debug.authStatus = await icpClient.isAuthenticated()

      // Try to get canister status if authenticated
      if (debug.authStatus) {
        try {
          debug.canisterTest = await icpClient.testConnection()
          if (debug.canisterTest) {
            debug.canisterStatus = await icpClient.getCanisterStatus()
          }
        } catch (error) {
          debug.canisterError = error instanceof Error ? error.message : "Unknown error"
        }
      }

      setDebugInfo(debug)
    } catch (error) {
      debug.error = error instanceof Error ? error.message : "Unknown error"
      setDebugInfo(debug)
    }

    setIsDebugging(false)
  }

  const openInternetIdentity = () => {
    const iiCanisterId = process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID
    const network = process.env.NEXT_PUBLIC_DFX_NETWORK || "local"

    const url = network === "ic" ? "https://identity.ic0.app" : `http://${iiCanisterId}.localhost:4943`

    window.open(url, "_blank")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Internet Identity Debug
        </CardTitle>
        <CardDescription>Debug information for Internet Identity wallet connection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Connection Status:</label>
            <Badge variant={isConnected ? "default" : "destructive"} className="ml-2">
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium">Loading:</label>
            <Badge variant={isLoading ? "secondary" : "outline"} className="ml-2">
              {isLoading ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {principal && (
          <div>
            <label className="text-sm font-medium">Principal:</label>
            <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">{principal.toString()}</p>
          </div>
        )}

        {/* Debug Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={connect} disabled={isLoading || isConnected}>
            {isLoading ? "Connecting..." : "Connect Internet Identity"}
          </Button>
          <Button onClick={disconnect} disabled={!isConnected} variant="outline">
            Disconnect
          </Button>
          <Button onClick={runDebugChecks} disabled={isDebugging} variant="secondary">
            {isDebugging ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Debugging...
              </>
            ) : (
              "Run Debug Checks"
            )}
          </Button>
          <Button onClick={openInternetIdentity} variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Internet Identity
          </Button>
        </div>

        {/* Debug Information */}
        {debugInfo && (
          <div className="space-y-3">
            <h3 className="font-medium">Debug Results:</h3>

            {/* Environment Variables */}
            <div>
              <h4 className="text-sm font-medium mb-2">Configuration:</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Network:</span>
                  <Badge variant="outline">{debugInfo.env.network}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Supply Chain Canister:</span>
                  <Badge variant={debugInfo.env.canisterId ? "default" : "destructive"}>
                    {debugInfo.env.canisterId ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Internet Identity Canister:</span>
                  <Badge variant={debugInfo.env.internetIdentityId ? "default" : "destructive"}>
                    {debugInfo.env.internetIdentityId ? "Set" : "Missing"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* DFX Status */}
            {debugInfo.dfxStatus && (
              <div>
                <h4 className="text-sm font-medium mb-2">DFX Status:</h4>
                <Badge variant={debugInfo.dfxStatus === "Running" ? "default" : "destructive"}>
                  {debugInfo.dfxStatus}
                </Badge>
              </div>
            )}

            {/* Internet Identity */}
            {debugInfo.internetIdentity && (
              <div>
                <h4 className="text-sm font-medium mb-2">Internet Identity:</h4>
                <div className="text-xs space-y-1">
                  <div>
                    Canister ID: <code>{debugInfo.internetIdentity.canisterId}</code>
                  </div>
                  <div>
                    URL: <code>{debugInfo.internetIdentity.url}</code>
                  </div>
                  <div>Status: {debugInfo.internetIdentity.accessible}</div>
                </div>
              </div>
            )}

            {/* Authentication */}
            <div>
              <h4 className="text-sm font-medium mb-2">Authentication:</h4>
              <Badge variant={debugInfo.authStatus ? "default" : "destructive"}>
                {debugInfo.authStatus ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </div>

            {/* Canister Status */}
            {debugInfo.canisterTest && (
              <div>
                <h4 className="text-sm font-medium mb-2">Canister Connection:</h4>
                <div className="text-xs bg-green-50 p-2 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600 inline mr-1" />
                  Successfully connected to supply chain canister
                </div>
              </div>
            )}

            {debugInfo.canisterError && (
              <div>
                <h4 className="text-sm font-medium mb-2">Canister Error:</h4>
                <div className="text-xs bg-red-50 p-2 rounded text-red-800">{debugInfo.canisterError}</div>
              </div>
            )}
          </div>
        )}

        {/* Setup Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium mb-2">Setup Instructions:</h4>
          <ol className="text-xs space-y-1 text-blue-800 list-decimal list-inside">
            <li>
              Run the setup script: <code>chmod +x setup_internet_identity.sh && ./setup_internet_identity.sh</code>
            </li>
            <li>
              Make sure dfx is running: <code>dfx start --background</code>
            </li>
            <li>
              Restart your Next.js app: <code>npm run dev</code>
            </li>
            <li>Click "Connect Internet Identity" to authenticate</li>
            <li>Create or use existing Internet Identity</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
