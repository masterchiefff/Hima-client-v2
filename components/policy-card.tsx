"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

interface Policy {
  id: string
  name: string
  price: number
  purchaseDate: string
  status: string
  period?: string
  type?: string
  coverageAmount?: number
  expiryDate?: string
  vehicleDetails?: {
    type: string
    licensePlate: string
    model?: string
  }
}

interface PolicyCardProps {
  policy: Policy
  onViewDetails: () => void
}

export function PolicyCard({ policy, onViewDetails }: PolicyCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "expired":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  return (
    <Card
      className="bg-gray-800 border-gray-700 p-4 cursor-pointer hover:bg-gray-700/80 transition-colors"
      onClick={onViewDetails}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-2">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-lg break-words">{policy.name}</h3>
            <Badge className={`${getStatusColor(policy.status)} border`}>{policy.status}</Badge>
          </div>
          <p className="text-gray-400 text-sm mb-2 break-words">
            {policy.vehicleDetails?.type || "Motorcycle"} •{" "}
            {policy.vehicleDetails?.licensePlate || policy.motorcycleDetails?.licensePlate}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
              Valid until {policy.expiryDate ? formatDate(policy.expiryDate) : "N/A"}
            </div>
            {policy.period && (
              <div className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">{policy.period}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-primary font-bold whitespace-nowrap">{policy.price.toFixed(2)} KES</p>
          <ChevronRight className="h-5 w-5 text-gray-400 mt-2" />
        </div>
      </div>
    </Card>
  )
}
