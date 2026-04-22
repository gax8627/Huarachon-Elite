"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "../types";
import { supabase } from "../lib/supabase";

const LOGO = "/logo.webp";

interface Props {
  onLogin: (user: UserProfile) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Magic Link — passwordless, zero-cost
  const sendMagicLink = async () => {
    if (!email) { setError("Por favor ingresa tu correo."); return; }
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (err) { setError("Error al enviar el enlace. Intenta de nuevo."); return; }
    setSent(true);
  };

  // Google OAuth via Supabase
  const loginWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return <div className="fixed inset-0 flex flex-col md:flex-row bg-[#0A0A0A] z-40 overflow-y-auto">
      {/* 🌮 Left Panel: Cinematic Branding (Desktop Only) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=1200&q=80" 
            alt="tacos" 
            className="w-full h-full object-cover opacity-40 scale-110 hover:scale-100 transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#E31B23]/20 via-transparent to-black" />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white p-1.5 shadow-xl">
             <img src={LOGO} alt="logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter">EL HUARACHÓN</h2>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-6xl font-black text-white mb-6 leading-tight">
            Dale gusto <br/> al <span className="text-[#FFD700]">paladar.</span>
          </h1>
          <p className="text-xl text-white/60 font-medium">
            Únete a la comunidad de Huarafans y empieza a acumular puntos en cada mordida.
          </p>
        </div>

        <div className="relative z-10 text-white/30 text-sm">
          © 2026 Taquerías El Huarachón. Todos los derechos reservados.
        </div>
      </div>

      {/* 🔐 Right Panel: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#121212]">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Logo (hidden on md) */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden flex flex-col items-center mb-10 gap-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 p-1 bg-white" style={{ borderColor: "#E31B23" }}>
              <img src={LOGO} alt="logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black" style={{ color: "#FFD700", fontFamily: "Montserrat, sans-serif" }}>
                Huara<span style={{ color: "#E31B23" }}>fans</span>
              </h1>
              <p className="text-white/50 text-xs">Alimentamos LO MEJOR de ti.</p>
            </div>
          </motion.div>

          {/* Desktop Greeting (shown only on md) */}
          <div className="hidden md:block mb-10">
            <h3 className="text-3xl font-black text-white mb-2">Bienvenido de nuevo</h3>
            <p className="text-white/50">Ingresa a tu cuenta para ver tus Huara-Puntos.</p>
          </div>

          {sent ? (
            /* ── Sent State ── */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="text-6xl mb-4">📬</div>
              <h2 className="text-xl font-bold text-white mb-2">¡Revisa tu correo!</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Te enviamos un enlace mágico a{" "}
                <strong className="text-white">{email}</strong>.{" "}
                Toca el enlace para entrar automáticamente.
              </p>
              <button onClick={() => setSent(false)} className="mt-6 text-xs text-white/30 underline">
                Usar otro correo
              </button>
            </motion.div>
          ) : (
            /* ── Login Form ── */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col gap-3">
              {/* Google */}
              <button
                onClick={loginWithGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-white text-sm transition-all active:scale-95 hover:bg-white/10 disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0112 4.9c1.76 0 3.35.64 4.58 1.69l3.4-3.4A11.95 11.95 0 0012 0C7.38 0 3.38 2.7 1.37 6.67l3.9 3.09z"/>
                  <path fill="#34A853" d="M16.04 18.01A7.12 7.12 0 0112 19.1a7.08 7.08 0 01-6.72-4.82l-3.9 3.07A11.95 11.95 0 0012 24c3.24 0 6.18-1.18 8.4-3.12l-4.36-2.87z"/>
                  <path fill="#4A90D9" d="M20.4 20.88A11.87 11.87 0 0024 12c0-.74-.07-1.46-.2-2.15H12v4.56h6.86a5.86 5.86 0 01-2.52 3.8l4.06 2.67z"/>
                  <path fill="#FBBC05" d="M5.28 14.28A7.08 7.08 0 014.9 12c0-.79.14-1.56.38-2.28L1.37 6.67A11.93 11.93 0 000 12c0 1.93.46 3.75 1.27 5.35l4.01-3.07z"/>
                </svg>
                Continuar con Google
              </button>

              {/* Divider */}
              <div className="flex items-center w-full my-2 gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs uppercase tracking-widest font-bold">o</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Magic Link Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-[10px] uppercase font-black ml-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMagicLink()}
                  className="w-full px-4 py-4 rounded-xl text-white placeholder-white/20 outline-none focus:border-[#E31B23]/50 transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
              
              {error && <p className="text-red-400 text-xs text-center font-medium">{error}</p>}
              
              <button
                onClick={sendMagicLink}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-white mt-2 transition-all active:scale-95 shadow-lg shadow-[#E31B23]/10"
                style={{ background: "linear-gradient(135deg, #E31B23, #B01217)" }}
              >
                {loading ? "Enviando..." : "ENVIAR ENLACE MÁGICO"}
              </button>
            </motion.div>
          )}

          <p className="text-white/20 text-[10px] text-center mt-12 leading-relaxed">
            Al continuar aceptas nuestros <span className="text-white/40 underline">términos de servicio</span> y <span className="text-white/40 underline">política de privacidad</span>.
          </p>
        </div>
      </div>
    </div>;
}
