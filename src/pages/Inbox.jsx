import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Inbox as InboxIcon, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/backend';

export default function Inbox() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  async function load() { setLoading(true); try { const result = await api('inbox'); setItems(result.items || []); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);

  return (
    <AppShell title="Inbox" description="Your received feedback appears as moderated text only." action={<Button variant="outline" size="sm" className="rounded-full bg-white/70" onClick={load}><RefreshCw className={loading ? 'animate-spin' : ''} />Refresh</Button>}>
      <div className="mx-auto max-w-3xl space-y-3">
        {!loading && !items.length ? (
          <div className="ios-card rounded-[2.1rem] p-9 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-[1.4rem] bg-white text-slate-500 shadow-sm"><InboxIcon className="h-7 w-7" /></span>
            <h2 className="mt-5 text-2xl font-bold tracking-[-.04em]">No feedback yet</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">When approved feedback is delivered to your verified phone, it will show up here.</p>
          </div>
        ) : items.map((item) => (
          <button key={item.id} onClick={() => navigate(`/feedback/${item.id}`)} className="group w-full rounded-[1.9rem] bg-white/74 p-4 text-left shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white active:scale-[.995]">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-[1.25rem] bg-slate-950 text-white"><ShieldCheck className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><span className="text-sm font-bold text-slate-950">{item.category}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">{item.status}</span></div>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{item.refined_text}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500" />
            </div>
          </button>
        ))}
      </div>
    </AppShell>
  );
}