import React, { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { Switch } from '@/components/ui/switch';
import { api } from '@/lib/backend';
import { toast } from '@/components/ui/use-toast';
import { Smartphone, ShieldCheck, Bell, LockKeyhole } from 'lucide-react';

function Row({ icon: Icon, title, text, right }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[1.7rem] bg-white/70 p-4 ring-1 ring-white/80 backdrop-blur">
      <div className="flex min-w-0 gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-[1.15rem] bg-slate-950 text-white"><Icon className="h-5 w-5" /></span><div><p className="text-sm font-bold text-slate-950">{title}</p><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></div>
      {right}
    </div>
  );
}

export default function Settings() {
  const [profile, setProfile] = useState(null);
  useEffect(() => { api('account').then((r) => setProfile(r.profile)).catch(() => {}); }, []);
  async function toggle(enabled) {
    try {
      const result = await api('update_sms_consent', { enabled });
      setProfile((x) => ({ ...x, sms_consent_status: result.status }));
      toast({ title: enabled ? 'SMS notifications enabled' : 'SMS notifications stopped' });
    } catch (e) { toast({ title: 'Could not update', description: e.message, variant: 'destructive' }); }
  }
  return (
    <AppShell title="Settings" description="Control messaging consent and privacy preferences.">
      <div className="mx-auto max-w-2xl space-y-3">
        <Row icon={Bell} title="Private feedback SMS" text="Receive neutral notification texts. Message contents remain behind secure authenticated access." right={<Switch checked={profile?.sms_consent_status === 'ACTIVE'} onCheckedChange={toggle} />} />
        <Row icon={Smartphone} title="Notification number" text="Messages are sent through +1 647-577-6111. Reply STOP to opt out or START to resume." />
        <Row icon={LockKeyhole} title="Recipient privacy" text="SMS never includes sensitive allegation content, sender identity, or raw unmoderated text." />
        <Row icon={ShieldCheck} title="Sender accountability" text="Identity remains hidden from the recipient but retained internally for safety, rate limits, reports, and abuse prevention." />
      </div>
    </AppShell>
  );
}