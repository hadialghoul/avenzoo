import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { COOKIE, verifyToken } from "./session";

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function credentialsOk(email: string, password: string) {
  const expectedEmail = (process.env.ADMIN_EMAIL || "avenzo@gmail.com").trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || "avenzo@1234";
  return (
    safeEqual(email.trim().toLowerCase(), expectedEmail) && safeEqual(password, expectedPassword)
  );
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
