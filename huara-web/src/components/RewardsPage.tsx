"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile, RewardItem } from "../types";
import { HuaraTier } from "../types";

const REWARDS: RewardItem[] = [
  { id: "r1", name: "Taco de Asada", pointsCost: 500, image: "https://tb-static.uber.com/prod/image-proc/processed_images/1ac8ab6d9247958e9397cd363ddbb4b5/bc9c318a9c96996e2d990faf2b0c65f6.jpeg", category: "Tacos" },
  { id: "r2", name: "Horchata Huarachón", pointsCost: 400, image: "https://tb-static.uber.com/prod/image-proc/processed_images/09718992aabf46ad1a2b08c2b6659ac9/bc9c318a9c96996e2d990faf2b0c65f6.jpeg", category: "Bebidas" },
  { id: "r3", name: "Taco Huarachón", pointsCost: 1000, image: "https://tb-static.uber.com/prod/image-proc/processed_images/4f9785b356ab7307f08fb08e199e5d9f/c67fc65e9b4e16a553eb7574fba090f1.jpeg", category: "Especialidades" },
  { id: "r4", name: "Súper Taco Huarachón", pointsCost: 1600, image: "https://tb-static.uber.com/prod/image-proc/processed_images/4f9785b356ab7307f08fb08e199e5d9f/c67fc65e9b4e16a553eb7574fba090f1.jpeg", category: "Especialidades" },
  { id: "r5", name: "Parrillada Individual", pointsCost: 1800, image: "", category: "Parrilladas" },
  { id: "r6", name: "Sodas", pointsCost: 300, image: "", category: "Bebidas" },
];

const TIER_COLORS: Record<HuaraTier, string> = {
  [HuaraTier.BRONCE]: "#CD7F32",
  [HuaraTier.PLATA]: "#C0C0C0",
  [HuaraTier.ORO]: "#FFD700",
};

const TIER_NEXT_VISITS: Record<HuaraTier, number> = {
  [HuaraTier.BRONCE]: 10,
  [HuaraTier.PLATA]: 25,
  [HuaraTier.ORO]: 25,
};

interface Props {
  user: UserProfile;
  onRedeem: (item: RewardItem) => void;
}

export default function RewardsPage({ user, onRedeem }: Props) {
  const [selected, setSelected] = useState<RewardItem | null>(null);
  const [toast, setToast] = useState("");

  const tierColor = TIER_COLORS[user.tier];
  const tierNext = TIER_NEXT_VISITS[user.tier];
  const tierProgress = user.tier === HuaraTier.ORO ? 100 : Math.min((user.visitCount / tierNext) * 100, 100);

  const handleRedeem = () => {
    if (!selected) return;
    if (user.balance < selected.pointsCost) return;
    onRedeem(selected);
    setToast(`¡Canjeaste ${selected.name}!`);
    setSelected(null);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="flex flex-col px-4 pt-4 pb-24 gap-4">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 px-5 py-3 rounded-2xl font-semibold text-sm text-black"
            style={{ background: "#FFD700", boxShadow: "0 4px 20px rgba(255,215,0,0.4)" }}
          >
            🎉 {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-white font-black text-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
        Recompensas
      </h1>

      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0a0b, #2a0c0e)",
          border: `1px solid ${tierColor}40`,
          boxShadow: `0 4px 30px ${tierColor}15`,
        }}
      >
        <div
          className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-20"
          style={{ background: tierColor, transform: "translate(30%,-30%)" }}
        />
        <div className="flex items-center gap-4 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `${tierColor}20`, border: `1px solid ${tierColor}40` }}
          >
            ⭐
          </div>
          <div className="flex-1">
            <p className="text-white/60 text-xs">Balance</p>
            <p className="text-3xl font-black" style={{ color: tierColor }}>{user.balance.toFixed(0)}</p>
            <p className="text-white/40 text-xs">Huara-Puntos</p>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase"
            style={{ background: `${tierColor}20`, color: tierColor, border: `1px solid ${tierColor}40` }}
          >
            {user.tier}
          </div>
        </div>

        {/* Tier progress */}
        {user.tier !== HuaraTier.ORO ? (
          <div className="mt-4 relative z-10">
            <div className="flex justify-between text-xs text-white/40 mb-1.5">
              <span>{user.visitCount} visitas</span>
              <span>Faltan {tierNext - user.visitCount} para {user.tier === HuaraTier.BRONCE ? "Plata" : "Oro"}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-white/10">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${tierProgress}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ background: `linear-gradient(90deg, ${tierColor}, ${tierColor}99)` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-xs mt-3 relative z-10" style={{ color: "#FFD700" }}>
            ✨ Nivel máximo — 12% de descuento en todo
          </p>
        )}
      </motion.div>

      {/* Rewards grid */}
      <div className="flex flex-col gap-4">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Canjear por puntos</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {REWARDS.map((item, i) => {
            const canAfford = user.balance >= item.pointsCost;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => canAfford && setSelected(item)}
                className="group rounded-2xl overflow-hidden text-left transition-all active:scale-95 hover:bg-white/10"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${canAfford ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.06)"}`,
                  opacity: canAfford ? 1 : 0.45,
                }}
              >
                {item.image ? (
                  <div className="h-32 md:h-40 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {!canAfford && <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-full text-white/40">FALTAN PUNTOS</span>
                    </div>}
                  </div>
                ) : (
                  <div
                    className="h-32 md:h-40 flex items-center justify-center text-4xl"
                    style={{ background: "rgba(255,215,0,0.06)" }}
                  >
                    🌮
                  </div>
                )}
                <div className="p-4">
                  <p className="text-white text-sm font-bold line-clamp-1 group-hover:text-[#FFD700] transition-colors">{item.name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm" style={{ color: "#FFD700" }}>⭐</span>
                      <span className="text-sm font-black" style={{ color: "#FFD700" }}>{item.pointsCost}</span>
                    </div>
                    <span className="text-xs font-black transition-transform group-hover:translate-x-1" style={{ color: canAfford ? "#FFD700" : "rgba(255,255,255,0.3)" }}>CANJEAR ›</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Birthday card */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.2)" }}
      >
        <span className="text-2xl">🎂</span>
        <div>
          <p className="text-white font-semibold text-sm">Regalo de Cumpleaños</p>
          <p className="text-white/50 text-xs">Configura tu fecha y recibe un taco gratis el día de tu cumple.</p>
        </div>
      </div>

      {/* Redeem modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8 }}
              className="rounded-3xl p-6 flex flex-col items-center gap-4 max-w-xs w-full"
              style={{ background: "#1a1a1a", border: "1px solid rgba(255,215,0,0.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {selected.image ? (
                <img src={selected.image} alt={selected.name} className="w-full h-36 object-cover rounded-2xl" />
              ) : (
                <div className="w-full h-36 rounded-2xl flex items-center justify-center text-5xl"
                  style={{ background: "rgba(255,215,0,0.1)" }}>🌮</div>
              )}
              <div className="text-center">
                <p className="text-white font-bold text-lg">{selected.name}</p>
                <p className="text-white/50 text-sm mt-1">¿Canjear por <span style={{ color: "#FFD700" }}>{selected.pointsCost} pts</span>?</p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-3 rounded-xl text-white/60 text-sm"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRedeem}
                  className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
                  style={{ background: "#FFD700" }}
                >
                  Canjear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
