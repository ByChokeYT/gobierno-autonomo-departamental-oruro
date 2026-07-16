import React from 'react'

export default function LandingView({ onNavigate, onOpenAuth }) {
  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      
      {/* ─── HERO SECTION PRINCIPAL ─── */}
      <section className="relative rounded-3xl border border-amber-500/10 overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-8 md:p-14 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
            Gobierno Autónomo Departamental de Oruro
          </span>
          <h1 className="text-white font-black text-3xl md:text-5xl tracking-tight leading-[1.1] font-display">
            Plataforma Oficial de Fomento Comercial <span className="text-amber-500 block mt-2">MarketOruro</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            Un espacio público y gratuito diseñado para conectar de manera directa a los productores agrícolas, ganaderos y artesanos del Altiplano orureño con compradores de todo el país, eliminando intermediarios y maximizando el valor del trabajo rural.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
            <button
              onClick={() => onNavigate('marketplace')}
              className="bg-amber-600 hover:bg-amber-500 active:scale-98 text-black font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-amber-950/20 flex items-center gap-2 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.25A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V15.75a2.25 2.25 0 0 1 2.25-2.25Zm0-4.5h18A2.25 2.25 0 0 0 21 9V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
              Explorar Catálogo de Oferta
            </button>
            <button
              onClick={onOpenAuth}
              className="bg-neutral-800 hover:bg-neutral-700 active:scale-98 text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all border border-neutral-750 flex items-center gap-2 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235A8.902 8.902 0 0 1 9 18c2.285 0 4.39.862 5.995 2.277L14.462 21H3v-1.765Z" /></svg>
              Registrarme como Productor
            </button>
          </div>
        </div>

        {/* Gráfico/Elemento decorativo premium del Altiplano */}
        <div className="shrink-0 w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-amber-500/10 to-orange-500/5 border border-white/5 relative flex items-center justify-center shadow-inner">
          <div className="absolute w-40 h-40 rounded-full bg-amber-500/5 blur-2xl animate-pulse" />
          <div className="text-center relative z-10 space-y-3.5 select-none w-full px-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-20 h-20 text-amber-500 mx-auto animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-4.5L9 5.25l5.25 11.25M12 16.5 16.5 7.5 21 16.5" />
            </svg>
            <p className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest leading-none">Sajama - Oruro</p>
          </div>
        </div>
      </section>

      {/* ─── INDICADORES CLAVE (KPIs / STATS) ─── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl text-center space-y-1.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
          <p className="text-amber-500 font-black text-3xl font-display">0%</p>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider">Comisión Comercial</h3>
          <p className="text-neutral-500 text-[11px]">Tratos de venta directos sin intermediación ni retenciones.</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl text-center space-y-1.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 rounded-full blur-xl" />
          <p className="text-sky-400 font-black text-3xl font-display">16</p>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider">Provincias Unidas</h3>
          <p className="text-neutral-500 text-[11px]">Integración digital de municipios y marcas locales de Oruro.</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl text-center space-y-1.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
          <p className="text-emerald-400 font-black text-3xl font-display">24/7</p>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider">Catálogo Abierto</h3>
          <p className="text-neutral-500 text-[11px]">Exposición continua de productos agrícolas y camélidos.</p>
        </div>
      </section>

      {/* ─── CÓMO FUNCIONA EL SISTEMA ─── */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">FLUJO DE OPERACIÓN</span>
          <h2 className="text-white font-extrabold text-2xl tracking-tight font-display">¿Cómo funciona MarketOruro?</h2>
          <p className="text-neutral-400 text-xs">Un proceso simplificado en tres pasos para compradores y productores.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-3 relative">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm border border-amber-500/20">1</span>
            <h3 className="text-white font-bold text-sm">Registro de Productor</h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Crea tu cuenta de forma gratuita con tu correo o tu cuenta de Google. Introduce tu municipio de origen y tu número de contacto de WhatsApp.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-3 relative">
            <span className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-sm border border-orange-500/20">2</span>
            <h3 className="text-white font-bold text-sm">Publicación de Anuncio</h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Describe tus productos agrícolas (como Quinua Real Roja), camélidos o textiles de alpaca. Define el precio por unidad y sube imágenes representativas.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-3 relative">
            <span className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold text-sm border border-sky-500/20">3</span>
            <h3 className="text-white font-bold text-sm">Contacto Directo</h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Los compradores exploran el catálogo público y, mediante un clic, abren un chat de WhatsApp o te llaman directamente al celular registrado.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN RUBROS DESTACADOS ─── */}
      <section className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-white font-black text-lg tracking-tight font-display">Categorías de Producción</h3>
            <p className="text-neutral-400 text-xs mt-0.5">Explora los sectores productivos impulsados por el Departamento de Oruro.</p>
          </div>
          <button 
            onClick={() => onNavigate('marketplace')}
            className="text-amber-500 hover:text-amber-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            Ver catálogo completo ➔
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/50 rounded-2xl p-4 transition-all text-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-amber-500 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V10m0 0a4 4 0 0 1 4-4h2m-6 4a4 4 0 0 0-4-4H6m6 10a4 4 0 0 1 4-4h1M12 16a4 4 0 0 0-4-4H7" />
            </svg>
            <h4 className="text-white font-bold text-xs">Quinua Real</h4>
            <span className="text-[10px] text-neutral-500 block leading-tight">Cultivada en el salar</span>
          </div>

          <div className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/50 rounded-2xl p-4 transition-all text-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-orange-500 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
            <h4 className="text-white font-bold text-xs">Camélidos</h4>
            <span className="text-[10px] text-neutral-500 block leading-tight">Carne y derivados</span>
          </div>

          <div className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/50 rounded-2xl p-4 transition-all text-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-sky-500 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 21V3m12 18V3M9 6h6m-6 6h6m-6 6h6" />
            </svg>
            <h4 className="text-white font-bold text-xs">Textiles</h4>
            <span className="text-[10px] text-neutral-500 block leading-tight">Fibra fina de alpaca</span>
          </div>

          <div className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/50 rounded-2xl p-4 transition-all text-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-rose-400 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21V9.75M3.284 14.253A8.964 8.964 0 0112 3c4.168 0 7.747 2.836 8.716 6.747m-17.432 4.506l17.43 0" />
            </svg>
            <h4 className="text-white font-bold text-xs">Artesanía</h4>
            <span className="text-[10px] text-neutral-500 block leading-tight">Identidad y cultura</span>
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION INSTITUCIONAL ─── */}
      <section className="text-center py-6 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 rounded-3xl p-8 space-y-4">
        <h3 className="text-white font-black text-xl md:text-2xl font-display">¿Listo para impulsar tu producción?</h3>
        <p className="text-neutral-400 text-xs max-w-lg mx-auto leading-relaxed">
          Si eres productor rural en Oruro y posees autorización o produces de forma artesanal, únete a la red digital comercial y expón tu catálogo al país.
        </p>
        <div className="pt-2">
          <button 
            onClick={onOpenAuth}
            className="bg-amber-600 hover:bg-amber-500 active:scale-98 text-black font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 8.41m5.96 5.96a14.96 14.96 0 0 1-5.96-5.96m0 0a14.96 14.96 0 0 0-6.16 12.12A14.98 14.98 0 0 0 9.63 8.41m0 0H3.75v5.84h5.88v-5.84Z" /></svg>
            Crear Cuenta Gratis
          </button>
        </div>
      </section>

    </div>
  )
}
