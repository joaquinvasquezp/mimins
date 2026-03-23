"use client"

import * as React from "react"
import { useState } from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"

interface SearchSelectItem {
  value: string
  label: string
}

interface SearchSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  items: SearchSelectItem[]
  name?: string
  required?: boolean
}

export default function SearchSelect({
  value: controlledValue,
  onValueChange,
  placeholder = "Buscar...",
  items,
  name,
  required,
}: SearchSelectProps) {
  const [internalValue, setInternalValue] = useState("")
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue
  const filter = ComboboxPrimitive.useFilter({ sensitivity: "base" })

  function handleValueChange(val: unknown) {
    if (val == null) return
    const strVal = val as string
    if (!isControlled) setInternalValue(strVal)
    if (onValueChange) onValueChange(strVal)
  }

  return (
    <ComboboxPrimitive.Root
      value={currentValue || null}
      onValueChange={handleValueChange}
      items={items}
      itemToStringLabel={(item: unknown) => (item as SearchSelectItem).label}
      itemToStringValue={(item: unknown) => (item as SearchSelectItem).value}
      filter={(item: unknown, inputValue: string) =>
        filter.contains(
          (item as SearchSelectItem).label,
          inputValue
        )
      }
    >
      <ComboboxPrimitive.InputGroup
        className={cn(
          "flex h-8 w-full items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 text-base transition-colors",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          "dark:bg-input/30"
        )}
      >
        <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <ComboboxPrimitive.Input
          className="flex-1 min-w-0 bg-transparent py-1 text-base outline-none placeholder:text-muted-foreground md:text-sm"
          placeholder={placeholder}
        />
        <ComboboxPrimitive.Trigger
          className="flex items-center justify-center text-muted-foreground"
        >
          <ComboboxPrimitive.Icon>
            <ChevronDownIcon className="size-4" />
          </ComboboxPrimitive.Icon>
        </ComboboxPrimitive.Trigger>
      </ComboboxPrimitive.InputGroup>

      {name && <input type="hidden" name={name} value={currentValue} required={required} />}

      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          side="bottom"
          sideOffset={4}
          className="isolate z-[70]"
        >
          <ComboboxPrimitive.Popup
            className="max-h-60 w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-y-auto rounded-lg border bg-popover text-popover-foreground shadow-md p-1 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            <ComboboxPrimitive.List>
              {(item: SearchSelectItem) => (
                <ComboboxPrimitive.Item
                  key={item.value}
                  value={item.value}
                  className="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                >
                  {item.label}
                  <ComboboxPrimitive.ItemIndicator
                    render={
                      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
                    }
                  >
                    <CheckIcon className="size-4" />
                  </ComboboxPrimitive.ItemIndicator>
                </ComboboxPrimitive.Item>
              )}
            </ComboboxPrimitive.List>
            <ComboboxPrimitive.Empty className="px-2 py-3 text-sm text-muted-foreground text-center empty:hidden">
              Sin resultados
            </ComboboxPrimitive.Empty>

          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  )
}
