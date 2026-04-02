"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

/* ─── Menu Data (mirrors Flutter menu.json) ─── */
const MENU = {
  categories: [
    {
      name: "Especialidades 🌟",
      items: [
        { id: "esp-1", name: "Taco Huarachón", price: 101, desc: "Asada y queso en tortilla de harina especial.", image: "https://tb-static.uber.com/prod/image-proc/processed_images/4f9785b356ab7307f08fb08e199e5d9f/c67fc65e9b4e16a553eb7574fba090f1.jpeg" },
        { id: "esp-2", name: "Súper Taco Huarachón", price: 166, desc: "Doble queso, cebollitas y chiles toreados.", image: "https://tb-static.uber.com/prod/image-proc/processed_images/4f9785b356ab7307f08fb08e199e5d9f/c67fc65e9b4e16a553eb7574fba090f1.jpeg" },
        { id: "esp-3", name: "Súper Taco Doble", price: 251, desc: "Dos tortillas grandes con doble porción de carne.", image: "https://tb-static.uber.com/prod/image-proc/processed_images/4f9785b356ab7307f08fb08e199e5d9f/c67fc65e9b4e16a553eb7574fba090f1.jpeg" },
      ],
    },
    {
      name: "Tacos 🌮",
      items: [
        { id: "tac-1", name: "Taco de Asada", price: 56, desc: "Tradicional con aguacate y salsa.", image: "https://tb-static.uber.com/prod/image-proc/processed_images/1ac8ab6d9247958e9397cd363ddbb4b5/bc9c318a9c96996e2d990faf2b0c65f6.jpeg" },
        { id: "tac-2", name: "Taco al Pastor", price: 56, desc: "Cerdo marinado con especias.", image: "https://tb-static.uber.com/prod/image-proc/processed_images/418e5e827b29fe5e122d9a9929a916b0/bc9c318a9c96996e2d990faf2b0c65f6.jpeg" },
        { id: "tac-3", name: "Taco de Pollo", price: 56, desc: "Pechuga a la plancha jugosa." },
        { id: "tac-4", name: "Taco de Tripa", price: 76, desc: "Blandita o doradita a elegir." },
        { id: "tac-5", name: "Taco de Fajita de Asada", price: 81, desc: "Carne Premium cortada en tiras." },
      ],
    },
    {
      name: "Quesadillas & Mulas 🧀",
      items: [
        { id: "que-1", name: "Quesadilla con Carne", price: 116, desc: "Melted cheese con tu carne favorita." },
        { id: "que-2", name: "Quesadilla Sencilla", price: 73, desc: "Queso fundido en harina o maíz." },
        { id: "que-3", name: "Súper Quesadilla", price: 126, desc: "Enorme tortilla de harina." },
        { id: "que-4", name: "Mula de Asada", price: 86, desc: "Doble tortilla con queso y carne." },
      ],
    },
    {
      name: "Parrilladas 🍱",
      items: [
        { id: "par-1", name: "Parrillada Huarachón (3 pers)", price: 495, desc: "Mix de carnes, frijoles y quesadillas." },
        { id: "par-2", name: "Parrillada Individual", price: 185, desc: "Nuestra famosa parrilla personal." },
      ],
    },
    {
      name: "Bebidas 🥤",
      items: [
        { id: "beb-1", name: "Horchata Huarachón", price: 50, desc: "Casera con canela." },
        { id: "beb-2", name: "Jamaica Fresh", price: 50, desc: "Refrescante y natural.", image: "https://tb-static.uber.com/prod/image-proc/processed_images/09718992aabf46ad1a2b08c2b6659ac9/bc9c318a9c96996e2d990faf2b0c65f6.jpeg" },
        { id: "beb-3", name: "Sodas (355ml)", price: 53, desc: "Coca-Cola, Fresca, Sprite." },
      ],
    },
  ],
};

const BRANCHES = [
  { name: "Independencia", address: "Calz Independencia 303, Insurgentes Este", phone: "686 567 9254", hours: "8:00 AM – 11:00 PM" },
  { name: "Gómez Morín", address: "Calz. Manuel Gómez Morín 392, Las Hadas", phone: "686 566 9595", hours: "8:00 AM – 11:00 PM" },
  { name: "Lázaro Cárdenas", address: "#701 Esquina con Lago Chad, Jardines del Lago", phone: "686 557 2223", hours: "8:00 AM – 11:00 PM" },
];

const TIERS = [
  { name: "Bronce", min: 0, rate: "5%", icon: "🥉", color: "#CD7F32" },
  { name: "Plata", min: 10, rate: "8%", icon: "🥈", color: "#C0C0C0" },
  { name: "Oro", min: 25, rate: "12%", icon: "🥇", color: "#FFC107" },
];

type CartItem = { id: string; name: string; price: number; qty: number };
type Tab = "menu" | "puntos" | "sucursales";

/* ─────────────────── MAIN APP ─────────────────── */
export default function HuarachonApp() {
  const [tab, setTab] = useState<Tab>("menu");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(0);
  const [huaraPoints, setHuaraPoints] = useState(128.5);
  const [visits, setVisits] = useState(3);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [nameSet, setNameSet] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tier = visits >= 25 ? TIERS[2] : visits >= 10 ? TIERS[1] : TIERS[0];

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("huara-state");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.points) setHuaraPoints(s.points);
        if (s.visits) setVisits(s.visits);
        if (s.name) { setGuestName(s.name); setNameSet(true); }
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (nameSet) {
      localStorage.setItem("huara-state", JSON.stringify({ points: huaraPoints, visits, name: guestName }));
    }
  }, [huaraPoints, visits, guestName, nameSet]);

  const addToCart = useCallback((item: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 350);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const item = prev.find((c) => c.id === id);
      if (!item) return prev;
      if (item.qty === 1) return prev.filter((c) => c.id !== id);
      return prev.map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c));
    });
  }, []);

  const placeOrder = () => {
    const cashback = cartTotal * (parseInt(tier.rate) / 100);
    setHuaraPoints((p) => p + cashback);
    setVisits((v) => v + 1);
    setCart([]);
    setCartOpen(false);
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 4000);
  };

  /* ─── Welcome Gate ─── */
  if (!nameSet) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-huara-red/20 blur-[120px] rounded-full animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-huara-gold/10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative glass-strong rounded-3xl p-10 max-w-md w-full text-center space-y-6 animate-scale-in">
          <div className="w-20 h-20 bg-huara-red rounded-2xl mx-auto flex items-center justify-center text-4xl font-black shadow-lg shadow-huara-red/30">H</div>
          <h1 className="text-3xl font-black">¡Bienvenido!</h1>
          <p className="text-white/50 text-sm">Pide en línea y gana Huara-Puntos con cada orden. Sin descargas.</p>
          <input
            type="text"
            placeholder="Tu nombre (ej. Carlos)"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-lg outline-none focus:border-huara-gold/50 transition-colors placeholder:text-white/20"
          />
          <button
            onClick={() => { if (guestName.trim()) setNameSet(true); }}
            disabled={!guestName.trim()}
            className="w-full bg-huara-red hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-huara-red/30"
          >
            Empezar a Pedir 🌮
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20 selection:bg-huara-gold selection:text-black">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-huara-red/15 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-huara-gold/8 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 glass border-b-0 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-huara-red rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-huara-red/20">H</div>
            <div>
              <div className="font-bold text-sm leading-tight">El Huarachón</div>
              <div className="text-[10px] text-white/40">Hola, {guestName} {tier.icon}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-huara-gold font-bold text-sm">${huaraPoints.toFixed(0)}</div>
              <div className="text-[9px] text-white/30">Huara-Pts</div>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className={`relative w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all ${cartBounce ? "animate-cart-bounce" : ""}`}
            >
              <span className="text-lg">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-huara-red rounded-full text-[10px] font-bold flex items-center justify-center cart-badge shadow-lg shadow-huara-red/50">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Order Success Toast ── */}
      {orderPlaced && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] glass-strong px-6 py-4 rounded-2xl animate-slide-up max-w-sm text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="font-bold text-sm">¡Orden Confirmada!</div>
          <div className="text-xs text-huara-gold mt-1">+${(cartTotal * parseInt(tier.rate) / 100).toFixed(0)} Huara-Puntos ganados</div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 pt-4 pb-4">
        {tab === "menu" && (
          <div className="animate-slide-up">
            {/* Category Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none -mx-4 px-4">
              {MENU.categories.map((cat, i) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCat(i)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                    activeCat === i
                      ? "bg-huara-red text-white shadow-lg shadow-huara-red/30"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="space-y-3 mt-2 stagger-children">
              {MENU.categories[activeCat].items.map((item) => {
                const inCart = cart.find((c) => c.id === item.id);
                return (
                  <div key={item.id} className="glass rounded-2xl overflow-hidden flex group hover:border-white/20 transition-all">
                    {item.image && (
                      <div className="w-28 h-28 shrink-0 relative overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="112px" />
                      </div>
                    )}
                    <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="font-bold text-sm leading-tight">{item.name}</div>
                        <div className="text-white/40 text-xs mt-0.5 line-clamp-2">{item.desc}</div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-huara-gold font-bold text-sm">${item.price}</span>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sm hover:bg-huara-red/50 transition-colors">−</button>
                            <span className="text-sm font-bold w-4 text-center">{inCart.qty}</span>
                            <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-lg bg-huara-red flex items-center justify-center text-sm hover:bg-red-600 transition-colors">+</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-3.5 py-1.5 bg-huara-red/20 hover:bg-huara-red text-huara-red hover:text-white rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95"
                          >
                            Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "puntos" && (
          <div className="space-y-4 animate-slide-up">
            {/* Points Hero */}
            <div className="glass-strong rounded-3xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 shimmer-bg pointer-events-none" />
              <div className="relative">
                <div className="text-5xl mb-2">{tier.icon}</div>
                <div className="text-3xl font-black text-huara-gold">${huaraPoints.toFixed(0)}</div>
                <div className="text-xs text-white/40 mt-1">Huara-Puntos disponibles</div>
                <div className="mt-3 inline-block px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: `${tier.color}20`, color: tier.color }}>
                  Nivel {tier.name} · {tier.rate} Cashback
                </div>
              </div>
            </div>

            {/* Tier Progress */}
            <div className="glass rounded-2xl p-5 space-y-4">
              <div className="font-bold text-sm">Tu Progreso</div>
              <div className="flex items-center gap-3">
                {TIERS.map((t, i) => (
                  <div key={t.name} className="flex-1 text-center">
                    <div className={`text-2xl mb-1 ${visits >= t.min ? "" : "opacity-30 grayscale"}`}>{t.icon}</div>
                    <div className="text-[10px] text-white/40">{t.name}</div>
                    <div className="text-[9px] text-white/20">{t.min}+ visitas</div>
                    {i < TIERS.length - 1 && <div className="hidden" />}
                  </div>
                ))}
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (visits / 25) * 100)}%`,
                    background: `linear-gradient(to right, ${TIERS[0].color}, ${tier.color})`,
                  }}
                />
              </div>
              <div className="text-xs text-white/30 text-center">{visits} visitas · {Math.max(0, (visits >= 25 ? 0 : visits >= 10 ? 25 - visits : 10 - visits))} más para subir de nivel</div>
            </div>

            {/* How it works */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <div className="font-bold text-sm">¿Cómo Funciona?</div>
              {[
                { icon: "🌮", text: "Haz tu pedido en línea o en la app" },
                { icon: "💰", text: `Gana ${tier.rate} cashback en Huara-Puntos` },
                { icon: "🎁", text: "Usa tus puntos como crédito en tu próximo pedido" },
                { icon: "⬆️", text: "Sube de nivel con más visitas para mejor cashback" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{step.icon}</span>
                  <span className="text-xs text-white/50">{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "sucursales" && (
          <div className="space-y-3 animate-slide-up stagger-children">
            <div className="text-center py-4">
              <h2 className="text-xl font-bold">Nuestras Sucursales</h2>
              <p className="text-xs text-white/40 mt-1">3 ubicaciones en Mexicali</p>
            </div>
            {BRANCHES.map((b) => (
              <div key={b.name} className="glass rounded-2xl p-5 space-y-3 hover:border-white/20 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-huara-red/20 rounded-xl flex items-center justify-center text-lg shrink-0">📍</div>
                  <div>
                    <div className="font-bold text-sm">{b.name}</div>
                    <div className="text-xs text-white/40 mt-0.5">{b.address}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${b.phone.replace(/\s/g, "")}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-xl py-2.5 text-xs font-medium transition-colors"
                  >
                    <span>📞</span> {b.phone}
                  </a>
                  <a
                    href={`https://maps.google.com/?q=El+Huarachon+${b.name}+Mexicali`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-huara-red/20 hover:bg-huara-red rounded-xl py-2.5 text-xs font-bold text-huara-red hover:text-white transition-all"
                  >
                    <span>🗺️</span> Cómo Llegar
                  </a>
                </div>
                <div className="text-[10px] text-white/20 flex items-center gap-1">
                  <span>🕐</span> {b.hours}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Bottom Tab Bar ── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 glass border-t border-white/5">
        <div className="max-w-3xl mx-auto flex">
          {([
            { key: "menu" as Tab, icon: "🌮", label: "Menú" },
            { key: "puntos" as Tab, icon: "⭐", label: "Puntos" },
            { key: "sucursales" as Tab, icon: "📍", label: "Sucursales" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-all ${
                tab === t.key ? "text-huara-gold" : "text-white/30 hover:text-white/50"
              }`}
            >
              <span className={`text-xl ${tab === t.key ? "scale-110" : ""} transition-transform`}>{t.icon}</span>
              <span className="text-[10px] font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 max-h-[85vh] glass-strong rounded-t-3xl animate-slide-up overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Tu Orden</h2>
                <button onClick={() => setCartOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-sm">✕</button>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-3">🌮</div>
                <div className="text-white/30 text-sm">Tu carrito está vacío</div>
                <div className="text-white/15 text-xs mt-1">Agrega algo del menú para empezar</div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.name}</div>
                        <div className="text-xs text-white/30">${item.price} c/u</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sm hover:bg-huara-red/50 transition-colors">−</button>
                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sm hover:bg-huara-gold/30 transition-colors">+</button>
                        <span className="text-sm font-bold text-huara-gold ml-2 w-12 text-right">${item.price * item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 border-t border-white/5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Subtotal</span>
                    <span className="font-bold">${cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-huara-gold/60">Cashback ({tier.rate})</span>
                    <span className="text-huara-gold font-bold">+${(cartTotal * parseInt(tier.rate) / 100).toFixed(0)} pts</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    className="w-full bg-huara-red hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-huara-red/30 text-sm"
                  >
                    Confirmar Orden · ${cartTotal} MXN
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
