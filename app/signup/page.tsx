"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MsisdnInput } from "@/components/msisdn-input"
import { Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function Signup() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")

  // Motorcycle details
  const [motorcycleDetails, setMotorcycleDetails] = useState({
    type: "",
    model: "",
    licensePlate: "",
    year: "",
    engineCapacity: "",
  })

  const handleRequestOTP = () => {
    if (!phoneNumber || !phoneNumber.match(/^254\d{9}$/)) {
      setError("Please enter a valid phone number (e.g., 7XXXXXXXX)")
      return
    }

    setError("")
    setStep(2)
    console.log("OTP sent to", phoneNumber, "- Use 123456 to verify")
  }

  const handleVerifyOTP = () => {
    if (otp !== "123456") {
      setError("Invalid OTP. Use 123456 for demo.")
      return
    }

    setError("")
    setStep(3)
  }

  const handleRegisterMotorcycle = () => {
    // Validate motorcycle details
    if (!motorcycleDetails.type || !motorcycleDetails.licensePlate) {
      setError("Please fill in all required fields")
      return
    }

    // Set mock token and user data
    localStorage.setItem("token", "mock-jwt-token")
    localStorage.setItem("phoneNumber", phoneNumber)
    localStorage.setItem("motorcycleDetails", JSON.stringify(motorcycleDetails))

    // Navigate to premiums
    router.push("/premiums")
  }

  const handleInputChange = (field: string, value: string) => {
    setMotorcycleDetails({
      ...motorcycleDetails,
      [field]: value,
    })
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

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center w-full max-w-xs">
            <div className={`progress-step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
              {step > 1 ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <div className={`progress-line ${step >= 2 ? "active" : ""}`}></div>
            <div className={`progress-step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
              {step > 2 ? <Check className="h-4 w-4" /> : "2"}
            </div>
            <div className={`progress-line ${step >= 3 ? "active" : ""}`}></div>
            <div className={`progress-step ${step >= 3 ? "active" : ""}`}>3</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold mb-2">Welcome to Hima</h1>
              <p className="text-gray-400 mb-6">Enter your phone number to get started</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Phone Number</label>
                  <MsisdnInput value={phoneNumber} onChange={setPhoneNumber} placeholder="7XXXXXXXX" error={error} />
                </div>

                <Button onClick={handleRequestOTP} className="w-full bg-primary text-black hover:bg-primary/90">
                  Request OTP
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold mb-2">Verify Your Number</h1>
              <p className="text-gray-400 mb-6">Enter the OTP sent to +{phoneNumber}</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Enter OTP</label>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button onClick={handleVerifyOTP} className="w-full bg-primary text-black hover:bg-primary/90">
                  Verify OTP
                </Button>

                <Button variant="ghost" onClick={() => setStep(1)} className="w-full">
                  Change Phone Number
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-2xl font-bold mb-2">Register Your Motorcycle</h1>
              <p className="text-gray-400 mb-6">Please provide your motorcycle details</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="motorcycle-type">Motorcycle Type</Label>
                  <Select value={motorcycleDetails.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger id="motorcycle-type" className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="sport">Sport</SelectItem>
                      <SelectItem value="cruiser">Cruiser</SelectItem>
                      <SelectItem value="scooter">Scooter</SelectItem>
                      <SelectItem value="off-road">Off-Road</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license-plate">License Plate</Label>
                  <Input
                    id="license-plate"
                    placeholder="e.g., KBX-123"
                    value={motorcycleDetails.licensePlate}
                    onChange={(e) => handleInputChange("licensePlate", e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model (Optional)</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Honda CB125"
                    value={motorcycleDetails.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year (Optional)</Label>
                    <Input
                      id="year"
                      placeholder="e.g., 2020"
                      value={motorcycleDetails.year}
                      onChange={(e) => handleInputChange("year", e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engine-capacity">Engine Capacity (cc)</Label>
                    <Select
                      value={motorcycleDetails.engineCapacity}
                      onValueChange={(value) => handleInputChange("engineCapacity", value)}
                    >
                      <SelectTrigger id="engine-capacity" className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select cc" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="under50">Under 50cc</SelectItem>
                        <SelectItem value="50-125">50-125cc</SelectItem>
                        <SelectItem value="126-250">126-250cc</SelectItem>
                        <SelectItem value="251-500">251-500cc</SelectItem>
                        <SelectItem value="over500">Over 500cc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button onClick={handleRegisterMotorcycle} className="w-full bg-primary text-black hover:bg-primary/90">
                  Complete Registration
                </Button>

                <Button variant="ghost" onClick={() => setStep(2)} className="w-full">
                  Back
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
