import React, { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Wallet as WalletIcon, Check, Loader2, Sparkles, CreditCard } from 'lucide-react';
import { api } from '@/lib/backend';
import { toast } from '@/components/ui/use-toast';

function Plan({ title, price, helper, best, loading, onClick, children }) {
  return (
    <div className={best ? 'relative rounded-[2.1rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/18' : 'ios-card rounded-[2.1rem] p-5'}>
      {best && <span className="absolute right-5 top-5 rounded-full bg-white/12 px-3 py-1 text-[11px] font-bold text-white/70 ring-1 ring-white/12">Best value</span>}
      <p className={best ? 'text-sm font-bold text-white' : 'text-sm font-bold text-slate-950'}>{title}</p>
      <p className="mt-5 text-[2.5rem] font-bold tracking-[-.06em]">{price}</p>
      <p className={best ? 'mt-1 text-sm text-white/55' : 'mt-1 text-sm text-slate-500'}>{helper}</p>
      <div className={best ? 'mt-5 space-y-2 text-sm text-white/64' : 'mt-5 space-y-2 text-sm text-slate-500'}>{children}</div>
      <Button className={best ? 'mt-6 h-12 w-full rounded-[1.25rem] bg-white text-slate-950 hover:bg-white/90' : 'mt-6 h-12 w-full rounded-[1.25rem]'} onClick={onClick} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : <CreditCard className="h-4 w-4" />} Buy credits</Button>
    </div>
  );
}

export default function Wallet() {
  const [profile, setProfile] = useState(null);
  const [busy, setBusy] = useState('');
  const load = () => api('account').then((r) => setProfile(r.profile));
  useEffect(() => { load(); }, []);
  async function buy(product) {
    setBusy(product);
    try {
      const r = await api('create_checkout', { product_type: product, success_url: window.location.origin + '/wallet', cancel_url: window.location.origin + '/wallet' });
      if (r.checkout_url) window.location.href = r.checkout_url;
      else throw new Error('Checkout unavailable');
    } catch (e) {
      toast({ title: 'Checkout unavailable', description: e.message, variant: 'destructive' });
      setBusy('');
    }
  }
  const total = (profile?.free_credit_remaining || 0) + (profile?.purchased_credits || 0);
  return (
    <AppShell title="Wallet" description="Credits are consumed only after an eligible moderated message enters delivery.">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="relative overflow-hidden rounded-[2.3rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/18">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="relative flex items-end justify-between gap-5">
            <div><p className="text-sm font-semibold text-white/52">Available messages</p><p className="mt-2 text-[4rem] font-bold leading-none tracking-[-.075em]">{profile ? total : '—'}</p><p className="mt-3 text-sm text-white/55">Free credit + purchased balance</p></div>
            <span className="grid h-16 w-16 place-items-center rounded-[1.6rem] bg-white/10 ring-1 ring-white/10"><WalletIcon className="h-8 w-8" /></span>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Plan title="Single message" price="$1.00" helper="CAD + applicable tax" loading={busy === 'SINGLE_MESSAGE'} onClick={() => buy('SINGLE_MESSAGE')}><p className="flex gap-2"><Check className="h-4 w-4" />1 moderated delivery credit</p><p className="flex gap-2"><Check className="h-4 w-4" />Good for one careful message</p></Plan>
          <Plan best title="20-message pack" price="$5.99" helper="CAD + applicable tax" loading={busy === 'PACK_20'} onClick={() => buy('PACK_20')}><p className="flex gap-2"><Sparkles className="h-4 w-4" />About $0.30/message before tax</p><p className="flex gap-2"><Check className="h-4 w-4" />Best for ongoing feedback use</p></Plan>
        </div>
      </div>
    </AppShell>
  );
}