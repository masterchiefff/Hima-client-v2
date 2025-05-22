"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PolicyCard } from "@/components/policy-card"
import { PolicyDetails } from "@/components/policy-details"
import { UserAvatar } from "@/components/user-avatar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { PaymentHistory } from "@/components/payment-history"

interface Coverage {
  id: string
  name: string
  included: boolean
}

interface MotorcycleDetails {
  type: string
  model: string
  licensePlate: string
  year: string
  engineCapacity: string
}

interface Policy {
  id: string
  name: string
  price: number
  purchaseDate: string
  status: string
  period?: string
  coverages?: Coverage[]
  motorcycleDetails?: MotorcycleDetails
  type?: string
  coverageAmount?: number
  expiryDate?: string
  vehicleDetails?: {
    type: string
    licensePlate: string
    model?: string
  }
}

export default function Policies() {
  const router = useRouter()
  const [policies, setPolicies] = useState<Policy[]>([])
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"policies" | "payments">("policies")

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signup")
      return
    }

    // Get policies
    const storedPolicies = localStorage.getItem("policies")
    if (storedPolicies) {
      const parsedPolicies = JSON.parse(storedPolicies)

      // Enhance policies with more details for demo purposes
      const enhancedPolicies = parsedPolicies.map((policy: Policy) => {
        const purchaseDate = new Date(policy.purchaseDate)
        const expiryDate = new Date(purchaseDate)

        // Set expiry date based on period
        if (policy.period === "Daily") {
          expiryDate.setDate(expiryDate.getDate() + 1)
        } else if (policy.period === "Weekly") {
          expiryDate.setDate(expiryDate.getDate() + 7)
        } else if (policy.period === "Monthly") {
          expiryDate.setMonth(expiryDate.getMonth() + 1)
        } else if (policy.period === "Annually") {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1)
        } else {
          // Default to weekly if period is not specified
          expiryDate.setDate(expiryDate.getDate() + 7)
        }

        return {
          ...policy,
          type: policy.name.includes("Basic")
            ? "Accident"
            : policy.name.includes("Comprehensive")
              ? "Comprehensive"
              : "Third Party",
          coverageAmount: policy.name.includes("Basic")
            ? 50000
            : policy.name.includes("Comprehensive")
              ? 150000
              : 75000,
          expiryDate: expiryDate.toISOString(),
          vehicleDetails: policy.motorcycleDetails
            ? undefined
            : {
                type: "Motorcycle",
                licensePlate: "KBX-" + Math.floor(100 + Math.random() * 900),
                model: "Boda 50cc",
              },
        }
      })

      setPolicies(enhancedPolicies)
      setFilteredPolicies(enhancedPolicies)
    }
  }, [router])

  useEffect(() => {
    // Filter policies based on search query and active tab
    let filtered = policies

    if (searchQuery) {
      filtered = filtered.filter(
        (policy) =>
          policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          policy.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          policy.vehicleDetails?.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          policy.motorcycleDetails?.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((policy) => policy.status.toLowerCase() === activeTab)
    }

    setFilteredPolicies(filtered)
  }, [searchQuery, policies, activeTab])

  const handleViewDetails = (policy: Policy) => {
    setSelectedPolicy(policy)
    setShowDetails(true)
  }

  const handleBackToList = () => {
    setShowDetails(false)
    setSelectedPolicy(null)
  }

  return (
    <div className="mobile-container">
      <div className="glow-effect glow-yellow"></div>
      <div className="glow-effect glow-purple"></div>

      <div className="mobile-screen">
        {!showDetails ? (
          <>
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-950 z-10 py-4">
              <h1 className="text-2xl font-bold">Your Policies</h1>
              <UserAvatar />
            </div>

            <div className="mb-4">
              <Tabs defaultValue="policies" value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                <TabsList className="grid grid-cols-2 bg-gray-800 w-full">
                  <TabsTrigger value="policies">My Policies</TabsTrigger>
                  <TabsTrigger value="payments">Payment History</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {viewMode === "policies" ? (
              <>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search policies..."
                    className="pl-10 bg-gray-800 border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <Tabs defaultValue="all" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 bg-gray-800">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="expired">Expired</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {filteredPolicies.length > 0 ? (
                  <div className="space-y-4 mb-4">
                    {filteredPolicies.map((policy) => (
                      <PolicyCard key={policy.id} policy={policy} onViewDetails={() => handleViewDetails(policy)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400 mb-2">No policies found</p>
                    <p className="text-gray-500 text-sm">
                      {policies.length > 0
                        ? "Try adjusting your search or filters"
                        : "You don't have any active policies yet"}
                    </p>
                  </div>
                )}

                <div className="mt-auto pt-4">
                  <Button
                    onClick={() => router.push("/premiums")}
                    className="w-full bg-primary text-black hover:bg-primary/90"
                  >
                    Buy More Insurance
                  </Button>
                </div>
              </>
            ) : (
              <PaymentHistory />
            )}
          </>
        ) : (
          selectedPolicy && <PolicyDetails policy={selectedPolicy} onBack={handleBackToList} />
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
