"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "../types";
import { HuaraTier } from "../types";

const LOGO =
  "/logo.webp";

function makeReferral(name: string) {
  return "HUARA-" + name.toUpperCase().replace(/\s/g, "").slice(0, 5) + Math.floor(1000 + Math.random() * 9000);
}

interface Props {
  onLogin: (user: UserProfile) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email || !password || (mode === "register" && !name)) {
      setError("Por favor llena todos los campos.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const stored = typeof window !== "undefined" ? localStorage.getItem("huara_user") : null;
    if (mode === "login" && stored) {
      const u = JSON.parse(stored) as UserProfile;
      setLoading(false);
      onLogin(u);
      return;
    }

    const newUser: UserProfile = {
      name: mode === "register" ? name : (stored ? JSON.parse(stored).name : email.split("@")[0]),
      email,
      tier: HuaraTier.BRONCE,
      balance: mode === "register" ? 50 : 128.5,
      visitCount: 0,
      referralCode: makeReferral(mode === "register" ? name : email.split("@")[0]),
      favoriteIds: [],
      hasSeenOnboarding: true,
      notifOffers: true,
      notifOrders: true,
    };
    if (typeof window !== "undefined") localStorage.setItem("huara_user", JSON.stringify(newUser));
    setLoading(false);
    onLogin(newUser);
  };

  const socialLogin = async (provider: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const n = provider === "Google" ? "Ramiro" : "Usuario Apple";
    const u: UserProfile = {
      name: n,
      email: `${n.toLowerCase()}@${provider.toLowerCase()}.com`,
      tier: HuaraTier.BRONCE,
      balance: 128.5,
      visitCount: 3,
      referralCode: makeReferral(n),
      favoriteIds: [],
      hasSeenOnboarding: true,
      notifOffers: true,
      notifOrders: true,
    };
    if (typeof window !== "undefined") localStorage.setItem("huara_user", JSON.stringify(u));
    setLoading(false);
    onLogin(u);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#121212] z-40 overflow-y-auto">
      <div className="flex flex-col items-center pt-16 pb-8 px-6 max-w-sm mx-auto w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8 gap-3"
        >
          <div
            className="w-20 h-20 rounded-full overflow-hidden border-2 p-1 bg-white"
            style={{ borderColor: "#E31B23" }}
          >
            <img src={LOGO} alt="logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black" style={{ color: "#FFD700", fontFamily: "Montserrat, sans-serif" }}>
              Huara<span style={{ color: "#E31B23" }}>fans</span>
            </h1>
            <p className="text-white/50 text-xs">Alimentamos LO MEJOR de ti.</p>
          </div>
        </motion.div>

        {/* Mode tabs */}
        <div
          className="flex w-full rounded-xl p-1 mb-6"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: mode === m ? "#E31B23" : "transparent",
                color: mode === m ? "#fff" : "rgba(255,255,255,0.5)",
              }}
            >
              {m === "login" ? "Iniciar Sesión" : "Registrarse"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full flex flex-col gap-3"
        >
          {mode === "register" && (
            <input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 outline-none"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 outline-none"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 outline-none"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white mt-2 transition-transform active:scale-95 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #E31B23, #B01217)" }}
          >
            {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Crear Cuenta"}
          </button>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center w-full my-5 gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">o continúa con</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Social */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => socialLogin("Google")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white text-sm transition-transform active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0112 4.9c1.76 0 3.35.64 4.58 1.69l3.4-3.4A11.95 11.95 0 0012 0C7.38 0 3.38 2.7 1.37 6.67l3.9 3.09z"/>
              <path fill="#34A853" d="M16.04 18.01A7.12 7.12 0 0112 19.1a7.08 7.08 0 01-6.72-4.82l-3.9 3.07A11.95 11.95 0 0012 24c3.24 0 6.18-1.18 8.4-3.12l-4.36-2.87z"/>
              <path fill="#4A90D9" d="M20.4 20.88A11.87 11.87 0 0024 12c0-.74-.07-1.46-.2-2.15H12v4.56h6.86a5.86 5.86 0 01-2.52 3.8l4.06 2.67z"/>
              <path fill="#FBBC05" d="M5.28 14.28A7.08 7.08 0 014.9 12c0-.79.14-1.56.38-2.28L1.37 6.67A11.93 11.93 0 000 12c0 1.93.46 3.75 1.27 5.35l4.01-3.07z"/>
            </svg>
            Google
          </button>
          <button
            onClick={() => socialLogin("Apple")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white text-sm transition-transform active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M16.52 0c.07 1.65-.46 3.27-1.51 4.53-1.04 1.25-2.6 2.02-4.17 1.91-.1-1.6.5-3.22 1.54-4.44C13.41.77 15.02.03 16.52 0zM22 17.7c-.67 1.52-1 2.19-1.86 3.52-.86 1.37-2.13 3.08-3.69 3.09-1.37.01-1.74-.88-3.61-.87-1.87.01-2.28.88-3.67.87-1.55-.01-2.75-1.55-3.62-2.92C3.37 18.55 2.1 14.24 3.73 11.2c1.17-2.17 3.3-3.48 5.4-3.49 1.69 0 2.75.91 4.14.91 1.36 0 2.19-.91 4.14-.91 1.79.01 3.73 1.04 4.97 2.77-4.37 2.36-3.66 8.6.62 7.22z"/>
            </svg>
            Apple
          </button>
        </div>

        <p className="text-white/20 text-xs text-center mt-8">
          Al continuar aceptas nuestros términos y política de privacidad.
        </p>
      </div>
    </div>
  );
}
