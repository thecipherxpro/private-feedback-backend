import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldCheck, Sparkles, ArrowLeft, Send, Phone, UserRound, LockKeyhole, AlertTriangle } from 'lucide-react';
import { api, categories } from '@/lib/backend';
import { toast } from '@/components/ui/use-toast';

export default function SendFeedback() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ recipient_name: '', recipient_phone: '', category: 'Communication', message: '' });
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(null);
  const update = (k, v) => setForm((x) => ({ ...x, [k]: v }));

  async function review() {
    setBusy(true);
    try {
      const result = await api('preview_feedback', { category: form.category, message: form.message });
      setPreview(result);
    } catch (e) {
      toast({ title: 'AI review failed', description: e.message, variant: 'destructive' });
    } finally { setBusy(false); }
  }

  async function sendMessage() {
    setBusy(true);
    try {
      const result = await api('send_feedback', form);
      if (result.payment_required) {
        toast({ title: 'Credit required', description: 'Add a message credit from Wallet before sending.' });
        navigate('/wallet');
        return;
      }
      setSent(result);
    } catch (e) {
      toast({ title: 'Could not send', description: e.message, variant: 'destructive' });
    } finally { setBusy(false); }
  }

  if (sent) {
    return (
      <AppShell title="Submitted" description="Your identity remains hidden from the recipient.">
        <div className="mx-auto max-w-md ios-card rounded-[2.2rem] p-6 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-[1.55rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/18"><ShieldCheck className="h-8 w-8" /></span>
          <h2 className="mt-6 text-2xl font-bold tracking-[-.04em]">{sent.status === 'HUMAN_REVIEW' ? 'Sent for review' : 'Delivered privately'}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Sensitive content is never placed inside the SMS notification. The recipient opens a secure authenticated link.</p>
          <div className="mt-6 grid gap-2">
            <Button className="h-12 rounded-full" onClick={() => { setSent(null); setPreview(null); setForm({ recipient_name: '', recipient_phone: '', category: 'Communication', message: '' }); }}>Send another</Button>
            <Button variant="ghost" className="h-12 rounded-full" onClick={() => navigate('/')}>Back home</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Send feedback" description="A guided flow that turns sensitive feedback into respectful, deliverable text.">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-[1fr_.72fr]">
        <div className="ios-card rounded-[2.2rem] p-4 md:p-6">
          {!preview ? (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Recipient</Label><div className="relative"><UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="soft-field h-13 rounded-[1.15rem] pl-11" value={form.recipient_name} onChange={(e) => update('recipient_name', e.target.value)} placeholder="First name or nickname" /></div></div>
                <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Mobile</Label><div className="relative"><Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="soft-field h-13 rounded-[1.15rem] pl-11" value={form.recipient_phone} onChange={(e) => update('recipient_phone', e.target.value)} placeholder="(416) 555-0123" inputMode="tel" /></div></div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Situation</Label>
                <div className="flex snap-x gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
                  {categories.map((cat) => <button key={cat} onClick={() => update('category', cat)} className={form.category === cat ? 'shrink-0 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-950/10' : 'shrink-0 rounded-full bg-white/72 px-4 py-2 text-xs font-bold text-slate-500 ring-1 ring-slate-200 transition hover:text-slate-950'}>{cat}</button>)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-end justify-between gap-4"><Label className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Raw message</Label><span className="text-xs font-semibold text-slate-400">{form.message.length}/3000</span></div>
                <Textarea value={form.message} onChange={(e) => update('message', e.target.value.slice(0, 3000))} className="soft-field min-h-48 resize-none rounded-[1.35rem] p-4 text-[15px] leading-6" placeholder="Write it honestly. AI will remove insults, certainty, pressure, and unsafe content before delivery." />
              </div>

              <Button className="h-13 w-full rounded-[1.25rem] text-[15px]" disabled={busy || !form.recipient_name || !form.recipient_phone || form.message.trim().length < 3} onClick={review}>
                {busy ? <Loader2 className="animate-spin" /> : <Sparkles className="h-4 w-4" />} Review with AI
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-3"><Button variant="ghost" size="sm" className="rounded-full" onClick={() => setPreview(null)}><ArrowLeft className="h-4 w-4" /> Edit</Button><Badge variant="secondary" className="rounded-full px-3 py-1">{preview.risk_level} · {preview.decision}</Badge></div>
              <div className="mt-5 rounded-[1.8rem] bg-white p-5 ring-1 ring-slate-200">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Recipient sees this</p>
                <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-slate-800">{preview.refined_text}</p>
              </div>
              {preview.decision === 'REJECT' && <div className="mt-4 flex gap-3 rounded-[1.4rem] bg-red-50 p-4 text-sm leading-6 text-red-700"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />This message cannot be delivered under the safety policy.</div>}
              <Button className="mt-5 h-13 w-full rounded-[1.25rem]" onClick={sendMessage} disabled={busy || preview.decision === 'REJECT'}>{busy ? <Loader2 className="animate-spin" /> : <Send className="h-4 w-4" />} Send privately</Button>
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/15">
            <LockKeyhole className="h-6 w-6" />
            <h3 className="mt-4 text-xl font-bold tracking-[-.035em]">Private by design</h3>
            <p className="mt-2 text-sm leading-6 text-white/58">The recipient never sees your phone, email, nickname, account ID, or raw text.</p>
          </div>
          <div className="ios-card rounded-[2rem] p-5">
            <p className="text-sm font-bold">Delivery rules</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-500">
              <li>• recipient must be registered and opted in</li>
              <li>• max 2 messages to the same person in 30 days</li>
              <li>• serious allegations can go to human review</li>
              <li>• RED safety risk is rejected</li>
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}