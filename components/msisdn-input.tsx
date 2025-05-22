"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface MsisdnInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  className?: string
}

export function MsisdnInput({ value, onChange, placeholder = "7XXXXXXXX", error, className = "" }: MsisdnInputProps) {
  const [inputValue, setInputValue] = useState("")

  // Initialize input value from the full phone number (without the +254 prefix)
  useEffect(() => {
    if (value.startsWith("254")) {
      setInputValue(value.substring(3))
    } else {
      setInputValue(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Only allow digits and limit to 9 characters (Kenya mobile numbers)
    if (/^\d*$/.test(newValue) && newValue.length <= 9) {
      setInputValue(newValue)

      // Add the 254 prefix when sending the value back
      onChange("254" + newValue)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">+254</div>
      <Input type="tel" value={inputValue} onChange={handleChange} className="pl-14" placeholder={placeholder} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
