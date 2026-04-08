"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile, Order } from "../types";
import { HuaraTier, OrderStatus } from "../types";

const TIER_COLORS: Record<HuaraTier, string> = {
  [HuaraTier.BRONCE]: "#CD7F32",
  [HuaraTier.PLATA]: "#C0C0C0",
  [HuaraTier.ORO]: "#FFD700",
};

const STAR_RATINGS = [1, 2, 3, 4, 5];

interface Props {
  user: UserProfile;
  orders: Order[];
  onUpdateUser: (u: Partial<UserProfile>) => void;
  onLogout: () => void;
}

export default function ProfilePage({ user, orders, onUpdateUser, onLogout }: Props) {
  const [showOrders, setShowOrders] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [starHover, setStarHover] = useState(0);
  const [starPick, setStarPick] = useState(0);
  const [feedback, setFeedback] = useState("");

  const tierColor = TIER_COLORS[user.tier];
  const savings = (user.balance * 0.1).toFixed(2);

  const menuItems = [
    { icon: "👤", label: "Información Personal", sub: user.email },
    { icon: "💳", label: "Métodos de Pago", sub: "Agregar tarjeta" },
    { icon: "📊", label: "Historial de Puntos", sub: `${user.balance.toFixed(0)} pts acumulados` },
    { icon: "🔔", label: "Notificaciones", sub: user.notifOffers && user.notifOrders ? "Todas activas" : "Personalizado", action: () => setShowNotifs(true) },
    { icon: "🔒", label: "Privacidad y Seguridad", sub: "Contraseña y datos" },
    { icon: "❓", label: "Ayuda y Soporte", sub: "Chat o llamada" },
  ];

  const submitRating = () => {
    if (!ratingOrder || starPick === 0) return;
    // In a real app this would call an API
    setRatingOrder(null);
    setStarPick(0);
    setFeedback("");
  };

  return (
    <div className="flex flex-col px-4 pt-4 pb-24 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white font-black text-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Mi Perfil
        </h1>
        <span className="text-white/30 text-xs">v2.4.0 Elite</span>
      </div>

      {/* Avatar + user info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 py-4"
      >
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white"
            style={{
              background: `linear-gradient(135deg, #E31B23, ${tierColor})`,
              boxShadow: `0 0 30px ${tierColor}40`,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-sm"
            style={{ background: tierColor, border: "2px solid #121212" }}
          >
            ⭐
          </div>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg">{user.name}</p>
          <p className="text-sm" style={{ color: tierColor }}>
            Nivel {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} · {user.visitCount} visitas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 w-full mt-1">
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.15)" }}
          >
            <p className="text-2xl font-black" style={{ color: "#FFD700" }}>{user.balance.toFixed(0)}</p>
            <p className="text-white/40 text-xs mt-0.5">Huara-Puntos</p>
          </div>
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}
          >
            <p className="text-2xl font-black" style={{ color: "#22c55e" }}>${savings}</p>
            <p className="text-white/40 text-xs mt-0.5">Ahorrado</p>
          </div>
        </div>
      </motion.div>

      {/* Order history shortcut */}
      <button
        onClick={() => setShowOrders(true)}
        className="flex items-center justify-between p-4 rounded-2xl transition-transform active:scale-98"
        style={{ background: "rgba(227,27,35,0.08)", border: "1px solid rgba(227,27,35,0.2)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📦</span>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Historial de Pedidos</p>
            <p className="text-white/40 text-xs">{orders.length} pedidos realizados</p>
          </div>
        </div>
        <span className="text-white/30">›</span>
      </button>

      {/* Menu items */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {menuItems.map((item, i) => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-white/5 text-left"
            style={{ borderBottom: i < menuItems.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7">{item.icon}</span>
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                {item.sub && <p className="text-white/40 text-xs mt-0.5">{item.sub}</p>}
              </div>
            </div>
            <span className="text-white/30 text-sm">›</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-transform active:scale-95"
        style={{ background: "rgba(227,27,35,0.1)", color: "#E31B23", border: "1px solid rgba(227,27,35,0.2)" }}
      >
        Cerrar Sesión
      </button>

      {/* Order history modal */}
      <AnimatePresence>
        {showOrders && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => setShowOrders(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-sm rounded-t-3xl flex flex-col max-h-[80vh]"
              style={{ background: "#1a1a1a" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-4 mb-4 flex-shrink-0" />
              <div className="flex items-center justify-between px-5 mb-3 flex-shrink-0">
                <p className="text-white font-bold">Historial de Pedidos</p>
                <button onClick={() => setShowOrders(false)} className="text-white/40 text-sm">Cerrar</button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-8">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-white/30">
                    <p className="text-3xl mb-3">📦</p>
                    <p className="text-sm">Aún no tienes pedidos</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl p-4"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-white/60 text-xs">#{order.id}</span>
                          <span className="text-white/40 text-xs">{new Date(order.createdAt).toLocaleDateString("es-MX")}</span>
                        </div>
                        <p className="text-white text-sm font-medium mb-1">
                          {order.items.slice(0, 2).map((i) => i.name).join(", ")}
                          {order.items.length > 2 ? ` +${order.items.length - 2}` : ""}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-bold text-white">${order.total.toFixed(2)}</p>
                          <div className="flex items-center gap-2">
                            {order.rating ? (
                              <div className="flex gap-0.5">
                                {STAR_RATINGS.map((s) => (
                                  <span key={s} style={{ color: s <= (order.rating ?? 0) ? "#FFD700" : "rgba(255,255,255,0.2)", fontSize: "12px" }}>★</span>
                                ))}
                              </div>
                            ) : order.status === OrderStatus.COMPLETED ? (
                              <button
                                onClick={() => { setRatingOrder(order); setShowOrders(false); }}
                                className="text-xs px-2 py-1 rounded-lg"
                                style={{ background: "rgba(255,215,0,0.15)", color: "#FFD700" }}
                              >
                                Calificar
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating modal */}
      <AnimatePresence>
        {ratingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.85)" }}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="rounded-3xl p-6 w-full max-w-xs flex flex-col items-center gap-4"
              style={{ background: "#1a1a1a", border: "1px solid rgba(255,215,0,0.2)" }}
            >
              <p className="text-white font-bold text-lg">¿Cómo estuvo tu pedido?</p>
              <div className="flex gap-2">
                {STAR_RATINGS.map((s) => (
                  <button
                    key={s}
                    onMouseEnter={() => setStarHover(s)}
                    onMouseLeave={() => setStarHover(0)}
                    onClick={() => setStarPick(s)}
                    className="text-3xl transition-transform active:scale-90"
                    style={{ color: s <= (starHover || starPick) ? "#FFD700" : "rgba(255,255,255,0.2)" }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Comentario opcional..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-white/30 outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setRatingOrder(null)}
                  className="flex-1 py-3 rounded-xl text-white/50 text-sm"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  Omitir
                </button>
                <button
                  onClick={submitRating}
                  disabled={starPick === 0}
                  className="flex-1 py-3 rounded-xl font-bold text-black text-sm disabled:opacity-40"
                  style={{ background: "#FFD700" }}
                >
                  Enviar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notif settings modal */}
      <AnimatePresence>
        {showNotifs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => setShowNotifs(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-sm rounded-t-3xl p-5 pb-10"
              style={{ background: "#1a1a1a" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
              <p className="text-white font-bold mb-5">Notificaciones</p>
              {[
                { key: "notifOffers" as const, label: "Ofertas y Promociones", sub: "Descuentos y nuevos items" },
                { key: "notifOrders" as const, label: "Estado de Pedidos", sub: "Actualizaciones en tiempo real" },
              ].map(({ key, label, sub }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-white/40 text-xs mt-0.5">{sub}</p>
                  </div>
                  <button
                    onClick={() => onUpdateUser({ [key]: !user[key] })}
                    className="w-12 h-6 rounded-full relative transition-all"
                    style={{ background: user[key] ? "#E31B23" : "rgba(255,255,255,0.15)" }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                      style={{ left: user[key] ? "calc(100% - 20px)" : "4px" }}
                    />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setShowNotifs(false)}
                className="w-full py-3 mt-5 rounded-xl font-bold text-white"
                style={{ background: "#E31B23" }}
              >
                Listo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
