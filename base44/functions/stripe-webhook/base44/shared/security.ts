import { secrets } from "base44:runtime";
const te = new TextEncoder();
const td = new TextDecoder();
export const now = () => new Date().toISOString();
export const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export function normalizePhone(raw: string) {
  const source = String(raw || "").trim();
  const digits = source.replace(/\D/g, "");
  const phone = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith("1") ? `+${digits}` : source.startsWith("+") ? `+${digits}` : "";
  if (!/^\+1\d{10}$/.test(phone)) throw new Error("Valid +1 phone number required");
  return phone;
}
export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", te.encode(value));
  return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, "0")).join("");
}
export async function phoneHash(phone: string) { return sha256(`${normalizePhone(phone)}:${secrets.get("PHONE_HASH_PEPPER")}`); }
function b64(v: Uint8Array) { return btoa(String.fromCharCode(...v)); }
function ub64(v: string) { return Uint8Array.from(atob(v), c => c.charCodeAt(0)); }
async function key() {
  const raw = await crypto.subtle.digest("SHA-256", te.encode(secrets.get("PHONE_ENCRYPTION_KEY")));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}
export async function encryptPhone(raw: string) {
  const phone = normalizePhone(raw); const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await key(), te.encode(phone));
  return { ciphertext: b64(new Uint8Array(cipher)), iv: b64(iv), last4: phone.slice(-4) };
}
export async function decryptPhone(ciphertext: string, iv: string) {
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ub64(iv) }, await key(), ub64(ciphertext));
  return td.decode(plain);
}
export function randomToken(bytes = 32) { return b64(crypto.getRandomValues(new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ""); }
export function otpCode() { return String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0"); }