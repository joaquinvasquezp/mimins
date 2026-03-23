import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMonto(value: number): string {
  return "$" + value.toLocaleString("es-CL", { maximumFractionDigits: 0 })
}

export const TZ = "America/Santiago"

export function todayISO(): string {
  const now = new Date()
  const y = now.toLocaleString("en-CA", { timeZone: TZ, year: "numeric" })
  const m = now.toLocaleString("en-CA", { timeZone: TZ, month: "2-digit" })
  const d = now.toLocaleString("en-CA", { timeZone: TZ, day: "2-digit" })
  return `${y}-${m}-${d}`
}

export function formatTelefono(tel: string): string {
  const digits = tel.replace(/\D/g, "")
  if (digits.length === 11 && digits.startsWith("56")) {
    const n = digits.slice(2)
    return `+56 ${n[0]} ${n.slice(1, 5)} ${n.slice(5)}`
  }
  return tel
}

export function formatFecha(date: Date | string): string {
  const d = new Date(date)
  const parts = new Intl.DateTimeFormat("es-CL", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(d)
  const dia = parts.find((p) => p.type === "day")!.value
  const mes = parts.find((p) => p.type === "month")!.value
  const anio = parts.find((p) => p.type === "year")!.value
  return `${dia}/${mes}/${anio}`
}
