"use client"

import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"

interface SuccessPopupProps {
  title: string
  message: string
  buttonText: string
  onButtonClick: () => void
}

export function SuccessPopup({ title, message, buttonText, onButtonClick }: SuccessPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-700 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-gray-400 mb-4">{message}</p>
          <div className="gradient-card w-full rounded-lg p-3 mb-4">
            <div className="text-black font-medium">Your policy is now active</div>
          </div>
          <Button onClick={onButtonClick} className="w-full bg-primary text-black hover:bg-primary/90">
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}
