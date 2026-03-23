"use client"

import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function isoToDisplay(iso: string): string {
  if (!iso) return ""
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

function displayToIso(display: string): string {
  const clean = display.replace(/\D/g, "")
  if (clean.length !== 8) return ""
  const d = clean.slice(0, 2)
  const m = clean.slice(2, 4)
  const y = clean.slice(4, 8)
  return `${y}-${m}-${d}`
}

function formatWhileTyping(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

interface DateInputProps {
  id?: string
  name: string
  defaultValue?: string // ISO yyyy-mm-dd
  required?: boolean
  placeholder?: string
}

export function DateInput({
  id,
  name,
  defaultValue = "",
  required,
  placeholder = "dd/mm/aaaa",
}: DateInputProps) {
  const [display, setDisplay] = useState(isoToDisplay(defaultValue))
  const pickerRef = useRef<HTMLInputElement>(null)
  const iso = displayToIso(display)

  function handlePickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value) {
      setDisplay(isoToDisplay(e.target.value))
    }
  }

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={display}
        onChange={(e) => setDisplay(formatWhileTyping(e.target.value))}
        maxLength={10}
        className="pr-9"
      />
      <button
        type="button"
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        )}
        onClick={() => pickerRef.current?.showPicker()}
        aria-label="Abrir calendario"
      >
        <CalendarIcon className="size-4" />
      </button>
      <input
        ref={pickerRef}
        type="date"
        value={iso}
        onChange={handlePickerChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />
      <input type="hidden" name={name} value={iso} required={required} />
    </div>
  )
}
