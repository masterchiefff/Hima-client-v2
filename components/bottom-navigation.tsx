"use client"

import { usePathname, useRouter } from "next/navigation"
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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-md py-3 px-6 max-w-md mx-auto z-30 shadow-md rounded-t-lg">
      <div className="flex justify-between">
        <button
          className={`flex flex-col items-center px-2 py-1 rounded-md transition-colors duration-200 transform ${
            isActive("/premiums")
              ? "text-primary"
              : "text-gray-400 hover:text-gray-200 hover:rounded-md hover:bg-gray-800/50 active:scale-95"
          }`}
          onClick={() => router.push("/premiums")}
        >
          <Home className="h-6 w-6" />
          <span className="text-sm mt-1">Home</span>
        </button>
        <button
          className={`flex flex-col items-center px-2 py-1 rounded-md transition-colors duration-200 transform ${
            isActive("/policies")
              ? "text-primary"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 active:scale-95"
          }`}
          onClick={() => router.push("/policies")}
        >
          <Shield className="h-6 w-6" />
          <span className="text-sm mt-1">Policies</span>
        </button>
        <button
          className={`flex flex-col items-center px-2 py-1 rounded-md transition-colors duration-200 transform ${
            isActive("/profile")
              ? "text-primary"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 active:scale-95"
          }`}
          onClick={() => router.push("/profile")}
        >
          <User className="h-6 w-6" />
          <span className="text-sm mt-1">Profile</span>
        </button>
      </div>
    </div>
  )
}