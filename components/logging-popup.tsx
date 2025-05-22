"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface LoggingPopupProps {
  logs: string[]
  onComplete: () => void
  isComplete: boolean
}

export function LoggingPopup({ logs, onComplete, isComplete }: LoggingPopupProps) {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < logs.length) {
      const timer = setTimeout(() => {
        setVisibleLogs((prev) => [...prev, logs[currentIndex]])
        setCurrentIndex((prev) => prev + 1)
      }, 800) // Show a new log message every 800ms

      return () => clearTimeout(timer)
    } else if (currentIndex === logs.length && !isComplete) {
      // All logs have been displayed, wait a bit before completing
      const timer = setTimeout(() => {
        onComplete()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, logs, onComplete, isComplete])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
      <Card className="bg-gray-800 border-gray-700 p-6 max-w-sm w-full mx-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Setting up your account</h3>
            {!isComplete && <Loader2 className="h-5 w-5 text-primary animate-spin" />}
          </div>

          <div className="bg-gray-900 rounded-md p-4 font-mono text-sm h-64 overflow-y-auto">
            {visibleLogs.map((log, index) => (
              <div key={index} className="mb-2">
                <span className="text-green-500">$</span> {log}
              </div>
            ))}
            {!isComplete && currentIndex < logs.length && (
              <div className="h-4 w-4 inline-block relative">
                <span className="absolute top-0 left-0 h-full w-full bg-white opacity-75 animate-pulse"></span>
              </div>
            )}
            {isComplete && <div className="text-green-500 mt-2">✓ Registration complete! Redirecting...</div>}
          </div>
        </div>
      </Card>
    </div>
  )
}
