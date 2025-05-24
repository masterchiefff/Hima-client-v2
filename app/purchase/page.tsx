"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { FixedHeader } from "@/components/fixed-header"
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
  price: number
  period: string
  coverages?: Coverage[]
}

interface MotorcycleDetails {
  type: string
  model: string
  licensePlate: string
  year: string
  engineCapacity: string | number
}

export default function Purchase() {
  const router = useRouter()
  const [premium, setPremium] = useState<Premium | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [motorcycleDetails, setMotorcycleDetails] = useState<MotorcycleDetails | null>(null)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingUser, setIsFetchingUser] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signup")
      return
    }

    const selectedPremium = localStorage.getItem("selectedPremium")
    if (!selectedPremium) {
      router.push("/premiums")
      return
    }

    setPremium(JSON.parse(selectedPremium))

    const fetchUserData = async () => {
      try {
        setIsFetchingUser(true)
        const response = await axios.get("http://localhost:5000/api/v1/auth/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setPhoneNumber(response.data.phone)
        if (response.data.motorcycle) {
          const motorcycle = {
            ...response.data.motorcycle,
            engineCapacity: String(response.data.motorcycle.engineCapacity),
          }
          setMotorcycleDetails(motorcycle)
          localStorage.setItem("motorcycleDetails", JSON.stringify(motorcycle))
        }

        localStorage.setItem("phoneNumber", response.data.phone)
      } catch (err) {
        console.error('Failed to fetch user data:', err)
        toast.error("Failed to fetch user data. Using cached data if available.") // Error as toast
        const storedPhoneNumber = localStorage.getItem("phoneNumber")
        if (storedPhoneNumber) {
          setPhoneNumber(storedPhoneNumber)
        }

        const storedMotorcycleDetails = localStorage.getItem("motorcycleDetails")
        if (storedMotorcycleDetails) {
          const motorcycle = JSON.parse(storedMotorcycleDetails)
          motorcycle.engineCapacity = String(motorcycle.engineCapacity)
          setMotorcycleDetails(motorcycle)
        }
      } finally {
        setIsFetchingUser(false)
      }
    }

    fetchUserData()
  }, [router])

  const pollPolicyStatus = async (orderID: string) => {
    const token = localStorage.getItem("token")
    const maxAttempts = 12
    const interval = 5000
    let attempts = 0

    const checkStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/policies/status/${orderID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const { status, transactionHash, explorerLink } = response.data

        if (status === "Active") {
          const existingPolicies = JSON.parse(localStorage.getItem("policies") || "[]")
          const newPolicy = {
            id: orderID,
            name: premium!.name,
            price: premium!.price * 0.99,
            purchaseDate: new Date().toISOString(),
            status: "Active",
            period: premium!.period,
            coverages: premium!.coverages,
            motorcycleDetails,
            transactionHash,
            explorerLink,
          }

          localStorage.setItem("policies", JSON.stringify([...existingPolicies, newPolicy]))

          const existingPayments = JSON.parse(localStorage.getItem("paymentHistory") || "[]")
          const newPayment = {
            id: `payment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            policyId: orderID,
            policyName: premium!.name,
            amount: premium!.price,
            date: new Date().toISOString(),
            status: "successful",
            method: "M-Pesa",
          }

          localStorage.setItem("paymentHistory", JSON.stringify([newPayment, ...existingPayments]))

          toast.dismiss() // Clear all toasts on success
          setShowSuccessPopup(true)
          setIsLoading(false)
          setTimeout(() => {
            router.push("/policies")
          }, 3000)
        } else if (status === "Failed") {
          toast.error("Payment failed. Please try again.") // Error as toast
          setIsLoading(false)
        } else {
          // Status is Pending, continue polling
          attempts++
          if (attempts < maxAttempts) {
            setTimeout(checkStatus, interval)
          } else {
            toast.error("Payment confirmation timed out. Please check your policies or try again.") // Error as toast
            setIsLoading(false)
          }
        }
      } catch (err) {
        toast.error("Failed to check payment status. Please try again.") // Error as toast
        setIsLoading(false)
      }
    }

    checkStatus()
  }

  const handlePurchase = async () => {
    if (!premium || !phoneNumber) {
      toast.error("Missing premium or phone number") // Error as toast
      return
    }

    setIsLoading(true)
    toast.dismiss() // Clear any existing toasts before new purchase

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:5000/api/v1/policies/buy-insurance",
        {
          phone: phoneNumber,
          amountKes: premium.price,
          premiumId: premium.id,
          duration: premium.period.toLowerCase(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 202) {
        // STK Push initiated, show as neutral Sonner toast
        toast.message("Please complete the M-Pesa payment on your phone.", {
          duration: 10000, // Show for 10 seconds
        })
        const orderID = response.data.orderID
        pollPolicyStatus(orderID)
      } else {
        throw new Error(response.data.message || "Unexpected response from server")
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to initiate payment") // Error as toast
      } else {
        toast.error("Failed to initiate payment") // Error as toast
      }
      setIsLoading(false)
    }
  }

  if (!premium || isFetchingUser) {
    return (
      <div className="mobile-container">
        <div className="mobile-screen">
          <FixedHeader title="Payment Insurance" onBack={() => router.push("/premiums")} />
          <p className="text-gray-400 text-sm mt-4">Loading user data...</p>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="mobile-container">
      <Toaster richColors position="top-center" /> {/* Sonner Toaster for all notifications */}
      <div className="glow-effect glow-yellow"></div>
      <div className="glow-effect glow-purple"></div>

      <div className="mobile-screen">
        <FixedHeader title="Payment Insurance" onBack={() => router.push("/premiums")} />

        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-700 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-gray-400 mb-4">
                  You have successfully purchased {premium?.name} insurance for KES {premium?.price}.
                </p>
                <div className="gradient-card w-full rounded-lg p-3 mb-4">
                  <div className="text-black font-medium">Your policy is now active</div>
                </div>
                <Button
                  onClick={() => router.push("/policies")}
                  className="w-full bg-primary text-black hover:bg-primary/90"
                >
                  View My Policies
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="gradient-card rounded-lg p-4 mb-6">
            <div className="text-sm text-black/70">Insurance package</div>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-black break-words mr-2">{premium.name}</div>
              <div className="text-2xl font-bold text-black whitespace-nowrap">KES {premium.price}</div>
            </div>
            <div className="text-sm text-black/70 mt-1">Billed {premium.period.toLowerCase()}</div>
          </div>

          <h2 className="text-xl font-bold mb-4">Coverage Details</h2>

          <Card className="bg-gray-800 border-gray-700 p-4 mb-4">
            <div className="space-y-3">
              {premium.coverages?.map((coverage) => (
                <div key={coverage.id} className="flex items-start">
                  {coverage.included ? (
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className="h-5 w-5 border border-gray-600 rounded-full mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <div className={`font-medium break-words ${coverage.included ? "" : "text-gray-500"}`}>
                      {coverage.name}
                    </div>
                    {coverage.name === "Personal Accident" && coverage.included && (
                      <p className="text-sm text-gray-400">
                        Coverage for injuries sustained while riding your motorcycle
                      </p>
                    )}
                    {coverage.name === "Medical Expenses" && coverage.included && (
                      <p className="text-sm text-gray-400">
                        {premium.name.includes("Basic")
                          ? "Basic coverage for medical expenses up to KES 20,000"
                          : "Full coverage for medical expenses up to KES 50,000"}
                      </p>
                    )}
                    {coverage.name === "Third Party Injury" && coverage.included && (
                      <p className="text-sm text-gray-400">Coverage for injuries caused to third parties</p>
                    )}
                    {coverage.name === "Motorcycle Damage" && coverage.included && (
                      <p className="text-sm text-gray-400">
                        Coverage for damage to your motorcycle in case of an accident
                      </p>
                    )}
                    {coverage.name === "Theft Protection" && coverage.included && (
                      <p className="text-sm text-gray-400">Coverage in case your motorcycle is stolen</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <h2 className="text-xl font-bold mb-4">Motorcycle Information</h2>

          <Card className="bg-gray-800 border-gray-700 p-4 mb-4">
            <div className="space-y-4">
              {motorcycleDetails && (
                <>
                  <div className="data-row">
                    <div className="data-label">Vehicle type</div>
                    <div className="data-value">
                      {motorcycleDetails.type.charAt(0).toUpperCase() + motorcycleDetails.type.slice(1)}
                    </div>
                  </div>

                  <div className="data-row">
                    <div className="data-label">License plate</div>
                    <div className="data-value">{motorcycleDetails.licensePlate}</div>
                  </div>

                  {motorcycleDetails.model && (
                    <div className="data-row">
                      <div className="data-label">Model</div>
                      <div className="data-value">{motorcycleDetails.model}</div>
                    </div>
                  )}

                  <div className="data-row">
                    <div className="data-label">Engine capacity</div>
                    <div className="data-value">
                      {String(motorcycleDetails.engineCapacity)} cc
                    </div>
                  </div>
                </>
              )}

              <div className="data-row">
                <div className="data-label">Vehicle owner</div>
                <div className="data-value">+{phoneNumber}</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-4 mb-6">
            <div className="data-row">
              <div className="data-label">Insurance company</div>
              <div className="data-value">Hima</div>
            </div>
          </Card>

          <div className="mt-auto">
            <Button
              onClick={handlePurchase}
              className="w-full bg-primary text-black hover:bg-primary/90"
              disabled={isLoading || isFetchingUser}
            >
              {isLoading ? "Processing..." : "Buy Now"}
            </Button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}