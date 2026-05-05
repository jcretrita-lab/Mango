import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Mail, Lock, Eye, EyeOff, Sparkles, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { buildApiPath } from '../config/api';
import { useAuth } from '../context/AuthContext';
import type { DemoAccount } from '../types';

const PHASE1_DEMO_PASSWORD = 'DiwaPhase1!';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);
  const [demoLoadError, setDemoLoadError] = useState<string | null>(null);

  const requestedPath = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } } | null;
    return state?.from?.pathname;
  }, [location.state]);

  useEffect(() => {
    let isCancelled = false;

    fetch(buildApiPath('/auth/demo-accounts'))
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load seeded demo accounts.');
        }

        return (await response.json()) as DemoAccount[];
      })
      .then((accounts) => {
        if (!isCancelled) {
          setDemoAccounts(accounts);
          setDemoLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setDemoLoadError(error instanceof Error ? error.message : 'Unable to load seeded demo accounts.');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const user = await login(email, password);

    if (user) {
      navigate(
        requestedPath ?? (user.role === 'Employee' ? '/my-profile' : '/dashboard'),
        { replace: true },
      );
    } else {
      setErrorMessage('Use one of the seeded Phase 1 accounts shown below.');
    }

    setIsLoading(false);
  };

  const applyDemoAccount = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(PHASE1_DEMO_PASSWORD);
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-slate-900 p-12 text-white lg:flex">
        <div className="absolute right-0 top-0 z-0 h-full w-full bg-gradient-to-br from-indigo-600/20 to-slate-900" />
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-2xl">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight">
            Diwa HRIS <br />
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Phase 1 Seed Access
            </span>
            .
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-slate-400">
            This login is now bound to explicit seeded identities so you can validate the actual Phase 1 role experience instead of a local shell stub.
          </p>

          <div className="flex items-center gap-4 border-t border-white/10 pt-4">
            <div className="flex -space-x-3">
              {[Sparkles, ShieldCheck, UserCheck].map((Icon, index) => (
                <div key={index} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-700">
                  <Icon size={14} />
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-bold text-white">Seeded enterprise personas</span>
              <span className="text-xs text-slate-500">Superadmin, Approver, and Employee accounts now map to the dummy Phase 1 product.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-slate-50/30 p-8 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl space-y-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-10"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Sign in to the seeded Phase 1 product</h2>
            <p className="mt-2 font-medium text-slate-500">
              The credentials below come from the dummy enterprise setup so you can test each role path directly.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" size={18} />
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    placeholder="name@diwalearning.local"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Password</label>
                <div className="group relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    placeholder="DiwaPhase1!"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-all hover:bg-white hover:text-indigo-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Open Phase 1 Workspace'}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="space-y-4 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Seeded logins</p>
                <p className="mt-1 text-sm text-slate-500">Use any of these personas to validate the role-specific shell.</p>
              </div>
              {demoLoadError ? (
                <span className="text-xs font-semibold text-rose-600">{demoLoadError}</span>
              ) : null}
            </div>

            <div className="space-y-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => applyDemoAccount(account)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition-all hover:border-indigo-200 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-700">
                        {account.role}
                      </div>
                      <p className="text-sm font-bold text-slate-900">{account.displayName}</p>
                      <p className="text-sm text-slate-500">{account.description}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p className="font-semibold text-slate-700">{account.email}</p>
                      <p className="mt-1">Password: {PHASE1_DEMO_PASSWORD}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
