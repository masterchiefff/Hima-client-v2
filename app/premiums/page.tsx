"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { UserAvatar } from "@/components/user-avatar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PaymentHistory } from "@/components/payment-history"

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

export default function Premiums() {
  const router = useRouter()
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "annually">("weekly")
  const [viewMode, setViewMode] = useState<"premiums" | "payments">("premiums")
  const [premiums, setPremiums] = useState<Premium[]>([
    {
      id: "basic-accident",
      name: "Basic Accident",
      description: "Essential coverage for accidents while riding",
      basePrice: 50, // Weekly base price
      coverages: [
        { id: "personal-accident", name: "Personal Accident", included: true },
        { id: "medical-expenses", name: "Medical Expenses (Limited)", included: true },
        { id: "third-party-injury", name: "Third Party Injury", included: false },
        { id: "bike-damage", name: "Motorcycle Damage", included: false },
        { id: "theft-protection", name: "Theft Protection", included: false },
      ],
    },
    {
      id: "comprehensive",
      name: "Comprehensive",
      description: "Full coverage for your motorcycle and yourself",
      basePrice: 150, // Weekly base price
      coverages: [
        { id: "personal-accident", name: "Personal Accident", included: true },
        { id: "medical-expenses", name: "Medical Expenses (Full)", included: true },
        { id: "third-party-injury", name: "Third Party Injury", included: true },
        { id: "bike-damage", name: "Motorcycle Damage", included: true },
        { id: "theft-protection", name: "Theft Protection", included: true },
      ],
    },
    {
      id: "third-party",
      name: "Third Party",
      description: "Coverage for damage to others and their property",
      basePrice: 75, // Weekly base price
      coverages: [
        { id: "personal-accident", name: "Personal Accident", included: false },
        { id: "medical-expenses", name: "Medical Expenses", included: false },
        { id: "third-party-injury", name: "Third Party Injury", included: true },
        { id: "bike-damage", name: "Motorcycle Damage", included: false },
        { id: "theft-protection", name: "Theft Protection", included: false },
      ],
    },
  ])

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signup")
    }
  }, [router])

  const calculatePrice = (basePrice: number, frequency: string): number => {
    switch (frequency) {
      case "daily":
        return Math.ceil(basePrice / 7) + 1 // Daily price with small markup for profit
      case "weekly":
        return basePrice // Base price is weekly
      case "monthly":
        return Math.ceil(basePrice * 4 * 0.95) // Monthly with 5% discount but ensuring profit
      case "annually":
        return Math.ceil(basePrice * 52 * 0.8) // Annual with 20% discount but ensuring profit
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

  return (
    <div className="mobile-container">
      <div className="glow-effect glow-yellow"></div>
      <div className="glow-effect glow-purple"></div>

      <div className="mobile-screen">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-950 z-10 py-4">
          <h1 className="text-2xl font-bold">Hima Insurance</h1>
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
