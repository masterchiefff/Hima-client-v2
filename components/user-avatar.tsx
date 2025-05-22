"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserAvatar() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("phoneNumber") || "User"
    }
    return "User"
  })

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("phoneNumber")
    localStorage.removeItem("selectedPremium")
    localStorage.removeItem("motorcycleDetails")
    router.push("/signup")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
          <User className="h-5 w-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700 text-white">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="focus:bg-gray-700 cursor-default">
          <span className="text-gray-400">Phone:</span> +{phoneNumber}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="focus:bg-gray-700" onClick={() => router.push("/profile")}>
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-gray-700" onClick={() => router.push("/policies")}>
          My Policies
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="focus:bg-gray-700 text-red-400 focus:text-red-400" onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
