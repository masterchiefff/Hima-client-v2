"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export function UserAvatar() {
  const router = useRouter()
  const [userData, setUserData] = useState<{ phoneNumber: string; walletAddress: string | null }>({
    phoneNumber: "User",
    walletAddress: null,
  })

  const API_BASE_URL = "http://localhost:5000/api/v1"

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/signup")
          return
        }
        const response = await axios.get(`${API_BASE_URL}/auth/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserData({
          phoneNumber: response.data.phone,
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

    fetchUserData()
  }, [router])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await axios.post(
          `${API_BASE_URL}/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        // @ts-ignore
        console.error("Logout error:", err.response?.data?.message || err.message)
      } else {
        console.error("Logout error:", (err as Error).message || err)
      }
    } finally {
      // Clear localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("phoneNumber")
      localStorage.removeItem("selectedPremium")
      localStorage.removeItem("motorcycleDetails")
      localStorage.removeItem("walletAddress")

      // Redirect to signup page
      router.push("/signup")
    }
  }

  // Format wallet address for display (e.g., 0x1234...5678)
  const formatWalletAddress = (address: string | null) => {
    if (!address) return "No wallet address"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
          <User className="h-5 w-5 text-gray-300" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700 text-white">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="focus:bg-gray-700 cursor-default">
          <span className="text-gray-400">Phone: </span>
          <span className="ml-1">+{userData.phoneNumber}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="focus:bg-gray-700 cursor-default">
          <span className="text-gray-400">Wallet: </span>
          {userData.walletAddress ? (
            <a
              href={`https://alfajores-blockscout.celo-testnet.org/address/${userData.walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-primary font-mono hover:underline focus:underline"
            >
              {formatWalletAddress(userData.walletAddress)}
            </a>
          ) : (
            <span className="ml-1 text-gray-400">No wallet address</span>
          )}
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