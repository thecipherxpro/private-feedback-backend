import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2, Smartphone, MessageSquare } from 'lucide-react';
import { api } from '@/lib/backend';

export default function Onboarding() {
  const navigate = useNavigate();
  const saved = JSON.parse(sessionStorage.getItem('pf_onboarding') || '{}');
  const [nickname, setNickname] = useState(saved.nickname || '');
  const [phone, setPhone] = useState(saved.phone || '');
  const [consent, setConsent] = useState(saved.consent !== false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { api('account').then((r) => { if (r.profile?.phone_verified) navigate('/', { replace: true }); }).catch(() => {}); }, []);
  async function request() { setBusy(true); setError(''); try { await api('request_phone_otp', { phone }); setSent(true); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  async function verify() { setBusy(true); setError(''); try { await api('verify_phone_otp', { code, nickname, sms_consent: consent }); sessionStorage.removeItem('pf_onboarding'); navigate('/', { replace: true }); } catch (e) { setError(e.message); } finally { setBusy(false); } }

  return (
    <div className="ios-page min-h-screen px-4 py-7">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md items-center">
        <div className="w-full ios-card rounded-[2.25rem] p-5 md:p-7">
          <span className="grid h-14 w-14 place-items-center rounded-[1.35rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/18"><ShieldCheck className="h-7 w-7" /></span>
          <h1 className="screen-title mt-6 text-[2.5rem] font-bold text-slate-950">Verify mobile</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">One verified mobile number creates one receiving identity and enables abuse controls.</p>
          {error && <p className="mt-5 rounded-[1.2rem] bg-red-50 p-4 text-sm leading-6 text-red-700">{error}</p>}
          {!sent ? (
            <div className="mt-6 space-y-4">
              <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Nickname</Label><Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="soft-field h-12 rounded-[1.15rem]" /></div>
              <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Mobile number</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="soft-field h-12 rounded-[1.15rem]" inputMode="tel" placeholder="(647) 555-0123" /></div>
              <label className="flex items-start gap-3 rounded-[1.4rem] bg-white/70 p-4 ring-1 ring-white/80"><Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} className="mt-0.5" /><span className="text-xs leading-5 text-slate-500">I explicitly agree to receive Private Feedback SMS notifications. Message frequency varies; carrier rates may apply. Reply STOP to opt out.</span></label>
              <Button className="h-12 w-full rounded-[1.2rem]" disabled={busy || !nickname || !phone} onClick={request}>{busy ? <Loader2 className="animate-spin" /> : <Smartphone className="h-4 w-4" />}Send verification code</Button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] bg-slate-950 p-4 text-sm leading-6 text-white/70"><MessageSquare className="mb-3 h-5 w-5 text-white" />Enter the 6-digit code we sent to your phone.</div>
              <Input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" className="soft-field h-14 rounded-[1.2rem] text-center text-2xl font-bold tracking-[.45em]" />
              <Button className="h-12 w-full rounded-[1.2rem]" disabled={busy || code.length !== 6} onClick={verify}>{busy ? <Loader2 className="animate-spin" /> : <ShieldCheck className="h-4 w-4" />}Verify & continue</Button>
              <Button variant="ghost" className="h-12 w-full rounded-full" onClick={() => setSent(false)}>Change phone number</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}