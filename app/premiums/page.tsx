"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card } from "@/components/ui/card"
import { UserAvatar } from "@/components/user-avatar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PaymentHistory } from "@/components/payment-history"
import { toast, Toaster } from "sonner"

interface Coverage {
  id: string
  name: string
  included: boolean
}

interface Premium {
  id: string
  name: string
  description: string
  basePrice: number
  coverages: Coverage[]
}

interface UserData {
  phone: string
  walletAddress: string | null
}

export default function Premiums() {
  const router = useRouter()
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "annually">("weekly")
  const [viewMode, setViewMode] = useState<"premiums" | "payments">("premiums")
  const [premiums, setPremiums] = useState<Premium[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signup")
      return
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/auth/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserData({
          phone: response.data.phone,
          walletAddress: response.data.walletAddress,
        })
      } catch (err) {
        toast.error(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to fetch user data"
            : "Failed to fetch user data"
        )
      }
    }

    // Fetch premiums
    const fetchPremiums = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/policies/get-premiums", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setPremiums(response.data.premiums)
      } catch (err) {
        toast.error(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to fetch premiums"
            : "Failed to fetch premiums"
        )
      }
    }

    fetchUserData()
    fetchPremiums()
  }, [router])

  const calculatePrice = (basePrice: number, frequency: string): number => {
    switch (frequency) {
      case "daily":
        return Math.ceil(basePrice / 7) + 2 - 9
      case "weekly":
        return basePrice
      case "monthly":
        return Math.ceil(basePrice * 4 * 0.95)
      case "annually":
        return Math.ceil(basePrice * 52 * 0.8)
      default:
        return basePrice
    }
  }

  const handleSelectPremium = (premium: Premium) => {
    const selectedPremium = {
      id: premium.id,
      name: premium.name,
      description: premium.description,
      price: calculatePrice(premium.basePrice, frequency),
      period: frequency.charAt(0).toUpperCase() + frequency.slice(1),
      coverages: premium.coverages,
    }
    localStorage.setItem("selectedPremium", JSON.stringify(selectedPremium))
    router.push("/purchase")
  }

  // Format wallet address for display (e.g., 0x1234...5678)
  const formatWalletAddress = (address: string | null) => {
    if (!address) return "No wallet address"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="mobile-container">
      <Toaster richColors position="top-center" />
      <div className="glow-effect glow-yellow"></div>
      <div className="glow-effect glow-purple"></div>

      <div className="mobile-screen">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-950 z-10 py-3 px-4 rounded-md shadow-sm border border-gray-800">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">
              Welcome, {userData?.phone || "User"}
            </h1>
            <p className="text-gray-400 text-primary text-xs mt-1 font-mono">
              {userData?.walletAddress ? (
                <a
                  href={`https://alfajores-blockscout.celo-testnet.org/address/${userData.walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-gray-200 transition-colors"
                >
                  {formatWalletAddress(userData.walletAddress)}
                </a>
              ) : (
                "No wallet address"
              )}
            </p>
          </div>
          <UserAvatar />
        </div>

        <div className="mb-4">
          <Tabs defaultValue="premiums" value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList className="grid grid-cols-2 bg-gray-800 w-full">
              <TabsTrigger value="premiums">Buy Insurance</TabsTrigger>
              <TabsTrigger value="payments">Payment Benefits</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === "premiums" ? (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Payment Frequency</label>
              <Tabs defaultValue="weekly" value={frequency} onValueChange={(value) => setFrequency(value as any)}>
                <TabsList className="grid grid-cols-4 bg-gray-800 w-full">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="annually">Annual</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {premiums.length === 0 && !userData && (
              <p className="text-gray-400 text-sm mb-4">Loading premiums...</p>
            )}

            <div className="space-y-6">
              {premiums.map((premium) => (
                <Card key={premium.id} className="bg-gray-800 border-gray-700 p-4 overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{premium.name}</h3>
                      <p className="text-gray-400 text-sm">{premium.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold text-xl">
                        KES {calculatePrice(premium.basePrice, frequency)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        /{frequency === "annually" ? "year" : frequency.slice(0, -2) + "y"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-300 mb-2">Coverage Includes:</div>
                    <div className="grid grid-cols-1 gap-2">
                      {premium.coverages.map((coverage) => (
                        <div key={coverage.id} className="flex items-center text-sm text-gray-400">
                          {coverage.included ? (
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          ) : (
                            <div className="h-4 w-4 border border-gray-600 rounded-full mr-2 flex-shrink-0" />
                          )}
                          <span className={coverage.included ? "" : "text-gray-500"}>{coverage.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {frequency === "monthly" && (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 mb-3">
                      Save 5% with monthly payments
                    </Badge>
                  )}

                  {frequency === "annually" && (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 mb-3">
                      Save 20% with annual payments
                    </Badge>
                  )}

                  <Button
                    onClick={() => handleSelectPremium(premium)}
                    className="w-full bg-primary text-black hover:bg-primary/90"
                  >
                    Select Plan
                  </Button>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <PaymentHistory />
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}