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
import { supabase } from "../lib/supabase";
import { registerPushNotifications } from "../lib/notifications";
import { trackUserInsight } from "../lib/insights";
import { getHuaraResponse } from "../lib/gemini";
import ChatBot from "../components/ChatBot";

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

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("splash");
  const [tab, setTab] = useState<Tab>("home");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [showChat, setShowChat] = useState(false);

  /* ─── Supabase Unification ─── */
  useEffect(() => {
    // 1. Handle Auth State
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        syncProfile(session.user.id, session.user.email!);
      }
      // Always cleanup hash if present (regardless of session validity)
      if (window.location.hash) {
        // Delay slightly to allow auth library to read hash if needed
        setTimeout(() => {
          if (window.location.hash) {
            window.history.replaceState(null, "", window.location.pathname);
          }
        }, 500);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        syncProfile(session.user.id, session.user.email!);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setScreen("login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncProfile = async (id: string, email: string) => {
    // Pull from Supabase (Unifies with Mobile App)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    let finalUser: UserProfile | null = null;

    if (profile) {
      finalUser = {
        id,
        name: profile.full_name || "Huarafan",
        email: email,
        tier: profile.tier || HuaraTier.BRONCE,
        balance: profile.balance || 128.5,
        visitCount: profile.visit_count || 0,
        referralCode: profile.referral_code || "HUARA-WEB",
        favoriteIds: [],
        hasSeenOnboarding: true,
        notifOffers: true,
        notifOrders: true,
      };
    } else {
      // Create profile if missing
      const newProfile = {
        id,
        full_name: email.split('@')[0],
        balance: 100, // Welcome points
        tier: HuaraTier.BRONCE,
      };
      await supabase.from('profiles').insert(newProfile);
      finalUser = {
        id,
        name: email.split('@')[0],
        email,
        tier: HuaraTier.BRONCE,
        balance: 100,
        visitCount: 0,
        referralCode: "HUARA-NEW",
        favoriteIds: [],
        hasSeenOnboarding: true,
        notifOffers: true,
        notifOrders: true,
      };
    }

    setUser(finalUser);
    if (id) registerPushNotifications(id);

    // Fetch synced orders
    const { data: history } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });
    
    if (history) setOrders(history as any);

    // 🚀 NEW: If the splash is ALREADY GONE, but we just got the user, move to app!
    // This fixed the redirect hang.
    setScreen((current) => {
      if (current === "login" || current === "onboarding") return "app";
      return current;
    });
  };

  const handleSplashDone = () => {
    // Check local storage for onboarding
    const seen = localStorage.getItem("huara_onboarding");
    
    if (user) {
      setScreen("app");
    } else if (seen) {
      setScreen("login");
    } else {
      setScreen("onboarding");
    }
  };

  const handleOnboardingDone = () => {
    localStorage.setItem("huara_onboarding", "true");
    setScreen("login");
  };

  const handleLogin = (u: UserProfile) => {
    // Handled by Supabase onAuthStateChange
    setScreen("app"); 
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /* ─── Order flow (simulates POS pipeline) ─── */
  const handlePlaceOrder = useCallback(async (order: Order) => {
    setActiveOrder(order);
    if (user) trackUserInsight(user.id, 'add_to_cart', { order_id: order.id, total: order.total, items: order.items.length });
    
    // Unify: Save to Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('orders').insert({
        user_id: session.user.id,
        branch: order.branch,
        total: order.total,
        items: order.items,
        status: order.status,
      });

      // Update user points + visits in Supabase
      if (user) {
        const newVisits = user.visitCount + 1;
        const newBalance = user.balance + order.pointsEarned;
        const newTier = calcTier(newVisits);
        
        await supabase.from('profiles').update({
          balance: newBalance,
          visit_count: newVisits,
          tier: newTier,
        }).eq('id', session.user.id);

        setUser({ ...user, visitCount: newVisits, balance: newBalance, tier: newTier });
      }
    }

    setOrders((prev) => [order, ...prev.slice(0, 19)]);

    // Simulate order status progression logic...
    const advance = (status: OrderStatus, delay: number) => {
      setTimeout(() => {
        setActiveOrder((prev) => prev ? { ...prev, status } : null);
        setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status } : o));
      }, delay);
    };
    advance(OrderStatus.PREPARING, 8000);
    advance(OrderStatus.READY, 20000);
  }, [user]);

  const handleMarkComplete = useCallback((orderId: string) => {
    setActiveOrder(null);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: OrderStatus.COMPLETED } : o));
  }, []);

  /* ─── QR scan → earn points ─── */
  const handleScanQr = useCallback(async (decodedText: string) => {
    if (!user) return;
    trackUserInsight(user.id, 'view_item', { action: 'qr_scan', code: decodedText.slice(0, 30) });
    let points = 0;
    const manual = decodedText.match(/ADD[_-]?(\d+)/i);
    if (manual) points = parseInt(manual[1]);
    else points = 30;

    if (points > 0) {
      const newBalance = user.balance + points;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('profiles').update({ balance: newBalance }).eq('id', session.user.id);
      }
      setUser({ ...user, balance: newBalance });
    }
  }, [user]);

  /* ─── Rewards ─── */
  const handleRedeem = useCallback(async (item: RewardItem) => {
    if (!user) return;
    const newBalance = user.balance - item.pointsCost;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('profiles').update({ balance: newBalance }).eq('id', session.user.id);
    }
    setUser({ ...user, balance: newBalance });
  }, [user]);

  /* ─── Social share ─── */
  const handleShare = useCallback(async () => {
    if (!user) return;
    trackUserInsight(user.id, 'view_promo', { action: 'social_share' });
    const today = new Date().toDateString();
    if (user.lastShareDate === today) return;
    
    const newBalance = user.balance + 20;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('profiles').update({ 
        balance: newBalance,
        last_share_date: today 
      }).eq('id', session.user.id);
    }
    setUser({ ...user, balance: newBalance, lastShareDate: today });
    if (navigator.share) {
      navigator.share({ title: "El Huarachón", text: "¡El mejor taquero de Mexicali! 🌮", url: "https://taqueriaelhuarachon.com" });
    }
  }, [user]);

  /* ─── Update user fields ─── */
  const handleUpdateUser = useCallback(async (patch: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...patch };
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('profiles').update({
        full_name: updated.name,
      }).eq('id', session.user.id);
    }
    setUser(updated);
  }, [user]);

  /* ─── Render ─── */
  return (
    <div
      className="min-h-screen relative md:flex"
      style={{ background: "#121212" }}
    >
      {/* 💻 Desktop Sidebar Nav */}
      {screen === "app" && (
        <aside className="hidden md:flex flex-col w-64 bg-[#0A0A0A] border-r border-white/5 p-6 h-screen sticky top-0">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-[#E31B23]">
              <img src="/logo.webp" alt="logo" className="w-6 h-6 object-contain" />
            </div>
            <h1 className="text-xl font-black text-white">Huarafans</h1>
          </div>
          
          <nav className="flex-1 flex flex-col gap-2">
            {TABS.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all group"
                style={{
                  background: tab === id ? "rgba(227, 27, 35, 0.1)" : "transparent",
                  color: tab === id ? "#E31B23" : "rgba(255,255,255,0.5)"
                }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
                <span className="font-semibold">{label}</span>
                {tab === id && <motion.div layoutId="nav-pill" className="ml-auto w-1 h-4 rounded-full bg-[#E31B23]" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
             <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-white/30 hover:text-white transition-colors">
               <span>🚪</span>
               <span className="font-medium">Cerrar Sesión</span>
             </button>
          </div>
        </aside>
      )}

      <main className="flex-1 max-w-sm md:max-w-none mx-auto w-full relative">
        <AnimatePresence mode="wait">
          {screen === "splash" && (
            <motion.div key="splash" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <SplashPage onDone={handleSplashDone} />
            </motion.div>
          )}

          {screen === "onboarding" && (
            <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <OnboardingPage onDone={handleOnboardingDone} />
            </motion.div>
          )}

          {screen === "login" && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
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
              <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "env(safe-area-inset-bottom, 72px)" }}>
                <div className="max-w-5xl mx-auto md:p-8">
                  <AnimatePresence mode="wait">
                    {tab === "home" && (
                      <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <HomePage
                          user={user}
                          activeOrder={activeOrder}
                          recentOrders={orders}
                          onNavigate={(v) => setTab(v as Tab)}
                          onMarkOrderComplete={handleMarkComplete}
                          onShareForPoints={handleShare}
                          onScanQr={handleScanQr}
                          onLogout={handleLogout}
                        />
                      </motion.div>
                    )}
                    {tab === "menu" && (
                      <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="md:h-auto flex flex-col">
                        <MenuPage
                          user={user}
                          branches={BRANCHES}
                          onPlaceOrder={handlePlaceOrder}
                        />
                      </motion.div>
                    )}
                    {tab === "rewards" && (
                      <motion.div key="rewards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <RewardsPage user={user} onRedeem={handleRedeem} />
                      </motion.div>
                    )}
                    {tab === "locations" && (
                      <motion.div key="locations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <LocationsPage branches={BRANCHES} />
                      </motion.div>
                    )}
                    {tab === "profile" && (
                      <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
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
              </div>

              {/* 📱 Mobile Bottom nav (hidden on md) */}
              <nav
                className="fixed bottom-0 left-0 w-full md:hidden flex items-center justify-around px-2 pt-2 pb-safe z-30"
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
      </main>

      {/* ── Floating Huara-Concierge Button (always visible in-app) ── */}
      {screen === "app" && (
        <>
          <button
            onClick={() => setShowChat(true)}
            className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-2xl transition-transform active:scale-90"
            style={{ background: "linear-gradient(135deg, #E31B23, #B01217)" }}
            title="Huara-Concierge"
          >
            🌮
          </button>
          <AnimatePresence>
            {showChat && <ChatBot onClose={() => setShowChat(false)} />}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
