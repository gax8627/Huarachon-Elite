"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO =
  "/logo.webp";

const STEPS = [
  {
    icon: "🌮",
    title: "Tradición y Sabor",
    body: "El Huarachón es la taquería favorita de Mexicali. Tacos, quesadillas y parrilladas con la mejor sazón del norte.",
  },
  {
    icon: "⭐",
    title: "Gana Huara-Puntos",
    body: "Cada compra suma puntos. Sube de Bronce a Plata a Oro y desbloquea descuentos exclusivos del 5% al 12%.",
  },
  {
    icon: "📍",
    title: "3 Sucursales en Mexicali",
    body: "Independencia, Gómez Morín y Lázaro Cárdenas. Encuentra la más cercana y haz tu pedido desde aquí.",
  },
];

interface Props {
  onDone: () => void;
}

export default function OnboardingPage({ onDone }: Props) {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onDone();
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#121212] z-40">
      {/* Logo */}
      <div className="flex justify-center pt-12 pb-4">
        <img src={LOGO} alt="logo" className="w-16 h-16 object-contain bg-white rounded-full p-1" />
      </div>

      {/* Slide */}
      <div className="flex-1 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
              style={{ background: "rgba(227,27,35,0.15)", border: "2px solid rgba(227,27,35,0.4)" }}
            >
              {STEPS[step].icon}
            </div>
            <h2
              className="text-2xl font-black"
              style={{ color: "#FFD700", fontFamily: "Montserrat, sans-serif" }}
            >
              {STEPS[step].title}
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-xs">{STEPS[step].body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 pb-4">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === step ? "20px" : "8px",
              background: i === step ? "#E31B23" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      {/* Button */}
      <div className="px-6 pb-12">
        <button
          onClick={next}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-transform active:scale-95"
          style={{ background: "linear-gradient(135deg, #E31B23, #B01217)" }}
        >
          {step < STEPS.length - 1 ? "Siguiente" : "¡Comenzar!"}
        </button>
      </div>
    </div>
  );
}
