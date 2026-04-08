"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QrScanner({ onScanSuccess, onClose }: QrScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
  }, []);

  useEffect(() => {
    const qrRegionId = "qr-reader";
    
    // Config
    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    const scanner = new Html5Qrcode(qrRegionId);
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        onScanSuccess(decodedText);
        stopScanner();
      },
      () => {
        // Silently ignore most common errors like "No QR code found"
      }
    ).catch(err => {
      console.error("Camera start error:", err);
      setError("No se pudo acceder a la cámara. Verifica los permisos.");
    });

    return () => {
      stopScanner();
    };
  }, [onScanSuccess, stopScanner]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all animate-fade-in">
      <div className="relative w-full max-w-md glass-strong rounded-3xl overflow-hidden shadow-2xl border border-white/10 p-6 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold font-(--font-montserrat) text-white flex items-center gap-2">
            <span className="text-huara-gold italic">Elite</span> Scanner
          </h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Scanner Region */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/5 mb-6">
          {!error && <div id="qr-reader" className="w-full h-full"></div>}
          
          {/* Scanning Overlay (Aesthetic) - Hidden if error */}
          {!error && (
            <div className="absolute inset-0 pointer-events-none border-2 border-transparent">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border-2 border-huara-gold/50 rounded-2xl">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-huara-gold rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-huara-gold rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-huara-gold rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-huara-gold rounded-br-xl"></div>
                  
                  {/* Animated Line */}
                  <div className="absolute inset-x-0 h-1 bg-huara-gold/40 shadow-[0_0_15px_rgba(255,193,7,0.5)] animate-scan-line"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-8 text-center space-y-4">
               <div className="w-16 h-16 rounded-full bg-huara-red/20 flex items-center justify-center text-2xl animate-pulse">⚠️</div>
               <div className="space-y-1">
                 <p className="text-huara-red font-bold text-sm">Cámara no disponible</p>
                 <p className="text-white/40 text-[10px]">Ingresa tu Huara-Código manualmente</p>
               </div>
               
               <div className="w-full space-y-2">
                 <input 
                   type="text"
                   placeholder="Código (ej. ADD_20)"
                   value={manualCode}
                   onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                   onKeyDown={(e) => e.key === 'Enter' && manualCode && onScanSuccess(`HUARA:${manualCode}:AUTO_M2_FALLBACK`)}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-sm outline-none focus:border-huara-gold/40 transition-colors uppercase"
                 />
                 <button 
                   onClick={() => onScanSuccess(`HUARA:${manualCode}:AUTO_M2_FALLBACK`)}
                   disabled={!manualCode}
                   className="w-full bg-huara-gold/20 hover:bg-huara-gold text-huara-gold hover:text-black disabled:opacity-20 py-3 rounded-xl text-xs font-bold transition-all"
                 >
                   Validar Código ✨
                 </button>
               </div>
            </div>
          )}
        </div>

        <p className="text-white/40 text-xs text-center leading-relaxed max-w-[280px]">
          Coloca el código QR del ticket dentro del recuadro para sumar tus 
          <span className="text-huara-gold font-bold"> Huara-Puntos</span> de hoy.
        </p>

        {/* Simulation (Mirroring Flutter Dev Tool) */}
        <button 
          onClick={() => onScanSuccess("HUARA-20-MXL")}
          className="mt-6 text-[10px] text-white/20 hover:text-huara-gold/50 transition-colors uppercase tracking-widest"
        >
          [ Simular Escaneo ]
        </button>
      </div>
    </div>
  );
}
