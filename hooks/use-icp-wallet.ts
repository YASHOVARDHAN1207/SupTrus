"use client"

import { useState, useEffect, useCallback } from "react"
import { icpClient } from "@/lib/icp-client"
import type { Principal } from "@dfinity/principal"

interface WalletState {
  isConnected: boolean
  principal: Principal | null
  balance: number
  isLoading: boolean
  error: string | null
}

export function useICPWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    principal: null,
    balance: 0,
    isLoading: true,
    error: null,
  })

  const updateState = useCallback((updates: Partial<WalletState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  const connect = useCallback(async () => {
    try {
      console.log("🔄 Connecting wallet...")
      updateState({ isLoading: true, error: null })

      const success = await icpClient.login()

      if (success) {
        const principal = await icpClient.getPrincipal()
        const balance = await icpClient.getICPBalance()

        updateState({
          isConnected: true,
          principal,
          balance,
          isLoading: false,
        })

        console.log("✅ Wallet connected successfully")
      } else {
        updateState({
          isConnected: false,
          error: "Failed to connect wallet",
          isLoading: false,
        })
        console.log("❌ Wallet connection failed")
      }
    } catch (error) {
      console.error("❌ Wallet connection error:", error)
      updateState({
        isConnected: false,
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      })
    }
  }, [updateState])

  const disconnect = useCallback(async () => {
    try {
      console.log("🔄 Disconnecting wallet...")
      await icpClient.logout()
      updateState({
        isConnected: false,
        principal: null,
        balance: 0,
        error: null,
      })
      console.log("✅ Wallet disconnected")
    } catch (error) {
      console.error("❌ Disconnect error:", error)
      updateState({
        error: error instanceof Error ? error.message : "Failed to disconnect",
      })
    }
  }, [updateState])

  const refreshBalance = useCallback(async () => {
    if (!state.isConnected) return

    try {
      console.log("🔄 Refreshing balance...")
      const balance = await icpClient.getICPBalance()
      updateState({ balance })
      console.log("✅ Balance refreshed:", balance)
    } catch (error) {
      console.error("❌ Failed to refresh balance:", error)
      updateState({
        error: error instanceof Error ? error.message : "Failed to refresh balance",
      })
    }
  }, [state.isConnected, updateState])

  const transfer = useCallback(
    async (to: string, amount: number) => {
      if (!state.isConnected) throw new Error("Wallet not connected")

      try {
        console.log(`🔄 Transferring ${amount} ICP to ${to}`)
        updateState({ isLoading: true, error: null })

        const success = await icpClient.transferICP(to, amount)

        if (success) {
          await refreshBalance()
          updateState({ isLoading: false })
          console.log("✅ Transfer successful")
          return true
        } else {
          updateState({
            error: "Transfer failed",
            isLoading: false,
          })
          console.log("❌ Transfer failed")
          return false
        }
      } catch (error) {
        console.error("❌ Transfer error:", error)
        updateState({
          error: error instanceof Error ? error.message : "Transfer failed",
          isLoading: false,
        })
        return false
      }
    },
    [state.isConnected, updateState, refreshBalance],
  )

  // Initialize wallet connection on mount
  useEffect(() => {
    const initWallet = async () => {
      try {
        console.log("🔄 Initializing wallet...")
        await icpClient.init()
        const isAuthenticated = await icpClient.isAuthenticated()

        if (isAuthenticated) {
          console.log("✅ User already authenticated")
          const principal = await icpClient.getPrincipal()
          const balance = await icpClient.getICPBalance()

          updateState({
            isConnected: true,
            principal,
            balance,
            isLoading: false,
          })
        } else {
          console.log("❌ User not authenticated")
          updateState({ isLoading: false })
        }
      } catch (error) {
        console.error("❌ Wallet initialization error:", error)
        updateState({
          error: error instanceof Error ? error.message : "Failed to initialize wallet",
          isLoading: false,
        })
      }
    }

    initWallet()
  }, [updateState])

  return {
    ...state,
    connect,
    disconnect,
    refreshBalance,
    transfer,
  }
}
