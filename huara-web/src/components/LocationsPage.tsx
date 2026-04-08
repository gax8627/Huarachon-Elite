"use client";
import { motion } from "framer-motion";
import type { Branch } from "../types";

interface Props {
  branches: Branch[];
}

export default function LocationsPage({ branches }: Props) {
  return (
    <div className="flex flex-col px-4 pt-4 pb-24 gap-4">
      <h1 className="text-white font-black text-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
        Sucursales
      </h1>
      <p className="text-white/40 text-sm -mt-2">{branches.length} ubicaciones en Mexicali</p>

      {branches.map((branch, i) => (
        <motion.div
          key={branch.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Map embed */}
          <div className="h-40 w-full overflow-hidden relative">
            <iframe
              title={branch.name}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(branch.address)}&z=15&output=embed`}
            />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent 60%, #1a1a1a)" }} />
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-bold">{branch.name}</p>
                <p className="text-white/50 text-xs mt-1">{branch.address}</p>
              </div>
              <span
                className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ml-3"
                style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}
              >
                Abierto
              </span>
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span>🕐</span>
                <span>{branch.hours}</span>
              </div>
              {branch.phones.map((phone) => (
                <div key={phone} className="flex items-center gap-2 text-xs text-white/50">
                  <span>📞</span>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{phone}</a>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white text-center transition-transform active:scale-95"
                style={{ background: "#E31B23" }}
              >
                📍 Cómo llegar
              </a>
              <a
                href={`tel:${branch.phones[0]?.replace(/\s/g, "")}`}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white text-center transition-transform active:scale-95"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                📞 Llamar
              </a>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Info card */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.15)" }}
      >
        <span className="text-xl mt-0.5">ℹ️</span>
        <div>
          <p className="text-white font-semibold text-sm">¿No encuentras tu sucursal?</p>
          <p className="text-white/50 text-xs mt-1">Próximamente más ubicaciones. Síguenos en Instagram para enterarte primero.</p>
        </div>
      </div>
    </div>
  );
}
