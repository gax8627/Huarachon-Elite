"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile, Order, CartItem, MenuItem, Branch } from "../types";
import { HuaraTier, PickupMethod, PaymentMethod, OrderStatus } from "../types";

/* ─── Real menu data (synced with Flutter) ─── */
const ALL_ITEMS: MenuItem[] = [
  // Especialidades
  { id: "esp-1", name: "Taco Huarachón", price: 101, desc: "Asada y queso en tortilla de harina especial.", category: "Especialidades", hasSalsa: true, image: "https://tb-static.uber.com/prod/image-proc/processed_images/4f9785b356ab7307f08fb08e199e5d9f/c67fc65e9b4e16a553eb7574fba090f1.jpeg" },
  { id: "esp-2", name: "Súper Taco Huarachón", price: 166, desc: "Doble queso, cebollitas y chiles toreados.", category: "Especialidades", hasSalsa: true, image: "https://tb-static.uber.com/prod/image-proc/processed_images/4f9785b356ab7307f08fb08e199e5d9f/c67fc65e9b4e16a553eb7574fba090f1.jpeg" },
  { id: "esp-3", name: "Súper Taco Doble", price: 251, desc: "Dos tortillas grandes con doble porción.", category: "Especialidades", hasSalsa: true, image: "https://tb-static.uber.com/prod/image-proc/processed_images/4f9785b356ab7307f08fb08e199e5d9f/c67fc65e9b4e16a553eb7574fba090f1.jpeg" },
  // Tacos
  { id: "tac-1", name: "Taco de Asada", price: 56, desc: "Tradicional con aguacate y salsa.", category: "Tacos", hasSalsa: true, image: "https://tb-static.uber.com/prod/image-proc/processed_images/1ac8ab6d9247958e9397cd363ddbb4b5/bc9c318a9c96996e2d990faf2b0c65f6.jpeg" },
  { id: "tac-2", name: "Taco al Pastor", price: 56, desc: "Cerdo marinado con especias.", category: "Tacos", hasSalsa: true, image: "https://tb-static.uber.com/prod/image-proc/processed_images/418e5e827b29fe5e122d9a9929a916b0/bc9c318a9c96996e2d990faf2b0c65f6.jpeg" },
  { id: "tac-3", name: "Taco de Pollo", price: 56, desc: "Pechuga a la plancha jugosa.", category: "Tacos", hasSalsa: true },
  { id: "tac-4", name: "Taco de Tripa", price: 76, desc: "Blandita o doradita a elegir.", category: "Tacos", hasSalsa: true },
  { id: "tac-5", name: "Taco de Fajita", price: 81, desc: "Carne premium cortada en tiras.", category: "Tacos", hasSalsa: true },
  // Quesadillas
  { id: "que-1", name: "Quesadilla con Carne", price: 116, desc: "Queso fundido con tu carne favorita.", category: "Quesadillas", hasSalsa: true },
  { id: "que-2", name: "Quesadilla Sencilla", price: 73, desc: "Queso fundido en harina o maíz.", category: "Quesadillas", hasSalsa: true },
  { id: "que-3", name: "Súper Quesadilla", price: 126, desc: "Enorme tortilla de harina.", category: "Quesadillas", hasSalsa: true },
  { id: "que-4", name: "Mula de Asada", price: 86, desc: "Doble tortilla con queso y carne.", category: "Quesadillas", hasSalsa: true },
  // Parrilladas
  { id: "par-1", name: "Parrillada Huarachón (3 pers)", price: 495, desc: "Mix de carnes, frijoles y quesadillas.", category: "Parrilladas" },
  { id: "par-2", name: "Parrillada Individual", price: 185, desc: "Nuestra famosa parrilla personal.", category: "Parrilladas" },
  // Bebidas
  { id: "beb-1", name: "Horchata Huarachón", price: 50, desc: "Casera con canela.", category: "Bebidas" },
  { id: "beb-2", name: "Jamaica Fresh", price: 50, desc: "Refrescante y natural.", category: "Bebidas", image: "https://tb-static.uber.com/prod/image-proc/processed_images/09718992aabf46ad1a2b08c2b6659ac9/bc9c318a9c96996e2d990faf2b0c65f6.jpeg" },
  { id: "beb-3", name: "Sodas (355ml)", price: 53, desc: "Coca-Cola, Fresca, Sprite.", category: "Bebidas" },
];

const CATEGORIES = ["Todo", "Especialidades", "Tacos", "Quesadillas", "Parrilladas", "Bebidas"];

const SALSAS = ["Roja 🌶️", "Verde 🟢", "Ambas", "Sin Salsa"];

const TIER_DISCOUNTS: Record<HuaraTier, number> = {
  [HuaraTier.BRONCE]: 0.05,
  [HuaraTier.PLATA]: 0.08,
  [HuaraTier.ORO]: 0.12,
};

function getPlaceholder(category: string) {
  const map: Record<string, string> = {
    Especialidades: "🌮", Tacos: "🌮", Quesadillas: "🧀", Parrilladas: "🍱", Bebidas: "🥤",
  };
  return map[category] ?? "🍽️";
}

interface Props {
  user: UserProfile;
  branches: Branch[];
  onPlaceOrder: (order: Order) => void;
}

export default function MenuPage({ user, branches, onPlaceOrder }: Props) {
  const [category, setCategory] = useState("Todo");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customizing, setCustomizing] = useState<MenuItem | null>(null);
  const [salsa, setSalsa] = useState("Roja 🌶️");
  const [extras, setExtras] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id ?? "");
  const [showBranches, setShowBranches] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
  const [pickup, setPickup] = useState(PickupMethod.COUNTER);
  const [payment, setPayment] = useState(PaymentMethod.CASH);
  const [placingOrder, setPlacingOrder] = useState(false);

  const filtered = useMemo(() => {
    let items = ALL_ITEMS;
    if (category !== "Todo") items = items.filter((i) => i.category === category);
    if (search.trim()) items = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    return items;
  }, [category, search]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = subtotal * TIER_DISCOUNTS[user.tier];
  const total = subtotal - discount + subtotal * 0.08; // tier discount + IVA

  const addToCart = (item: MenuItem) => {
    if (item.hasSalsa) {
      setCustomizing(item);
      setSalsa("Roja 🌶️");
      setExtras([]);
    } else {
      pushCart(item, "Sin Salsa", []);
    }
  };

  const pushCart = (item: MenuItem, salsaChoice: string, extrasChoice: string[]) => {
    setCart((prev) => {
      const key = item.id + salsaChoice;
      const existing = prev.find((c) => c.id === key);
      if (existing) return prev.map((c) => c.id === key ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { id: key, name: item.name, price: item.price, quantity: 1, salsa: salsaChoice, extras: extrasChoice }];
    });
    setCustomizing(null);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, quantity: c.quantity + delta } : c).filter((c) => c.quantity > 0));
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    await new Promise((r) => setTimeout(r, 1200));
    const branch = branches.find((b) => b.id === selectedBranch) ?? branches[0];
    const pts = Math.floor(total * 0.1);
    const order: Order = {
      id: "ORD-" + Date.now().toString(36).toUpperCase(),
      items: [...cart],
      total,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      branch: branch?.name ?? "",
      pickupMethod: pickup,
      paymentMethod: payment,
      pointsEarned: pts,
    };
    onPlaceOrder(order);
    setCart([]);
    setCheckoutStep("success");
    setPlacingOrder(false);
    setTimeout(() => { setShowCart(false); setCheckoutStep("cart"); }, 2200);
  };

  const branch = branches.find((b) => b.id === selectedBranch);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 sticky top-0 z-20" style={{ background: "#121212" }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white font-black text-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Menú
          </h1>
          <button
            onClick={() => { setShowCart(true); setCheckoutStep("cart"); }}
            className="relative p-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            🛒
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                style={{ background: "#E31B23" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
          <input
            type="text"
            placeholder="Buscar en el menú..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-white text-sm placeholder-white/30 outline-none"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </div>

        {/* Location selector */}
        <button
          onClick={() => setShowBranches(true)}
          className="flex items-center gap-2 text-xs text-white/60 mb-3 px-3 py-2 rounded-xl w-full"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span>📍</span>
          <span className="flex-1 text-left">{branch?.name ?? "Selecciona sucursal"}</span>
          <span className="text-white/30">▼</span>
        </button>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: category === cat ? "#E31B23" : "rgba(255,255,255,0.08)",
                color: category === cat ? "#fff" : "rgba(255,255,255,0.5)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {item.image ? (
                <div className="h-28 overflow-hidden aspect-square">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div
                  className="h-28 aspect-square flex items-center justify-center text-4xl"
                  style={{ background: "rgba(227,27,35,0.08)" }}
                >
                  {getPlaceholder(item.category)}
                </div>
              )}
              <div className="p-3 flex flex-col flex-1">
                <p className="text-white font-semibold text-xs leading-tight line-clamp-2">{item.name}</p>
                <p className="text-white/40 text-xs mt-1 flex-1 line-clamp-2">{item.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-sm" style={{ color: "#FFD700" }}>${item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xl transition-transform active:scale-90"
                    style={{ background: "#E31B23" }}
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Customizer modal */}
      <AnimatePresence>
        {customizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
            style={{ background: "rgba(0,0,0,0.8)" }}
            onClick={() => setCustomizing(null)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-5 pb-8"
              style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
              <p className="text-white font-bold text-lg mb-1">{customizing.name}</p>
              <p className="text-white/50 text-sm mb-4">{customizing.desc}</p>

              <p className="text-white/70 text-xs font-semibold mb-2 uppercase tracking-wider">Elige tu salsa</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {SALSAS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSalsa(s)}
                    className="py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: salsa === s ? "rgba(227,27,35,0.2)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${salsa === s ? "rgba(227,27,35,0.6)" : "rgba(255,255,255,0.1)"}`,
                      color: salsa === s ? "#E31B23" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                onClick={() => pushCart(customizing, salsa, extras)}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-base"
                style={{ background: "linear-gradient(135deg, #E31B23, #B01217)" }}
              >
                Agregar — ${customizing.price}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branch selector modal */}
      <AnimatePresence>
        {showBranches && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
            style={{ background: "rgba(0,0,0,0.8)" }}
            onClick={() => setShowBranches(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-5 pb-8"
              style={{ background: "#1a1a1a" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
              <p className="text-white font-bold mb-4">Selecciona Sucursal</p>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBranch(b.id); setShowBranches(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-xl mb-2"
                  style={{
                    background: selectedBranch === b.id ? "rgba(227,27,35,0.15)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${selectedBranch === b.id ? "rgba(227,27,35,0.4)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div className="text-left">
                    <p className="text-white font-semibold text-sm">{b.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">{b.address}</p>
                  </div>
                  {selectedBranch === b.id && <span style={{ color: "#E31B23" }}>✓</span>}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart / Checkout modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => { setShowCart(false); setCheckoutStep("cart"); }}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-sm rounded-t-3xl md:rounded-3xl flex flex-col max-h-[85vh]"
              style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-4 mb-2 flex-shrink-0" />

              <AnimatePresence mode="wait">
                {checkoutStep === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 px-6"
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
                      style={{ background: "rgba(255,215,0,0.15)", boxShadow: "0 0 30px rgba(255,215,0,0.3)" }}
                    >
                      🌮
                    </div>
                    <p className="text-white font-black text-2xl">¡Buen provecho!</p>
                    <p className="text-white/50 text-sm mt-2 text-center">Tu pedido fue recibido. Te avisaremos cuando esté listo.</p>
                  </motion.div>
                ) : checkoutStep === "checkout" ? (
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="flex flex-col overflow-y-auto p-5 pb-8 gap-5"
                  >
                    <div className="flex items-center gap-3">
                      <button onClick={() => setCheckoutStep("cart")} className="text-white/40 text-sm">← Atrás</button>
                      <p className="text-white font-bold">Confirmar Pedido</p>
                    </div>

                    <div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Método de recogida</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { m: PickupMethod.COUNTER, icon: "🏪", label: "Mostrador" },
                          { m: PickupMethod.CURBSIDE, icon: "🚗", label: "Curbside" },
                          { m: PickupMethod.DRIVE_THRU, icon: "🏎️", label: "Drive-thru" },
                        ].map(({ m, icon, label }) => (
                          <button
                            key={m}
                            onClick={() => setPickup(m)}
                            className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs"
                            style={{
                              background: pickup === m ? "rgba(227,27,35,0.2)" : "rgba(255,255,255,0.05)",
                              border: `1px solid ${pickup === m ? "rgba(227,27,35,0.5)" : "rgba(255,255,255,0.08)"}`,
                              color: pickup === m ? "#E31B23" : "rgba(255,255,255,0.5)",
                            }}
                          >
                            <span className="text-xl">{icon}</span>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Método de pago</p>
                      <div className="flex flex-col gap-2">
                        {[
                          { m: PaymentMethod.CARD, icon: "💳", label: "Tarjeta de crédito/débito" },
                          { m: PaymentMethod.APPLE_PAY, icon: "🍎", label: "Apple Pay" },
                          { m: PaymentMethod.CASH, icon: "💵", label: "Efectivo en caja" },
                        ].map(({ m, icon, label }) => (
                          <button
                            key={m}
                            onClick={() => setPayment(m)}
                            className="flex items-center gap-3 p-3 rounded-xl text-sm"
                            style={{
                              background: payment === m ? "rgba(227,27,35,0.15)" : "rgba(255,255,255,0.05)",
                              border: `1px solid ${payment === m ? "rgba(227,27,35,0.4)" : "rgba(255,255,255,0.08)"}`,
                              color: payment === m ? "#fff" : "rgba(255,255,255,0.5)",
                            }}
                          >
                            <span className="text-xl">{icon}</span>
                            <span className="flex-1 text-left">{label}</span>
                            {payment === m && <span style={{ color: "#E31B23" }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl p-3 flex flex-col gap-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs" style={{ color: "#22c55e" }}>
                        <span>Descuento {user.tier} ({Math.round(TIER_DISCOUNTS[user.tier] * 100)}%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>IVA (8%)</span><span>${(subtotal * 0.08).toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-white/10 my-1" />
                      <div className="flex justify-between font-bold text-white">
                        <span>Total</span><span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <p className="text-white/30 text-xs text-center">⏱ Tiempo estimado: 15–20 min · {branch?.name}</p>

                    <button
                      onClick={placeOrder}
                      disabled={placingOrder}
                      className="w-full py-4 rounded-2xl font-bold text-white text-base disabled:opacity-50 transition-transform active:scale-95"
                      style={{ background: "linear-gradient(135deg, #E31B23, #B01217)" }}
                    >
                      {placingOrder ? "Procesando..." : `Pagar $${total.toFixed(2)}`}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col overflow-hidden"
                  >
                    <div className="px-5 pb-2 flex-shrink-0">
                      <p className="text-white font-bold">Tu Carrito {cartCount > 0 ? `(${cartCount})` : ""}</p>
                    </div>
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-white/40">
                        <span className="text-4xl mb-3">🛒</span>
                        <p className="text-sm">Tu carrito está vacío</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-y-auto px-5 pb-2">
                          {cart.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 py-3 border-b"
                              style={{ borderColor: "rgba(255,255,255,0.06)" }}
                            >
                              <div className="flex-1">
                                <p className="text-white text-sm font-medium">{item.name}</p>
                                {item.salsa && item.salsa !== "Sin Salsa" && (
                                  <p className="text-white/40 text-xs">{item.salsa}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm"
                                  style={{ background: "rgba(255,255,255,0.1)" }}
                                >–</button>
                                <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQty(item.id, 1)}
                                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm"
                                  style={{ background: "#E31B23" }}
                                >+</button>
                              </div>
                              <span className="text-white/70 text-sm w-12 text-right">${(item.price * item.quantity).toFixed(0)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="px-5 pb-8 pt-3 flex-shrink-0">
                          <div className="flex justify-between text-white/60 text-sm mb-1">
                            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-3" style={{ color: "#22c55e" }}>
                            <span>Tu descuento {user.tier}</span><span>-${discount.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => setCheckoutStep("checkout")}
                            className="w-full py-4 rounded-2xl font-bold text-white"
                            style={{ background: "linear-gradient(135deg, #E31B23, #B01217)" }}
                          >
                            Ir a Pagar — ${total.toFixed(2)}
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
