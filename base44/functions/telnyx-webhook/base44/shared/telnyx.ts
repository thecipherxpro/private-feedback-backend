import { secrets } from "base44:runtime";
export const TELNYX_FROM = "+16475776111";
export async function sendSMS(to: string, text: string) {
  const key = secrets.get("TELNYX_API_KEY");
  const profile = secrets.get("TELNYX_MESSAGING_PROFILE_ID");
  const res = await fetch("https://api.telnyx.com/v2/messages", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: TELNYX_FROM, to, text, messaging_profile_id: profile })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Telnyx ${res.status}: ${JSON.stringify(data)}`);
  return data?.data || data;
}