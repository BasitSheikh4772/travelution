import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Single-admin auth: credentials come from env (ADMIN_USER / ADMIN_PASSWORD),
 * the session is an HMAC-signed, HttpOnly cookie. No password is stored in the DB.
 */
const COOKIE = "tv_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const secret = () => {
  const s = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("Set ADMIN_PASSWORD (and SESSION_SECRET) in .env.local to enable the admin portal.");
  return s;
};
const sign = (v: string) => crypto.createHmac("sha256", secret()).update(v).digest("base64url");

const safeEqual = (a: string, b: string) => {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
};

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD;

export function checkCredentials(user: string, pass: string) {
  if (!adminConfigured()) return false;
  const okUser = safeEqual(user.trim().toLowerCase(), (process.env.ADMIN_USER ?? "admin").toLowerCase());
  const okPass = safeEqual(pass, process.env.ADMIN_PASSWORD!);
  return okUser && okPass;
}

export async function startSession() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && !process.env.INSECURE_COOKIES,
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [exp, sig] = v.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not authorised");
}
