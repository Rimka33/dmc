import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  LogIn,
  Lock,
  User,
  ShieldCheck,
  ArrowLeft,
  XCircle,
  CheckCircle2
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.login.submit'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <div className="min-h-screen font-['Bai_Jamjuree'] bg-[#f8fafc] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <Head title="Connexion Administration" />

      {/* Background Decorations - Sync with Client Auth */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-forest-green/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 flex flex-col md:flex-row bg-white rounded-[40px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] overflow-hidden min-h-[600px]">
        {/* Left Panel - Brand Identity */}
        <div className="hidden md:flex md:w-5/12 bg-[#011a0a] p-12 flex-col justify-center text-center text-white relative">
          {/* Grainy/Pattern Overlay via CSS instead of missing PNG */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="inline-block mb-10 group">
              <img 
                src="/images/logo.png" 
                alt="DMC Admin" 
                className="h-28 w-auto mx-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                Espace <span className="text-neon-green">Admin</span>
              </h2>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.3em]">
                DMC SARL - Management
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="mb-10">
              <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">
                Authentification
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1.5 bg-forest-green rounded-full shadow-[0_0_10px_rgba(5,128,49,0.3)]" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Sécurisé par DMC</span>
              </div>
            </div>

            {/* Status & Errors */}
            <AnimatePresence>
              {status && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-emerald-50 border-l-4 border-forest-green rounded-xl text-forest-green text-xs font-bold"
                >
                  {status}
                </motion.div>
              )}

              {Object.keys(errors).length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-3"
                >
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    {Object.keys(errors).map((key) => (
                      <p key={key} className="text-red-700 text-[11px] font-bold leading-tight">
                        {errors[key]}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={submit} className="space-y-6">
              {/* Email/Username Field */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1 transition-colors group-focus-within:text-forest-green">
                  Email ou Utilisateur
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-forest-green transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    autoComplete="username"
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full pl-14 pr-6 py-4.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-forest-green focus:bg-white focus:outline-none transition-all text-sm font-bold placeholder:text-gray-300 placeholder:font-medium"
                    placeholder="admin@dmc.sn"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 group">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-forest-green">
                    Mot de passe
                  </label>
                  {canResetPassword && (
                    <Link
                      href={route('admin.password.request')}
                      className="text-forest-green text-[10px] hover:underline font-black uppercase italic"
                    >
                      Perdu ?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-forest-green transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={data.password}
                    autoComplete="current-password"
                    onChange={(e) => setData('password', e.target.value)}
                    className="w-full pl-14 pr-14 py-4.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-forest-green focus:bg-white focus:outline-none transition-all text-sm font-bold placeholder:text-gray-300 transition-all shadow-sm"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-forest-green transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="py-2">
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                  />
                  <div
                    className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${data.remember ? 'bg-forest-green border-forest-green shadow-[0_0_10px_rgba(5,128,49,0.3)]' : 'border-gray-200 bg-white group-hover:border-gray-300'}`}
                  >
                    {data.remember && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span className="text-[10px] font-black text-gray-500 group-hover:text-gray-900 uppercase tracking-tight transition-colors">
                    Rester connecté
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-5 bg-[#058031] text-white font-black text-xs uppercase tracking-[0.25em] rounded-2xl hover:bg-[#011a0a] transition-all shadow-[0_10px_30px_-10px_rgba(5,128,49,0.5)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                <span className="relative z-10 flex items-center gap-3">
                  {processing ? 'Chargement...' : 'Ouvrir Session'}
                  {!processing && (
                    <LogIn
                      size={18}
                      className="group-hover:translate-x-2 transition-transform duration-300"
                    />
                  )}
                </span>
              </button>
            </form>

            <div className="text-center mt-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-forest-green transition-colors"
              >
                <ArrowLeft size={14} /> Retour au Site Public
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
