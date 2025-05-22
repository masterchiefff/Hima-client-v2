"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/user-avatar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ChevronRight, Edit2, Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Profile() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    // Get phone number
    const storedPhoneNumber = localStorage.getItem("phoneNumber")
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber)
    }
  }, [router])

  // Avoid hydration mismatch
  if (!mounted) return null

  return (
    <div className="mobile-container bg-white dark:bg-gray-950">
      <div className="glow-effect glow-yellow dark:opacity-100 opacity-30"></div>
      <div className="glow-effect glow-purple dark:opacity-100 opacity-30"></div>

      <div className="mobile-screen">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-gray-950 z-10 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <UserAvatar />
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
            <User className="h-10 w-10 text-gray-500 dark:text-gray-300" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white break-words">+{phoneNumber}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Member since {new Date().toLocaleDateString()}</p>
        </div>

        <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Personal Information</h2>
        <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Phone Number</label>
              <Input
                value={`+${phoneNumber}`}
                disabled
                className="bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Full Name</label>
              <Input
                placeholder="Enter your full name"
                className="bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Email Address</label>
              <Input
                placeholder="Enter your email"
                className="bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        </Card>

        <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Account Settings</h2>
        <div className="space-y-2 mb-6">
          <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                )}
                <Label htmlFor="theme-mode" className="font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </Label>
              </div>
              <Switch
                id="theme-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </Card>

          <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors">
            <div className="font-medium text-gray-900 dark:text-white">Notification Settings</div>
            <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          </Card>
          <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors">
            <div className="font-medium text-gray-900 dark:text-white">Payment Methods</div>
            <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          </Card>
          <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors">
            <div className="font-medium text-gray-900 dark:text-white">Language & Region</div>
            <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          </Card>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
        >
          <Edit2 className="h-4 w-4 flex-shrink-0" />
          <span>Update Profile</span>
        </Button>
      </div>

      <BottomNavigation />
    </div>
  )
}
