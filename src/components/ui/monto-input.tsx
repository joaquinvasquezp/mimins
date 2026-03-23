"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface MontoInputProps {
  id?: string;
  name: string;
  placeholder?: string;
  defaultValue?: number | string;
  required?: boolean;
}

function format(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("es-CL");
}

function parse(value: string): string {
  return value.replace(/\D/g, "");
}

export default function MontoInput({
  id,
  name,
  placeholder,
  defaultValue,
  required,
}: MontoInputProps) {
  const initialRaw = defaultValue ? parse(String(defaultValue)) : "";
  const [display, setDisplay] = useState(initialRaw ? format(initialRaw) : "");
  const [raw, setRaw] = useState(initialRaw);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = parse(e.target.value);
    setRaw(digits);
    setDisplay(digits ? format(digits) : "");
  }

  return (
    <>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={display}
        onChange={handleChange}
        required={required}
      />
      <input type="hidden" name={name} value={raw} />
    </>
  );
}
