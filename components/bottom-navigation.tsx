"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Shield, User } from "lucide-react"

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/premiums" && pathname === "/premiums") return true
    if (path === "/policies" && pathname === "/policies") return true
    if (path === "/profile" && pathname === "/profile") return true
    return false
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-gray-900 py-2 px-4 max-w-md mx-auto z-20 shadow-lg">
      <div className="flex justify-around">
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${isActive("/premiums") ? "text-primary" : "text-gray-400"}`}
          onClick={() => router.push("/premiums")}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${isActive("/policies") ? "text-primary" : "text-gray-400"}`}
          onClick={() => router.push("/policies")}
        >
          <Shield className="h-5 w-5" />
          <span className="text-xs mt-1">Policies</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${isActive("/profile") ? "text-primary" : "text-gray-400"}`}
          onClick={() => router.push("/profile")}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Button>
      </div>
    </div>
  )
}
