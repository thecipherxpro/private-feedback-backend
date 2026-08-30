import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Clock, LockKeyhole } from 'lucide-react';
import { api } from '@/lib/backend';

export default function SecureFeedback() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('open_feedback', { token }).then(setData).catch((e) => setError(e.message)); }, [token]);

  return (
    <AppShell title="Secure link" description="Authenticated recipient access only." compact>
      <div className="mx-auto max-w-xl">
        {error ? (
          <div className="ios-card rounded-[2.1rem] p-8 text-center">
            <Clock className="mx-auto h-9 w-9 text-slate-400" />
            <h2 className="mt-5 text-2xl font-bold tracking-[-.04em]">Link unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
            <Button className="mt-6 h-12 rounded-full" onClick={() => navigate('/inbox')}>Open inbox</Button>
          </div>
        ) : !data ? (
          <div className="ios-card rounded-[2rem] p-6 text-center text-sm font-medium text-slate-500">Opening secure feedback…</div>
        ) : (
          <div className="overflow-hidden rounded-[2.2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/18">
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-white/52"><LockKeyhole className="h-4 w-4" />24-hour secure message</div>
              <h2 className="mt-6 text-2xl font-bold tracking-[-.04em]">{data.category}</h2>
              <p className="mt-4 whitespace-pre-wrap text-[16px] leading-8 text-white/86">{data.refined_text}</p>
              <div className="mt-6 rounded-[1.4rem] bg-white/8 p-4 text-xs leading-5 text-white/55">{data.disclaimer}</div>
              <Button className="mt-6 h-12 w-full rounded-[1.25rem] bg-white text-slate-950 hover:bg-white/90" onClick={() => navigate(`/feedback/${data.feedback_id}`)}><ShieldCheck className="h-4 w-4" />Reply or manage</Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}