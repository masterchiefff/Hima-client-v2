"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, TrendingUpIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Payment {
  id: string
  policyId: string
  policyName: string
  amount: number
  date: string
  status: "successful" | "pending" | "failed"
  method: string
}

interface CompoundingStats {
  totalPaid: number
  savingsFromLongTerm: number
  loyaltyBonus: number
  coverageIncrease: number
  nextMilestone: {
    amount: number
    benefit: string
    progress: number
  }
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [compoundingStats, setCompoundingStats] = useState<CompoundingStats>({
    totalPaid: 0,
    savingsFromLongTerm: 0,
    loyaltyBonus: 0,
    coverageIncrease: 0,
    nextMilestone: {
      amount: 1000,
      benefit: "10% coverage increase",
      progress: 0,
    },
  })
  const [activeTab, setActiveTab] = useState<"history" | "benefits">("history")

  useEffect(() => {
    // Load payments from localStorage or generate demo data if none exists
    const storedPayments = localStorage.getItem("paymentHistory")
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments))
    } else {
      // Generate demo payment history
      const demoPayments = generateDemoPayments()
      setPayments(demoPayments)
      localStorage.setItem("paymentHistory", JSON.stringify(demoPayments))
    }

    // Calculate compounding stats based on payment history
    calculateCompoundingStats()
  }, [])

  const generateDemoPayments = (): Payment[] => {
    const policies = JSON.parse(localStorage.getItem("policies") || "[]")
    const demoPayments: Payment[] = []

    // Generate past payments for each policy
    policies.forEach((policy: any) => {
      const purchaseDate = new Date(policy.purchaseDate)
      const today = new Date()
      let currentDate = new Date(purchaseDate)

      // Add the initial payment
      demoPayments.push({
        id: `payment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        policyId: policy.id,
        policyName: policy.name,
        amount: policy.price,
        date: purchaseDate.toISOString(),
        status: "successful",
        method: "M-Pesa",
      })

      // Add recurring payments based on policy period
      while (currentDate < today) {
        const nextPaymentDate = new Date(currentDate)

        if (policy.period === "Daily") {
          nextPaymentDate.setDate(nextPaymentDate.getDate() + 1)
        } else if (policy.period === "Weekly") {
          nextPaymentDate.setDate(nextPaymentDate.getDate() + 7)
        } else if (policy.period === "Monthly") {
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
        } else if (policy.period === "Annually") {
          nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1)
        } else {
          // Default to weekly if period is not specified
          nextPaymentDate.setDate(nextPaymentDate.getDate() + 7)
        }

        // Only add the payment if it's in the past
        if (nextPaymentDate < today) {
          demoPayments.push({
            id: `payment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            policyId: policy.id,
            policyName: policy.name,
            amount: policy.price,
            date: nextPaymentDate.toISOString(),
            status: "successful",
            method: "M-Pesa",
          })
        }

        currentDate = nextPaymentDate
      }
    })

    // Sort payments by date (newest first)
    return demoPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const calculateCompoundingStats = () => {
    const policies = JSON.parse(localStorage.getItem("policies") || "[]")
    const storedPayments = localStorage.getItem("paymentHistory")
    const payments = storedPayments ? JSON.parse(storedPayments) : []

    // Calculate total paid
    const totalPaid = payments.reduce((sum: number, payment: Payment) => {
      return payment.status === "successful" ? sum + payment.amount : sum
    }, 0)

    // Calculate savings from long-term commitments
    // For demo purposes, we'll assume 5% savings for monthly and 20% for annual payments
    const savingsFromLongTerm = policies.reduce((sum: number, policy: any) => {
      if (policy.period === "Monthly") {
        return sum + policy.price * 0.05
      } else if (policy.period === "Annually") {
        return sum + policy.price * 0.2
      }
      return sum
    }, 0)

    // Calculate loyalty bonus (1% of total paid for each month of continuous payment)
    const loyaltyBonus = totalPaid * 0.01 * Math.floor(payments.length / 4) // Assuming weekly payments

    // Calculate coverage increase (2% for each KES 500 paid)
    const coverageIncrease = Math.floor(totalPaid / 500) * 0.02 * 100

    // Calculate next milestone
    const nextMilestoneAmount = Math.ceil(totalPaid / 1000) * 1000
    const progress = (totalPaid / nextMilestoneAmount) * 100

    setCompoundingStats({
      totalPaid,
      savingsFromLongTerm,
      loyaltyBonus,
      coverageIncrease,
      nextMilestone: {
        amount: nextMilestoneAmount,
        benefit: `${Math.floor(nextMilestoneAmount / 500) * 2}% coverage increase`,
        progress,
      },
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Payment & Benefits</h2>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "history" | "benefits")}>
          <TabsList className="bg-gray-800">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="benefits">Compounding</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "history" ? (
        <div className="space-y-4">
          {payments.length > 0 ? (
            payments.map((payment) => (
              <Card key={payment.id} className="bg-gray-800 border-gray-700 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-2">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-medium break-words">{payment.policyName}</h3>
                      <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <CalendarIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                      {formatDate(payment.date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold whitespace-nowrap">KES {payment.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{payment.method}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No payment history available</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="bg-gray-800 border-gray-700 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Total Paid</h3>
              <p className="text-primary font-bold text-xl">KES {compoundingStats.totalPaid.toFixed(2)}</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="data-row">
                <span className="data-label">Savings from long-term commitment</span>
                <span className="data-value text-green-500">KES {compoundingStats.savingsFromLongTerm.toFixed(2)}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Loyalty bonus</span>
                <span className="data-value text-green-500">KES {compoundingStats.loyaltyBonus.toFixed(2)}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Coverage increase</span>
                <span className="data-value text-green-500">+{compoundingStats.coverageIncrease.toFixed(0)}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Next milestone</span>
                <span>KES {compoundingStats.nextMilestone.amount.toFixed(0)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${compoundingStats.nextMilestone.progress}%` }}
                ></div>
              </div>
              <div className="flex flex-wrap justify-between text-xs">
                <span className="text-gray-400">
                  KES {compoundingStats.totalPaid.toFixed(0)} of {compoundingStats.nextMilestone.amount.toFixed(0)}
                </span>
                <span className="text-primary">{compoundingStats.nextMilestone.benefit}</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUpIcon className="h-5 w-5 text-primary flex-shrink-0" />
              <h3 className="font-medium">Compounding Benefits</h3>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary text-black flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-gray-300">
                  <span className="font-medium text-white">Long-term savings:</span> Save up to 20% with annual payment
                  plans compared to daily or weekly payments.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary text-black flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-gray-300">
                  <span className="font-medium text-white">Loyalty bonus:</span> Earn 1% of your total payments for each
                  month of continuous coverage.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary text-black flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-gray-300">
                  <span className="font-medium text-white">Coverage increase:</span> Your coverage amount increases by
                  2% for every KES 500 paid in premiums.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary text-black flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  4
                </div>
                <p className="text-gray-300">
                  <span className="font-medium text-white">Milestone rewards:</span> Unlock special benefits when you
                  reach payment milestones.
                </p>
              </li>
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}
