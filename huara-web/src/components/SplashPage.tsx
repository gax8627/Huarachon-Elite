"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onDone: () => void;
}

export default function SplashPage({ onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"logo" | "text" | "bar">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 1200); // Slower
    const t2 = setTimeout(() => setPhase("bar"), 2200);  // Slower
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setTimeout(onDone, 800); return 100; }
        return p + 1.1; // Slower (half speed)
      });
    }, 100); // Slightly more frequent but smaller increments
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(interval); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "#0d0d0d",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(227,27,35,0.22) 0%, transparent 65%)",
        filter: "blur(30px)", pointerEvents: "none",
      }} />

      {/* Concentric rings */}
      {[260, 380, 500].map((size, i) => (
        <motion.div key={size}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: i * 0.12 }}
          style={{
            position: "absolute", width: size, height: size, borderRadius: "50%",
            border: `1px solid rgba(227,27,35,${0.14 - i * 0.04})`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Gold bottom glow */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 160,
        background: "linear-gradient(to top, rgba(255,215,0,0.07), transparent)",
        pointerEvents: "none",
      }} />

      {/* Content stack — centered */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ position: "relative" }}
        >
          {/* Spinning gold ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute", inset: -7, borderRadius: "50%",
              background: "conic-gradient(from 0deg, transparent 55%, #FFD700 75%, transparent 100%)",
            }}
          />
          <div style={{
            position: "relative", width: 148, height: 148, borderRadius: "50%",
            overflow: "hidden", background: "#fff",
            border: "3px solid rgba(227,27,35,0.85)",
            boxShadow: "0 0 50px rgba(227,27,35,0.45), 0 0 100px rgba(227,27,35,0.15)",
          }}>
            <img src="/logo.webp" alt="El Huarachón"
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
          </div>
        </motion.div>

        {/* Wordmark */}
        <AnimatePresence>
          {phase !== "logo" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
            >
              <div>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 42, fontWeight: 900, color: "#FFD700", letterSpacing: -1 }}>Huara</span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 42, fontWeight: 900, color: "#E31B23", letterSpacing: -1 }}>fans</span>
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: 0 }}>
                Alimentamos LO MEJOR de ti.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress */}
        <AnimatePresence>
          {phase === "bar" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{ marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
            >
              <div style={{ width: 180, height: 2, borderRadius: 99, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <motion.div
                  style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #E31B23, #FFD700)", width: `${progress}%` }}
                  transition={{ duration: 0.08 }}
                />
              </div>
              <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", margin: 0 }}>
                {progress < 100 ? "Cargando..." : "¡Listo!"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
