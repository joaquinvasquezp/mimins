"use server";

import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "crypto";

export type LoginState = { error?: string } | undefined;

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function login(
  _state: LoginState,
  formData: FormData
): Promise<LoginState> {
  const user = formData.get("user") as string;
  const password = formData.get("password") as string;

  if (!user || !password) {
    return { error: "Ingresa usuario y contraseña" };
  }

  const validUser = process.env.AUTH_USER;
  const validPassword = process.env.AUTH_PASSWORD;

  if (!validUser || !validPassword) {
    return { error: "Autenticación no configurada en el servidor" };
  }

  if (!safeCompare(user, validUser) || !safeCompare(password, validPassword)) {
    return { error: "Credenciales incorrectas" };
  }

  await createSession(user);
  redirect("/");
}
