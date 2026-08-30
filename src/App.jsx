import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Home from '@/pages/Home';
import SendFeedback from '@/pages/SendFeedback';
import Inbox from '@/pages/Inbox';
import FeedbackDetail from '@/pages/FeedbackDetail';
import SecureFeedback from '@/pages/SecureFeedback';
import Wallet from '@/pages/Wallet';
import Settings from '@/pages/Settings';
import Onboarding from '@/pages/Onboarding';

const publicPaths = ['/login','/register','/forgot-password','/reset-password'];

function AppRoutes(){
  const location = useLocation();
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, navigateToLogin } = useAuth();
  const isPublic = publicPaths.some(p => location.pathname.startsWith(p));
  if (isPublic) return <Routes><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/><Route path="/reset-password" element={<ResetPassword/>}/><Route path="*" element={<Navigate to="/login" replace/>}/></Routes>;
  if (isLoadingPublicSettings || isLoadingAuth) return <div className="fixed inset-0 grid place-items-center bg-[#f6f7f9]"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"/></div>;
  if (authError?.type === 'user_not_registered') return <UserNotRegisteredError/>;
  if (!isAuthenticated || authError?.type === 'auth_required') { navigateToLogin(); return null; }
  return <Routes><Route path="/" element={<Home/>}/><Route path="/send" element={<SendFeedback/>}/><Route path="/inbox" element={<Inbox/>}/><Route path="/feedback/:id" element={<FeedbackDetail/>}/><Route path="/f/:token" element={<SecureFeedback/>}/><Route path="/wallet" element={<Wallet/>}/><Route path="/settings" element={<Settings/>}/><Route path="/onboarding" element={<Onboarding/>}/><Route path="*" element={<PageNotFound/>}/></Routes>;
}

export default function App(){return <AuthProvider><QueryClientProvider client={queryClientInstance}><Router><ScrollToTop/><AppRoutes/></Router><Toaster/></QueryClientProvider></AuthProvider>}