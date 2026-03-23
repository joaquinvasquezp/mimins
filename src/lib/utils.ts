import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMonto(value: number): string {
  return "$" + value.toLocaleString("es-CL", { maximumFractionDigits: 0 })
}
