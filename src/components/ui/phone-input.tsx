"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

function formatWhileTyping(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 9)
  if (digits.length <= 1) return digits
  if (digits.length <= 5) return `${digits[0]} ${digits.slice(1)}`
  return `${digits[0]} ${digits.slice(1, 5)} ${digits.slice(5)}`
}

function stripPrefix(stored: string): string {
  return stored.replace(/^\+?56\s*/, "")
}

interface PhoneInputProps {
  id?: string
  name: string
  defaultValue?: string
  required?: boolean
}

export function PhoneInput({
  id,
  name,
  defaultValue = "",
  required,
}: PhoneInputProps) {
  const initial = stripPrefix(defaultValue).replace(/\D/g, "")
  const [display, setDisplay] = useState(formatWhileTyping(initial))
  const digits = display.replace(/\D/g, "")
  const hidden = digits.length === 9 ? `+56${digits}` : ""

  return (
    <div className="flex">
      <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-2.5 text-sm text-muted-foreground select-none">
        +56
      </span>
      <Input
        id={id}
        type="tel"
        inputMode="numeric"
        placeholder="9 1234 5678"
        value={display}
        onChange={(e) => setDisplay(formatWhileTyping(e.target.value))}
        maxLength={11}
        className="rounded-l-none"
      />
      <input type="hidden" name={name} value={hidden} required={required} />
    </div>
  )
}
