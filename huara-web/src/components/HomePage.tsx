"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile, Order, Deal, AppView } from "../types";
import { HuaraTier, OrderStatus, PickupMethod } from "../types";

const LOGO =
  "/logo.webp";

const FOOD_PHOTOS = [
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80", // tacos
  "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80", // quesadilla
  "https://images.unsplash.com/photo-1611250188496-e966043a0629?w=600&q=80", // mexican food
];

const DEALS: Deal[] = [
  {
    id: "d1",
    title: "2x1 Huaraches",
    description: "Martes 4–8 PM",
    discountType: "freebie",
    value: 1,
    image: FOOD_PHOTOS[0],
    expiresAt: "2026-04-30T23:59:59Z",
    badge: "HOY",
  },
  {
    id: "d2",
    title: "15% en Combos",
    description: "2 tacos + 2 bebidas",
    discountType: "percentage",
    value: 15,
    image: FOOD_PHOTOS[1],
    expiresAt: "2026-04-15T23:59:59Z",
    badge: "NUEVO",
  },
  {
    id: "d3",
    title: "Agua Gratis",
    description: "En pedidos +$150",
    discountType: "freebie",
    value: 1,
    image: FOOD_PHOTOS[2],
    expiresAt: "2026-05-01T23:59:59Z",
  },
];

const TIER_COLORS: Record<HuaraTier, string> = {
  [HuaraTier.BRONCE]: "#CD7F32",
  [HuaraTier.PLATA]: "#C0C0C0",
  [HuaraTier.ORO]: "#FFD700",
};

const TIER_NEXT: Record<HuaraTier, number> = {
  [HuaraTier.BRONCE]: 10,
  [HuaraTier.PLATA]: 25,
  [HuaraTier.ORO]: 25,
};

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Recibido",
  [OrderStatus.PREPARING]: "Preparando",
  [OrderStatus.READY]: "¡Listo!",
  [OrderStatus.COMPLETED]: "Completado",
};

const ORDER_STATUS_PROGRESS: Record<OrderStatus, number> = {
  [OrderStatus.PENDING]: 20,
  [OrderStatus.PREPARING]: 60,
  [OrderStatus.READY]: 100,
  [OrderStatus.COMPLETED]: 100,
};

interface Props {
  user: UserProfile;
  activeOrder: Order | null;
  recentOrders: Order[];
  onNavigate: (view: AppView) => void;
  onMarkOrderComplete: (orderId: string) => void;
  onShareForPoints: () => void;
  onLogout: () => void;
}

export default function HomePage({
  user,
  activeOrder,
  recentOrders,
  onNavigate,
  onMarkOrderComplete,
  onShareForPoints,
  onLogout,
}: Props) {
  const [showQr, setShowQr] = useState(false);
  const tierColor = TIER_COLORS[user.tier];
  const tierNext = TIER_NEXT[user.tier];
  const tierProgress = user.tier === HuaraTier.ORO ? 100 : Math.min((user.visitCount / tierNext) * 100, 100);

  const canShare = () => {
    const today = new Date().toDateString();
    return user.lastShareDate !== today;
  };

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={LOGO} alt="logo" className="w-10 h-10 rounded-full bg-white object-contain p-1" />
          <div>
            <p className="text-white/60 text-xs">¡Hola,</p>
            <p className="text-white font-bold text-sm leading-tight">{user.name}! 👋</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-white/40 text-xs px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          Salir
        </button>
      </div>

      {/* Active Order */}
      <AnimatePresence>
        {activeOrder && activeOrder.status !== OrderStatus.COMPLETED && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl p-4"
            style={{
              background: "linear-gradient(135deg, rgba(227,27,35,0.2), rgba(255,215,0,0.1))",
              border: "1px solid rgba(227,27,35,0.4)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: activeOrder.status === OrderStatus.READY ? "#22c55e" : "#E31B23",
                    boxShadow: `0 0 8px ${activeOrder.status === OrderStatus.READY ? "#22c55e" : "#E31B23"}`,
                    animation: "pulse 1.5s infinite",
                  }}
                />
                <span className="text-white font-semibold text-sm">
                  Pedido #{activeOrder.id.slice(-4)}
                </span>
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: activeOrder.status === OrderStatus.READY ? "rgba(34,197,94,0.2)" : "rgba(227,27,35,0.2)",
                  color: activeOrder.status === OrderStatus.READY ? "#22c55e" : "#E31B23",
                  border: `1px solid ${activeOrder.status === OrderStatus.READY ? "rgba(34,197,94,0.4)" : "rgba(227,27,35,0.4)"}`,
                }}
              >
                {ORDER_STATUS_LABELS[activeOrder.status]}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #E31B23, #FFD700)" }}
                initial={{ width: 0 }}
                animate={{ width: `${ORDER_STATUS_PROGRESS[activeOrder.status]}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-white/60 text-xs">
                {activeOrder.items.slice(0, 2).map((i) => i.name).join(", ")}
                {activeOrder.items.length > 2 ? ` +${activeOrder.items.length - 2}` : ""}
              </p>
              {activeOrder.status === OrderStatus.READY && (
                <button
                  onClick={() => onMarkOrderComplete(activeOrder.id)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg text-white"
                  style={{ background: "rgba(34,197,94,0.3)", border: "1px solid rgba(34,197,94,0.5)" }}
                >
                  ✓ Recogido
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Points Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #1a0a0b, #2a0c0e)`,
          border: `1px solid ${tierColor}40`,
          boxShadow: `0 4px 30px ${tierColor}20`,
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
          style={{ background: tierColor, transform: "translate(30%, -30%)" }} />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-white/60 text-xs mb-1">Huara-Puntos</p>
            <p className="text-4xl font-black" style={{ color: tierColor }}>
              {user.balance.toFixed(0)}
            </p>
            <p className="text-white/40 text-xs mt-1">pts disponibles</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div
              className="px-3 py-1 rounded-full text-xs font-bold uppercase"
              style={{ background: `${tierColor}20`, color: tierColor, border: `1px solid ${tierColor}40` }}
            >
              {user.tier}
            </div>
            <button
              onClick={() => setShowQr(true)}
              className="flex items-center gap-1 text-xs text-white/50 px-2 py-1 rounded-lg"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              📱 Mi QR
            </button>
          </div>
        </div>
        {user.tier !== HuaraTier.ORO && (
          <div className="mt-4 relative z-10">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>{user.visitCount} visitas</span>
              <span>Próximo nivel: {tierNext - user.visitCount} más</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${tierColor}, ${tierColor}99)` }}
                initial={{ width: 0 }}
                animate={{ width: `${tierProgress}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: "🌮", label: "Pedir", action: () => onNavigate("menu") },
          { icon: "⭐", label: "Canjear", action: () => onNavigate("rewards") },
          { icon: "📍", label: "Sucursales", action: () => onNavigate("locations") },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-transform active:scale-95"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span className="text-2xl">{btn.icon}</span>
            <span className="text-white/70 text-xs font-medium">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Deals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-sm">Ofertas Exclusivas</h2>
          <span className="text-white/40 text-xs">3 activas</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {DEALS.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-48 rounded-2xl overflow-hidden relative"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="h-24 overflow-hidden aspect-video">
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              {deal.badge && (
                <div
                  className="absolute top-2 right-2 text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ background: "#E31B23", color: "#fff" }}
                >
                  {deal.badge}
                </div>
              )}
              <div className="p-3">
                <p className="text-white font-bold text-xs">{deal.title}</p>
                <p className="text-white/50 text-xs mt-0.5">{deal.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Share for Points */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 flex items-center justify-between"
        style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)" }}
      >
        <div>
          <p className="text-white font-semibold text-sm">Comparte y gana</p>
          <p className="text-white/50 text-xs mt-0.5">+20 pts por compartir hoy</p>
        </div>
        <button
          onClick={onShareForPoints}
          disabled={!canShare()}
          className="px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 disabled:opacity-40"
          style={{ background: canShare() ? "#FFD700" : "rgba(255,215,0,0.2)", color: canShare() ? "#000" : "#fff" }}
        >
          {canShare() ? "Compartir" : "✓ Hecho"}
        </button>
      </motion.div>

      {/* Referral */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-white font-semibold text-sm mb-1">Invita amigos 🎁</p>
        <p className="text-white/50 text-xs mb-3">Tu código: gana +50 pts por cada amigo que se registre</p>
        <div className="flex items-center gap-2">
          <div
            className="flex-1 py-2 px-3 rounded-xl text-center font-mono font-bold text-xs"
            style={{ background: "rgba(227,27,35,0.1)", color: "#E31B23", border: "1px solid rgba(227,27,35,0.3)" }}
          >
            {user.referralCode}
          </div>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Huarafans", text: `Únete con mi código: ${user.referralCode}`, url: "https://huarachon.vercel.app" });
              } else {
                navigator.clipboard.writeText(user.referralCode);
              }
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: "#E31B23" }}
          >
            📤
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div>
          <h2 className="text-white font-bold text-sm mb-3">Pedidos Recientes</h2>
          <div className="flex flex-col gap-2">
            {recentOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div>
                  <p className="text-white text-xs font-medium">
                    {order.items.slice(0, 2).map((i) => i.name).join(", ")}
                    {order.items.length > 2 ? ` +${order.items.length - 2}` : ""}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString("es-MX")}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-xs font-bold">${order.total.toFixed(0)}</p>
                  <p className="text-yellow-400 text-xs">+{order.pointsEarned}pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Modal */}
      <AnimatePresence>
        {showQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => setShowQr(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="rounded-3xl p-6 flex flex-col items-center gap-4 max-w-xs w-full"
              style={{ background: "#1a1a1a", border: "1px solid rgba(255,215,0,0.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-white font-bold">Mi Código de Lealtad</p>
              <div className="p-4 bg-white rounded-2xl">
                {/* Simple QR-like visual using a pattern */}
                <div
                  className="w-40 h-40 grid grid-cols-8 gap-0.5"
                  style={{ imageRendering: "pixelated" }}
                >
                  {Array.from({ length: 64 }).map((_, i) => {
                    const seed = (i * 37 + user.name.charCodeAt(i % user.name.length)) % 3;
                    return (
                      <div
                        key={i}
                        className="rounded-sm"
                        style={{ background: seed === 0 ? "#000" : "#fff", aspectRatio: "1" }}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{user.name}</p>
                <p className="text-xs font-mono mt-1" style={{ color: TIER_COLORS[user.tier] }}>
                  HUARA_{user.name.toUpperCase().slice(0,8)}_{user.tier.toUpperCase()}
                </p>
                <p className="text-white/40 text-xs mt-1">Escanea en caja</p>
              </div>
              <button onClick={() => setShowQr(false)} className="text-white/40 text-sm">
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
