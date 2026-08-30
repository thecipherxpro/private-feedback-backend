import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquareText, ShieldCheck, Sparkles, Wallet, Inbox, Smartphone, LockKeyhole, CheckCircle2, ChevronRight } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/backend';

function Metric({ icon: Icon, label, value, helper }) {
  return (
    <div className="ios-card rounded-[1.8rem] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[.12em] text-slate-400">{label}</p>
          <p className="mt-3 text-[2rem] font-bold tracking-[-.05em] text-slate-950">{value}</p>
          <p className="mt-1 text-[13px] leading-5 text-slate-500">{helper}</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[1.15rem] bg-slate-950 text-white shadow-lg shadow-slate-950/15"><Icon className="h-5 w-5" /></span>
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, subtitle, onClick, dark }) {
  return (
    <button onClick={onClick} className={dark ? 'group rounded-[2rem] bg-slate-950 p-5 text-left text-white shadow-2xl shadow-slate-950/18 transition active:scale-[.99]' : 'group ios-card rounded-[2rem] p-5 text-left transition active:scale-[.99]'}>
      <div className="flex items-center justify-between gap-4">
        <span className={dark ? 'grid h-12 w-12 place-items-center rounded-[1.25rem] bg-white/12 text-white' : 'grid h-12 w-12 place-items-center rounded-[1.25rem] bg-white text-slate-950 shadow-sm'}><Icon className="h-5 w-5" /></span>
        <ChevronRight className={dark ? 'h-5 w-5 text-white/55 transition group-hover:translate-x-1' : 'h-5 w-5 text-slate-400 transition group-hover:translate-x-1'} />
      </div>
      <p className="mt-5 text-lg font-bold tracking-[-.025em]">{title}</p>
      <p className={dark ? 'mt-1 text-sm leading-6 text-white/58' : 'mt-1 text-sm leading-6 text-slate-500'}>{subtitle}</p>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  useEffect(() => { api('account').then(setAccount).catch(() => {}); }, []);
  const profile = account?.profile;
  const totalCredits = profile ? (profile.free_credit_remaining || 0) + (profile.purchased_credits || 0) : '—';

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-[2.35rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/20 md:p-8">
        <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-blue-500/28 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-52 w-52 rounded-full bg-emerald-400/16 blur-3xl" />
        <div className="relative grid gap-7 md:grid-cols-[1.2fr_.8fr] md:items-end">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/74 ring-1 ring-white/10">
              <Sparkles className="h-3.5 w-3.5" /> Private, but never unmoderated
            </div>
            <h1 className="screen-title max-w-2xl text-[3.05rem] font-bold md:text-6xl">Say the hard thing safely.</h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/63 md:text-base">A mobile-first feedback wallet where AI turns difficult messages into respectful, non-accusatory private feedback before SMS delivery.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => navigate('/send')} className="h-12 rounded-full bg-white px-6 text-slate-950 hover:bg-white/90">Send feedback <ArrowRight className="h-4 w-4" /></Button>
              <Button onClick={() => navigate('/inbox')} variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white">Open inbox</Button>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white/10 p-4 ring-1 ring-white/12 backdrop-blur">
            <div className="rounded-[1.6rem] bg-white p-4 text-slate-950 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white"><ShieldCheck className="h-5 w-5" /></div>
                <div><p className="text-sm font-bold">Delivery protected</p><p className="text-xs text-slate-500">Raw content never appears in SMS.</p></div>
              </div>
              <div className="mt-4 rounded-[1.2rem] bg-slate-100 p-4 text-sm leading-6 text-slate-600">“This feedback represents a personal observation and has not been independently verified.”</div>
            </div>
          </div>
        </div>
      </section>

      {!profile && (
        <div className="mt-4 ios-card rounded-[1.8rem] p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-[1.1rem] bg-amber-100 text-amber-700"><Smartphone className="h-5 w-5" /></span><div><p className="text-sm font-bold">Finish mobile verification</p><p className="text-xs leading-5 text-slate-500">Required before sending or receiving feedback.</p></div></div>
            <Button size="sm" className="rounded-full" onClick={() => navigate('/onboarding')}>Continue</Button>
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Metric icon={Wallet} label="Credits" value={totalCredits} helper="Free + purchased message balance" />
        <Metric icon={Smartphone} label="SMS" value={profile?.sms_consent_status === 'ACTIVE' ? 'On' : 'Off'} helper="Neutral notifications only" />
        <Metric icon={LockKeyhole} label="Identity" value="Blind" helper="Sender identity hidden from recipient" />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ActionCard dark icon={MessageSquareText} title="Create a private message" subtitle="Write naturally, preview the AI rewrite, then deliver securely." onClick={() => navigate('/send')} />
        <ActionCard icon={Inbox} title="Review received feedback" subtitle="Read moderated feedback, reply privately, report, or block sender." onClick={() => navigate('/inbox')} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {['Verified sender', 'AI safety review', '24-hour secure link'].map((text) => (
          <div key={text} className="flex items-center gap-3 rounded-[1.5rem] bg-white/60 p-4 text-sm font-semibold text-slate-700 ring-1 ring-white/70 backdrop-blur">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" /> {text}
          </div>
        ))}
      </div>
    </AppShell>
  );
}