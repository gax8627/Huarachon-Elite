"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { UserProfile, Order, Branch } from "../types";
import { HuaraTier, OrderStatus } from "../types";
import type { RewardItem } from "../types";

import SplashPage from "../components/SplashPage";
import OnboardingPage from "../components/OnboardingPage";
import LoginPage from "../components/LoginPage";
import HomePage from "../components/HomePage";
import MenuPage from "../components/MenuPage";
import RewardsPage from "../components/RewardsPage";
import LocationsPage from "../components/LocationsPage";
import ProfilePage from "../components/ProfilePage";

/* ─── Branches (real Mexicali locations) ─── */
const BRANCHES: Branch[] = [
  {
    id: "independencia",
    name: "Independencia",
    address: "Calz Independencia 303, Insurgentes Este, 21280 Mexicali, B.C.",
    phones: ["(686) 567 9254", "(686) 567 3460"],
    hours: "Lun–Jue: 11am–1am · Vie–Sáb: 11am–4am",
    mapsQuery: "Calz+Independencia+303+Mexicali",
  },
  {
    id: "gomez-morin",
    name: "Gómez Morín",
    address: "Calz. Manuel Gómez Morín 392, Las Hadas, 21216 Mexicali, B.C.",
    phones: ["(686) 566 9595"],
    hours: "Lun–Dom: 11am–11pm",
    mapsQuery: "Calz+Manuel+Gomez+Morin+392+Mexicali",
  },
  {
    id: "lazaro-cardenas",
    name: "Lázaro Cárdenas",
    address: "Blvd. Lázaro Cárdenas #701 Esq. Lago Chad, Jardines del Lago, Mexicali, B.C.",
    phones: ["(686) 557 2223"],
    hours: "Lun–Dom: 11am–12am",
    mapsQuery: "Blvd+Lazaro+Cardenas+701+Mexicali",
  },
];

/* ─── Tier logic (matches Flutter) ─── */
function calcTier(visits: number): HuaraTier {
  if (visits >= 25) return HuaraTier.ORO;
  if (visits >= 10) return HuaraTier.PLATA;
  return HuaraTier.BRONCE;
}

/* ─── Bottom nav tabs ─── */
const TABS = [
  { id: "home", icon: "🏠", label: "Inicio" },
  { id: "menu", icon: "🌮", label: "Menú" },
  { id: "rewards", icon: "⭐", label: "Puntos" },
  { id: "locations", icon: "📍", label: "Sucursales" },
  { id: "profile", icon: "👤", label: "Perfil" },
] as const;

type Tab = typeof TABS[number]["id"];
type AppScreen = "splash" | "onboarding" | "login" | "app";

const LS_USER = "huara_user_v2";
const LS_ORDERS = "huara_orders_v2";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("splash");
  const [tab, setTab] = useState<Tab>("home");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  /* ─── Persist ─── */
  useEffect(() => {
    const u = localStorage.getItem(LS_USER);
    const o = localStorage.getItem(LS_ORDERS);
    if (u) setUser(JSON.parse(u));
    if (o) setOrders(JSON.parse(o));
  }, []);

  const saveUser = useCallback((u: UserProfile) => {
    setUser(u);
    localStorage.setItem(LS_USER, JSON.stringify(u));
  }, []);

  const saveOrders = useCallback((o: Order[]) => {
    setOrders(o);
    localStorage.setItem(LS_ORDERS, JSON.stringify(o));
  }, []);

  /* ─── Auth flow ─── */
  const handleSplashDone = () => {
    const u = localStorage.getItem(LS_USER);
    if (u) {
      const parsed = JSON.parse(u) as UserProfile;
      setUser(parsed);
      setScreen("app");
    } else {
      setScreen("onboarding");
    }
  };

  const handleOnboardingDone = () => setScreen("login");

  const handleLogin = (u: UserProfile) => {
    saveUser(u);
    setScreen("app");
  };

  const handleLogout = () => {
    localStorage.removeItem(LS_USER);
    setUser(null);
    setTab("home");
    setScreen("login");
  };

  /* ─── Order flow (simulates POS pipeline) ─── */
  const handlePlaceOrder = useCallback((order: Order) => {
    setActiveOrder(order);
    const updated = [order, ...orders].slice(0, 20);
    saveOrders(updated);

    // Update user points + visits
    if (user) {
      const newVisits = user.visitCount + 1;
      const newBalance = user.balance + order.pointsEarned;
      const newTier = calcTier(newVisits);
      const updatedUser = { ...user, visitCount: newVisits, balance: newBalance, tier: newTier };
      saveUser(updatedUser);
    }

    // Simulate order status progression
    const advance = (status: OrderStatus, delay: number) => {
      setTimeout(() => {
        setActiveOrder((prev) => prev ? { ...prev, status } : null);
        setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status } : o));
      }, delay);
    };
    advance(OrderStatus.PREPARING, 8000);
    advance(OrderStatus.READY, 20000);
  }, [orders, user, saveOrders, saveUser]);

  const handleMarkComplete = useCallback((orderId: string) => {
    setActiveOrder(null);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: OrderStatus.COMPLETED } : o));
  }, []);

  /* ─── Rewards ─── */
  const handleRedeem = useCallback((item: RewardItem) => {
    if (!user) return;
    const updated = { ...user, balance: user.balance - item.pointsCost };
    saveUser(updated);
  }, [user, saveUser]);

  /* ─── Social share ─── */
  const handleShare = useCallback(() => {
    if (!user) return;
    const today = new Date().toDateString();
    if (user.lastShareDate === today) return;
    const updated = { ...user, balance: user.balance + 20, lastShareDate: today };
    saveUser(updated);
    if (navigator.share) {
      navigator.share({ title: "El Huarachón", text: "¡El mejor taquero de Mexicali! 🌮", url: "https://taqueriaelhuarachon.com" });
    }
  }, [user, saveUser]);

  /* ─── Update user fields ─── */
  const handleUpdateUser = useCallback((patch: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...patch };
    saveUser(updated);
  }, [user, saveUser]);

  /* ─── Render ─── */
  return (
    <div
      className="min-h-screen max-w-sm mx-auto relative"
      style={{ background: "#121212" }}
    >
      <AnimatePresence mode="wait">
        {screen === "splash" && (
          <motion.div key="splash" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SplashPage onDone={handleSplashDone} />
          </motion.div>
        )}

        {screen === "onboarding" && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OnboardingPage onDone={handleOnboardingDone} />
          </motion.div>
        )}

        {screen === "login" && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoginPage onLogin={handleLogin} />
          </motion.div>
        )}

        {screen === "app" && user && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen"
          >
            {/* Page content */}
            <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "72px" }}>
              <AnimatePresence mode="wait">
                {tab === "home" && (
                  <motion.div key="home" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    <HomePage
                      user={user}
                      activeOrder={activeOrder}
                      recentOrders={orders}
                      onNavigate={(v) => setTab(v as Tab)}
                      onMarkOrderComplete={handleMarkComplete}
                      onShareForPoints={handleShare}
                      onLogout={handleLogout}
                    />
                  </motion.div>
                )}
                {tab === "menu" && (
                  <motion.div key="menu" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-screen flex flex-col">
                    <MenuPage
                      user={user}
                      branches={BRANCHES}
                      onPlaceOrder={handlePlaceOrder}
                    />
                  </motion.div>
                )}
                {tab === "rewards" && (
                  <motion.div key="rewards" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    <RewardsPage user={user} onRedeem={handleRedeem} />
                  </motion.div>
                )}
                {tab === "locations" && (
                  <motion.div key="locations" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    <LocationsPage branches={BRANCHES} />
                  </motion.div>
                )}
                {tab === "profile" && (
                  <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    <ProfilePage
                      user={user}
                      orders={orders}
                      onUpdateUser={handleUpdateUser}
                      onLogout={handleLogout}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom nav */}
            <nav
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm flex items-center justify-around px-2 pt-2 pb-safe z-30"
              style={{
                background: "rgba(18,18,18,0.95)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                paddingBottom: "max(12px, env(safe-area-inset-bottom))",
              }}
            >
              {TABS.map(({ id, icon, label }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all"
                    style={{ minWidth: "52px" }}
                  >
                    <span
                      className="text-xl transition-transform"
                      style={{ transform: active ? "scale(1.15)" : "scale(1)" }}
                    >
                      {icon}
                    </span>
                    <span
                      className="text-xs font-medium transition-colors"
                      style={{ color: active ? "#E31B23" : "rgba(255,255,255,0.3)" }}
                    >
                      {label}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="nav-dot"
                        className="w-1 h-1 rounded-full"
                        style={{ background: "#E31B23" }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
