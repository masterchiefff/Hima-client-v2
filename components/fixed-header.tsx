"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface FixedHeaderProps {
  title: string
  onBack?: () => void
  showBackButton?: boolean
  rightElement?: React.ReactNode
}

export function FixedHeader({ title, onBack, showBackButton = true, rightElement }: FixedHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 bg-gray-950 border-b border-gray-800 max-w-md mx-auto">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 text-gray-400">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold truncate max-w-[200px]">{title}</h1>
        </div>
        {rightElement}
      </div>
    </div>
  )
}
