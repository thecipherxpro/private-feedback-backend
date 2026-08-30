import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, Flag, Ban, Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/backend';
import { toast } from '@/components/ui/use-toast';

export default function FeedbackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    api('inbox').then((result) => setItem((result.items || []).find((x) => x.id === id) || null)).catch(() => {});
  }, [id]);

  async function act(action, payload = {}) {
    try {
      await api(action, { feedback_id: id, ...payload });
      toast({ title: action === 'reply' ? 'Reply submitted for review' : 'Done' });
      if (action === 'block_sender') navigate('/inbox');
      if (action === 'reply') setReply('');
    } catch (e) {
      toast({ title: 'Action failed', description: e.message, variant: 'destructive' });
    }
  }

  if (!item) return <AppShell title="Feedback"><div className="text-sm font-medium text-slate-500">Loading feedback…</div></AppShell>;

  return (
    <AppShell title="Feedback" description={item.category} compact action={<Button variant="ghost" className="rounded-full bg-white/70" onClick={() => navigate('/inbox')}><ArrowLeft className="h-4 w-4" />Back</Button>}>
      <div className="mx-auto max-w-2xl space-y-4">
        <article className="overflow-hidden rounded-[2.2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/18">
          <div className="p-5 md:p-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-white/50"><ShieldCheck className="h-4 w-4" />AI-moderated message</div>
            <p className="mt-6 whitespace-pre-wrap text-[17px] leading-8 tracking-[-.01em]">{item.refined_text}</p>
          </div>
          <div className="border-t border-white/10 bg-white/5 p-5 text-xs leading-5 text-white/52">This feedback represents the sender’s personal perspective and has not been independently verified by the platform.</div>
        </article>

        <section className="ios-card rounded-[2rem] p-5">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[1.1rem] bg-white shadow-sm"><MessageCircle className="h-5 w-5" /></span><div><p className="text-sm font-bold">Reply privately</p><p className="text-xs text-slate-500">Your reply is AI-moderated before it returns.</p></div></div>
          <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write your reply…" className="soft-field mt-4 min-h-28 resize-none rounded-[1.35rem] p-4" />
          <Button className="mt-4 h-12 w-full rounded-[1.2rem]" disabled={reply.trim().length < 3} onClick={() => act('reply', { message: reply })}><Send className="h-4 w-4" />Review & reply</Button>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-12 rounded-[1.2rem] bg-white/70" onClick={() => act('report', { reason: 'Recipient report' })}><Flag className="h-4 w-4" />Report</Button>
          <Button variant="outline" className="h-12 rounded-[1.2rem] bg-white/70" onClick={() => act('block_sender')}><Ban className="h-4 w-4" />Block</Button>
        </div>
      </div>
    </AppShell>
  );
}