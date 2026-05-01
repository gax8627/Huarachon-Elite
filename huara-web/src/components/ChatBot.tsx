"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHuaraResponse } from "../lib/gemini";

export default function ChatBot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "¡Hola Huarafan! Soy tu Huara-Concierge. ¿En qué te puedo ayudar hoy? ¡Qué chulada tenerte por aquí!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));
      const response = await getHuaraResponse(userMsg);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "¡Epa! No pude conectarme. ¿Lo intentamos de nuevo?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#121212]"
    >
      <header className="p-6 flex items-center justify-between border-b border-white/5">
        <h2 className="text-xl font-bold text-[#E31B23]">Huara-Concierge</h2>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full">✕</button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-[80%] p-4 rounded-2xl ${
                m.role === "user" 
                ? "bg-[#E31B23] text-white" 
                : "bg-white/5 text-white/90 border border-white/5"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-white/30">Huara-Concierge está pensando...</div>}
      </div>

      <div className="p-6 bg-[#1A1A1A]">
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Dime algo chulada..."
            className="flex-1 bg-white/5 border-none rounded-xl px-4 py-3 text-white outline-none focus:ring-1 ring-[#E31B23]/50"
          />
          <button 
            onClick={handleSend}
            className="bg-[#E31B23] text-white px-4 py-3 rounded-xl font-bold"
          >
            Enviar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
