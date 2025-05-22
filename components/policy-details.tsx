"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, FileText, Check } from "lucide-react"
import { FixedHeader } from "@/components/fixed-header"

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

interface PolicyDetailsProps {
  policy: Policy
  onBack: () => void
}

export function PolicyDetails({ policy, onBack }: PolicyDetailsProps) {
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
    <div>
      <FixedHeader title="Policy Details" onBack={onBack} />

      <div>
        <div className="gradient-card rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-black/70">Insurance policy</div>
              <div className="text-2xl font-bold text-black break-words">{policy.name}</div>
              {policy.period && <div className="text-sm text-black/70">Billed {policy.period.toLowerCase()}</div>}
            </div>
            <Badge className={`${getStatusColor(policy.status)} border text-black ml-2`}>{policy.status}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-gray-800 border-gray-700 p-3 flex flex-col items-center justify-center">
            <div className="text-primary text-xl font-bold">{policy.price.toFixed(2)}</div>
            <div className="text-xs text-gray-400">KES Premium</div>
          </Card>
          <Card className="bg-gray-800 border-gray-700 p-3 flex flex-col items-center justify-center">
            <div className="text-primary text-xl font-bold">{policy.coverageAmount?.toLocaleString()}</div>
            <div className="text-xs text-gray-400">KES Coverage</div>
          </Card>
        </div>

        {policy.coverages && policy.coverages.length > 0 && (
          <>
            <h2 className="text-lg font-bold mb-3">Coverage Details</h2>
            <Card className="bg-gray-800 border-gray-700 p-4 mb-4">
              <div className="space-y-3">
                {policy.coverages.map((coverage) => (
                  <div key={coverage.id} className="flex items-start">
                    {coverage.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <div className="h-5 w-5 border border-gray-600 rounded-full mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <div className={`font-medium break-words ${coverage.included ? "" : "text-gray-500"}`}>
                      {coverage.name}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        <h2 className="text-lg font-bold mb-3">Policy Information</h2>
        <Card className="bg-gray-800 border-gray-700 p-4 mb-4">
          <div className="space-y-4">
            <div className="data-row">
              <div className="data-label">Policy Type</div>
              <div className="data-value">{policy.type}</div>
            </div>
            <div className="data-row">
              <div className="data-label">Policy ID</div>
              <div className="data-value">{policy.id.substring(0, 8).toUpperCase()}</div>
            </div>
            <div className="data-row">
              <div className="data-label">Purchase Date</div>
              <div className="data-value">{formatDate(policy.purchaseDate)}</div>
            </div>
            <div className="data-row">
              <div className="data-label">Expiry Date</div>
              <div className="data-value">{policy.expiryDate ? formatDate(policy.expiryDate) : "N/A"}</div>
            </div>
            {policy.period && (
              <div className="data-row">
                <div className="data-label">Billing Cycle</div>
                <div className="data-value">{policy.period}</div>
              </div>
            )}
          </div>
        </Card>

        <h2 className="text-lg font-bold mb-3">Motorcycle Information</h2>
        <Card className="bg-gray-800 border-gray-700 p-4 mb-6">
          <div className="space-y-4">
            {policy.motorcycleDetails ? (
              <>
                <div className="data-row">
                  <div className="data-label">Vehicle Type</div>
                  <div className="data-value">
                    {policy.motorcycleDetails.type.charAt(0).toUpperCase() + policy.motorcycleDetails.type.slice(1)}
                  </div>
                </div>
                <div className="data-row">
                  <div className="data-label">License Plate</div>
                  <div className="data-value">{policy.motorcycleDetails.licensePlate}</div>
                </div>
                {policy.motorcycleDetails.model && (
                  <div className="data-row">
                    <div className="data-label">Model</div>
                    <div className="data-value">{policy.motorcycleDetails.model}</div>
                  </div>
                )}
                <div className="data-row">
                  <div className="data-label">Engine Capacity</div>
                  <div className="data-value">
                    {policy.motorcycleDetails.engineCapacity
                      .replace("-", " to ")
                      .replace("under", "Under ")
                      .replace("over", "Over ")}
                    cc
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="data-row">
                  <div className="data-label">Vehicle Type</div>
                  <div className="data-value">{policy.vehicleDetails?.type}</div>
                </div>
                <div className="data-row">
                  <div className="data-label">License Plate</div>
                  <div className="data-value">{policy.vehicleDetails?.licensePlate}</div>
                </div>
                <div className="data-row">
                  <div className="data-label">Model</div>
                  <div className="data-value">{policy.vehicleDetails?.model || "N/A"}</div>
                </div>
              </>
            )}
          </div>
        </Card>

        <div className="space-y-3 mb-6">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            <span>View Policy Document</span>
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            <span>Download Certificate</span>
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Renew Policy</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
