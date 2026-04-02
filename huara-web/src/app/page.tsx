"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

/* ─── Real assets from taqueriaelhuarachon.com ─── */
const LOGO = "https://taqueriaelhuarachon.com/wp-content/uploads/2023/10/Objeto-inteligente-vectorial-806x1024.webp";
const PALADAR_HEADER = "https://taqueriaelhuarachon.com/wp-content/uploads/2023/10/PALADAR-1024x328.webp";

const FOOD_PHOTOS = [
  "https://taqueriaelhuarachon.com/wp-content/uploads/2023/11/BJ1A8970-scaled.webp",
  "https://taqueriaelhuarachon.com/wp-content/uploads/2023/11/BJ1A8511-scaled.webp",
  "https://taqueriaelhuarachon.com/wp-content/uploads/2023/11/BJ1A8403-scaled.webp",
  "https://taqueriaelhuarachon.com/wp-content/uploads/2023/11/BJ1A8034-scaled.webp",
  "https://taqueriaelhuarachon.com/wp-content/uploads/2023/11/BJ1A7024-scaled.webp",
  "https://taqueriaelhuarachon.com/wp-content/uploads/2023/11/BJ1A2897-scaled.webp",
];

/* ─── Menu Data (synced with Flutter menu.json) ─── */
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

/* ─── Branches with REAL hours from taqueriaelhuarachon.com ─── */
const BRANCHES = [
  {
    name: "Independencia",
    address: "Calz Independencia 303, Insurgentes Este, 21280 Mexicali, B.C.",
    phones: ["(686) 567 9254", "(686) 567 3460"],
    hours: "Lun–Jue: 11am–1am · Vie–Sáb: 11am–4am",
    mapsQuery: "Calz+Independencia+303+Insurgentes+Este+Mexicali",
  },
  {
    name: "Gómez Morín",
    address: "Calz. Manuel Gómez Morín 392, Las Hadas, 21216 Mexicali, B.C.",
    phones: ["(686) 566 9595"],
    hours: "Lun–Dom: 11am–11pm",
    mapsQuery: "Calz+Manuel+Gomez+Morin+392+Las+Hadas+Mexicali",
  },
  {
    name: "Lázaro Cárdenas",
    address: "Blvd. Lázaro Cárdenas #701 Esq. Lago Chad, Jardines del Lago, Mexicali, B.C.",
    phones: ["(686) 557 2223"],
    hours: "Lun–Dom: 11am–12am",
    mapsQuery: "Blvd+Lazaro+Cardenas+701+Villafontana+Mexicali",
  },
];

const TIERS = [
  { name: "Bronce", min: 0, rate: "5%", icon: "🥉", color: "#CD7F32" },
  { name: "Plata", min: 10, rate: "8%", icon: "🥈", color: "#C0C0C0" },
  { name: "Oro", min: 25, rate: "12%", icon: "🥇", color: "#FFC107" },
];

type CartItem = { id: string; name: string; price: number; qty: number };
type Tab = "menu" | "puntos" | "sucursales" | "mas";

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
  const [qrInput, setQrInput] = useState("");
  const [qrMessage, setQrMessage] = useState("");
  const [lastShareDate, setLastShareDate] = useState<string | null>(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tier = visits >= 25 ? TIERS[2] : visits >= 10 ? TIERS[1] : TIERS[0];

  const today = new Date().toDateString();
  const canShareToday = lastShareDate !== today;

  useEffect(() => {
    const saved = localStorage.getItem("huara-state");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.points) setHuaraPoints(s.points);
        if (s.visits) setVisits(s.visits);
        if (s.name) { setGuestName(s.name); setNameSet(true); }
        if (s.lastShare) setLastShareDate(s.lastShare);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (nameSet) {
      localStorage.setItem("huara-state", JSON.stringify({
        points: huaraPoints, visits, name: guestName, lastShare: lastShareDate,
      }));
    }
  }, [huaraPoints, visits, guestName, nameSet, lastShareDate]);

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

  const handleQrSubmit = () => {
    const code = qrInput.trim().toUpperCase();
    if (code.startsWith("HUARA-") && code.includes("-")) {
      const parts = code.split("-");
      const amount = parseFloat(parts[1]);
      if (!isNaN(amount) && amount > 0) {
        setHuaraPoints((p) => p + amount);
        setVisits((v) => v + 1);
        setQrMessage(`✅ ¡+$${amount.toFixed(0)} Huara-Puntos agregados!`);
        setQrInput("");
        setTimeout(() => setQrMessage(""), 3000);
        return;
      }
    }
    setQrMessage("❌ Código no válido. Pide tu código en caja.");
    setTimeout(() => setQrMessage(""), 3000);
  };

  const handleShare = async () => {
    if (!canShareToday) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "El Huarachón — Dale Gusto Al Paladar",
          text: "🌮 Los mejores tacos de Mexicali desde 1976. ¡Únete a los #Huarafans!",
          url: "https://huarachon-marketing.vercel.app",
        });
      } else {
        await navigator.clipboard.writeText("🌮 Los mejores tacos de Mexicali desde 1976. ¡Únete a los #Huarafans! https://huarachon-marketing.vercel.app");
      }
      setHuaraPoints((p) => p + 20);
      setLastShareDate(today);
    } catch { /* user cancelled */ }
  };

  /* ─── Welcome Gate ─── */
  if (!nameSet) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-huara-red/20 blur-[120px] rounded-full animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-huara-gold/10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative glass-strong rounded-3xl p-10 max-w-md w-full text-center space-y-5 animate-scale-in">
          <div className="w-24 h-24 mx-auto relative">
            <Image src={LOGO} alt="El Huarachón" fill className="object-contain" sizes="96px" />
          </div>
          <Image src={PALADAR_HEADER} alt="Dale Gusto Al Paladar" width={320} height={102} className="mx-auto opacity-80" />
          <p className="text-white/40 text-xs">Taquería en Mexicali desde 1976</p>
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-huara-red/15 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-huara-gold/8 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 glass border-b-0 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 relative shrink-0">
              <Image src={LOGO} alt="El Huarachón" fill className="object-contain" sizes="36px" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight font-[var(--font-montserrat)]">El Huarachón</div>
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
        {/* ═══ MENU TAB ═══ */}
        {tab === "menu" && (
          <div className="animate-slide-up">
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

        {/* ═══ PUNTOS TAB ═══ */}
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

            {/* QR Code Entry (web alternative to camera scan) */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <div className="font-bold text-sm flex items-center gap-2">📱 Canjear Código QR</div>
              <p className="text-xs text-white/40">Pide tu código en caja después de pagar y escríbelo aquí para ganar puntos.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: HUARA-50-MXL"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-huara-gold/50 transition-colors placeholder:text-white/15 uppercase"
                />
                <button
                  onClick={handleQrSubmit}
                  disabled={!qrInput.trim()}
                  className="px-4 bg-huara-red hover:bg-red-700 disabled:opacity-30 rounded-xl text-sm font-bold transition-all shrink-0"
                >
                  Canjear
                </button>
              </div>
              {qrMessage && <div className="text-xs text-center animate-slide-up">{qrMessage}</div>}
            </div>

            {/* Share for Points */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <div className="font-bold text-sm flex items-center gap-2">📣 Comparte y Gana</div>
              <p className="text-xs text-white/40">Comparte El Huarachón en tus redes sociales y gana +$20 Huara-Puntos (1 vez al día).</p>
              <button
                onClick={handleShare}
                disabled={!canShareToday}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                  canShareToday
                    ? "bg-huara-gold/20 hover:bg-huara-gold text-huara-gold hover:text-black hover:scale-[1.02] active:scale-95"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
              >
                {canShareToday ? "Compartir y Ganar +$20 pts 🎉" : "✅ Ya compartiste hoy. ¡Mañana ganas más!"}
              </button>
            </div>

            {/* Tier Progress */}
            <div className="glass rounded-2xl p-5 space-y-4">
              <div className="font-bold text-sm">Tu Progreso</div>
              <div className="flex items-center gap-3">
                {TIERS.map((t) => (
                  <div key={t.name} className="flex-1 text-center">
                    <div className={`text-2xl mb-1 ${visits >= t.min ? "" : "opacity-30 grayscale"}`}>{t.icon}</div>
                    <div className="text-[10px] text-white/40">{t.name}</div>
                    <div className="text-[9px] text-white/20">{t.min}+ visitas</div>
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
              <div className="text-xs text-white/30 text-center">{visits} visitas · {Math.max(0, (visits >= 25 ? 0 : visits >= 10 ? 25 - visits : 10 - visits))} más para subir</div>
            </div>
          </div>
        )}

        {/* ═══ SUCURSALES TAB ═══ */}
        {tab === "sucursales" && (
          <div className="space-y-3 animate-slide-up stagger-children">
            <div className="text-center py-4">
              <h2 className="text-xl font-bold font-[var(--font-montserrat)]">Sucursales</h2>
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
                <div className="text-xs text-white/50 flex items-center gap-1.5">
                  <span>🕐</span> {b.hours}
                </div>
                <div className="space-y-1.5">
                  {b.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/[() ]/g, "")}`} className="flex items-center gap-2 text-xs text-white/60 hover:text-huara-gold transition-colors">
                      <span>📞</span> {p}
                    </a>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <a
                    href={`tel:${b.phones[0].replace(/[() ]/g, "")}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-huara-red/20 hover:bg-huara-red rounded-xl py-2.5 text-xs font-bold text-huara-red hover:text-white transition-all"
                  >
                    📞 Pide y Recoge
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${b.mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-xl py-2.5 text-xs font-medium transition-colors"
                  >
                    🗺️ Cómo Llegar
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ MÁS TAB ═══ */}
        {tab === "mas" && (
          <div className="space-y-4 animate-slide-up">
            {/* Nosotros */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <div className="w-16 h-16 mx-auto relative">
                <Image src={LOGO} alt="El Huarachón" fill className="object-contain" sizes="64px" />
              </div>
              <h2 className="text-center font-bold font-[var(--font-montserrat)]">Tradición en Mexicali</h2>
              <p className="text-xs text-white/50 leading-relaxed text-center">
                El Huarachón nace en 1976 en Mexicali, Baja California. Nos abrimos camino con persistencia, soluciones y ganas de crecer llevando la cultura mexicana en nuestros platillos. Después de 47 años seguimos diciéndole al cliente: &quot;Están en su casa, siéntanse cómodos&quot;.
              </p>
            </div>

            {/* Photo Gallery */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <div className="font-bold text-sm">#huarafans</div>
              <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
                {FOOD_PHOTOS.map((src, i) => (
                  <div key={i} className="aspect-square relative">
                    <Image src={src} alt={`Huarachón foto ${i + 1}`} fill className="object-cover hover:scale-110 transition-transform duration-500" sizes="120px" />
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <div className="font-bold text-sm">Síguenos</div>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/AsaderoElHuarachon" target="_blank" rel="noopener noreferrer"
                   className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2]/20 hover:bg-[#1877F2] rounded-xl py-3 text-sm font-bold transition-all hover:text-white text-[#1877F2]">
                  📘 Facebook
                </a>
                <a href="https://www.instagram.com/huarachonmxli/" target="_blank" rel="noopener noreferrer"
                   className="flex-1 flex items-center justify-center gap-2 bg-[#E4405F]/20 hover:bg-[#E4405F] rounded-xl py-3 text-sm font-bold transition-all hover:text-white text-[#E4405F]">
                  📸 Instagram
                </a>
              </div>
            </div>

            {/* App Download CTA */}
            <div className="glass rounded-2xl p-5 text-center space-y-2">
              <div className="text-2xl">📱</div>
              <div className="font-bold text-sm">¿Quieres la experiencia completa?</div>
              <p className="text-xs text-white/40">Descarga la app para widgets, escaneo QR con cámara, notificaciones y más.</p>
              <button className="bg-huara-gold/20 hover:bg-huara-gold text-huara-gold hover:text-black px-6 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 mt-2">
                Próximamente en App Store y Google Play
              </button>
            </div>
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
            { key: "mas" as Tab, icon: "☰", label: "Más" },
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
