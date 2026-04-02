import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen selection:bg-huara-gold selection:text-black">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-huara-red/20 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-huara-gold/10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full px-6 py-4 glass border-b-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-huara-red rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-huara-red/20">H</div>
            <span className="font-bold text-xl tracking-tight uppercase">Huarachón <span className="text-huara-gold italic">Elite</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#menu" className="hover:text-huara-gold transition-colors">Menú</a>
            <a href="#rewards" className="hover:text-huara-gold transition-colors">Huarafans</a>
            <a href="#sucursales" className="hover:text-huara-gold transition-colors">Sucursales</a>
          </div>
          <button className="bg-huara-red hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-huara-red/30">
            Pide Ahora
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full glass border-huara-gold/30 text-huara-gold text-xs font-bold tracking-widest uppercase mb-4">
              🔥 Los Tacos más rápidos de Mexicali
            </div>
            <h1 className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tight">
              Sabor que <br />
              <span className="text-gradient">Enciende el</span> <br />
              Desierto.
            </h1>
            <p className="text-xl text-white/60 max-w-lg leading-relaxed">
              Tradición, velocidad y el mejor sazón cachanilla. Únete hoy a la comunidad Huarafan y gana premios en cada mordida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-huara-gold hover:scale-105 transition-all group">
                Descarga la App
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button className="glass px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border-white/10">
                Ver Menú
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-huara-red/20 blur-[80px] rounded-full animate-pulse" />
            <div className="relative glass p-4 rounded-[40px] border-white/10 rotate-3 hover:rotate-0 transition-transform duration-700">
              <Image 
                src="https://tb-static.uber.com/prod/image-proc/processed_images/4f9785b356ab7307f08fb08e199e5d9f/c67fc65e9b4e16a553eb7574fba090f1.jpeg"
                alt="Súper Huarachón"
                width={800}
                height={600}
                className="rounded-[32px] object-cover"
                priority
              />
              <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl border-huara-gold/20 shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
                <span className="block text-huara-gold font-black text-2xl">🌟 10k+</span>
                <span className="text-xs text-white/60 font-medium italic">Huarafans Felices</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Highlight */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold italic">Digital Loyalty <span className="text-huara-red text-6xl">Elite</span></h2>
            <p className="text-white/40">Gana puntos, sube de nivel y desbloquea beneficios exclusivos.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Bronce', bonus: '2% Cashback', icon: '🥉' },
              { title: 'Plata', bonus: '8% Cashback', icon: '🥈' },
              { title: 'Oro', bonus: '12% Cashback', icon: '🥇' },
            ].map((tier, idx) => (
              <div key={idx} className="glass p-8 rounded-3xl group hover:border-huara-gold/50 transition-all cursor-default">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{tier.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{tier.title}</h3>
                <p className="text-huara-gold font-bold">{tier.bonus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-white/20 text-sm">
        <p>© 2026 Taquería El Huarachón Mexicali. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
