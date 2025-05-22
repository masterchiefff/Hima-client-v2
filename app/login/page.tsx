"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MsisdnInput } from "@/components/msisdn-input"

export default function Login() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/premiums")
    }
  }, [router])

  const handleRequestOTP = () => {
    if (!phoneNumber || !phoneNumber.match(/^254\d{9}$/)) {
      setError("Please enter a valid phone number (e.g., 7XXXXXXXX)")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setError("")
      setIsLoading(false)
      setStep(2)
      console.log("OTP sent to", phoneNumber, "- Use 123456 to login")
    }, 1000)
  }

  const handleLogin = () => {
    if (!otp) {
      setError("Please enter the OTP")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (otp !== "123456") {
        setError("Invalid OTP. Use 123456 for demo.")
        setIsLoading(false)
        return
      }

      // Set mock token
      localStorage.setItem("token", "mock-jwt-token")
      localStorage.setItem("phoneNumber", phoneNumber)

      // Navigate to premiums
      router.push("/premiums")
    }, 1000)
  }

  return (
    <div className="mobile-container">
      <div className="glow-effect glow-yellow"></div>
      <div className="glow-effect glow-purple"></div>

      <div className="mobile-screen">
        <div className="flex justify-center mb-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" rx="20" fill="#FF4D4D" />
                <circle cx="50" cy="50" r="30" fill="#4DFF4D" />
                <circle cx="70" cy="30" r="20" fill="#4D4DFF" />
              </svg>
            </div>
            <div className="text-xl font-bold">Hima</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {step === 1 ? (
            <>
              <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
              <p className="text-gray-400 mb-8">Login to access your insurance</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Phone Number</label>
                  <MsisdnInput value={phoneNumber} onChange={setPhoneNumber} placeholder="7XXXXXXXX" error={error} />
                </div>

                <Button
                  onClick={handleRequestOTP}
                  className="w-full bg-primary text-black hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Request OTP"}
                </Button>

                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <button onClick={() => router.push("/signup")} className="text-primary hover:underline">
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">Verify your number</h1>
              <p className="text-gray-400 mb-8">Enter the OTP sent to +{phoneNumber}</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">One-Time Password</label>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <Button
                  onClick={handleLogin}
                  className="w-full bg-primary text-black hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Login"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep(1)
                    setError("")
                  }}
                  className="w-full"
                  disabled={isLoading}
                >
                  Change Phone Number
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="w-full h-1 bg-gradient-to-r from-primary to-secondary mt-8"></div>
      </div>
    </div>
  )
}
