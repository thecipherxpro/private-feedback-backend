import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Send, Inbox, Wallet, Settings, ShieldCheck, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/send', label: 'Send', icon: Send },
  { to: '/inbox', label: 'Inbox', icon: Inbox },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
];

export default function AppShell({ children, title, description, action, compact = false }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="ios-page min-h-screen pb-28 text-slate-950 md:pb-10">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-60 bg-gradient-to-b from-white/80 to-transparent" />
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/72 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/64">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 md:px-6">
          <button onClick={() => navigate('/')} className="group flex items-center gap-3 text-left">
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-[1.15rem] bg-slate-950 text-white shadow-lg shadow-slate-900/15">
              <ShieldCheck className="h-5 w-5" />
              <span className="absolute inset-x-1 top-1 h-1 rounded-full bg-white/25" />
            </span>
            <span>
              <span className="block text-[15px] font-semibold tracking-[-.02em]">Private Feedback</span>
              <span className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-500"><Sparkles className="h-3 w-3"/>AI-moderated delivery</span>
            </span>
          </button>
          <div className="hidden items-center gap-2 md:flex">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => cn('flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition', isActive ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/10' : 'text-slate-500 hover:bg-white hover:text-slate-950') }>
                <Icon className="h-4 w-4" />{label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} className="rounded-full bg-white/50" aria-label="Settings"><Settings /></Button>
            <Button variant="ghost" size="icon" onClick={() => logout()} className="rounded-full bg-white/50" aria-label="Log out"><LogOut /></Button>
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-5 md:px-6 md:py-8">
        {(title || description || action) && (
          <div className={cn('mb-5 flex items-start justify-between gap-4 md:mb-7', compact && 'mb-4')}>
            <div className="min-w-0">
              {title && <h1 className="screen-title text-[2.15rem] font-bold text-slate-950 md:text-5xl">{title}</h1>}
              {description && <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-500">{description}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(.7rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="glass-panel mx-auto grid max-w-md grid-cols-4 gap-1.5 rounded-[2rem] p-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => cn('flex min-h-[58px] flex-col items-center justify-center rounded-[1.45rem] text-[11px] font-semibold transition-all', isActive ? 'bg-slate-950 text-white shadow-xl shadow-slate-900/18' : 'text-slate-500 hover:bg-white/70 hover:text-slate-950') }>
              <Icon className="mb-1 h-4.5 w-4.5" />{label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}