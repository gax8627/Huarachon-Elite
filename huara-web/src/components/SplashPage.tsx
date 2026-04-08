"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LOGO =
  "/logo.webp";

interface Props {
  onDone: () => void;
}

export default function SplashPage({ onDone }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 300);
          return 100;
        }
        return p + 2.5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#121212] z-50">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-72 h-72 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #E31B23 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div
          className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-2xl"
          style={{ borderColor: "#E31B23", boxShadow: "0 0 40px rgba(227,27,35,0.6)" }}
        >
          <img src={LOGO} alt="Huarachón" className="w-full h-full object-contain bg-white p-2" />
        </div>

        <div className="text-center">
          <h1
            className="text-3xl font-black tracking-wide"
            style={{ color: "#FFD700", fontFamily: "Montserrat, sans-serif" }}
          >
            Huara<span style={{ color: "#E31B23" }}>fans</span>
          </h1>
          <p className="text-white/60 text-sm mt-1">Alimentamos LO MEJOR de ti.</p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #E31B23, #FFD700)", width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
