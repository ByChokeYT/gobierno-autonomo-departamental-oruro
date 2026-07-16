import React from 'react'
import { BADGE_STYLES } from '../constants/marketData'

export default function ContactModal({ product, onClose, onInteraction }) {
  if (!product) return null
  const waMessage = encodeURIComponent(`¡Hola! He visto tu publicación de "${product.title}" en la plataforma MarketOruro de la Gobernación. ¿Sigue disponible?`)
  const waLink = `https://wa.me/${product.phone}?text=${waMessage}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">✕</button>

        {/* Encabezado */}
        <div className="flex gap-4 items-start mb-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-800 shrink-0 border border-white/5">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${BADGE_STYLES[product.badgeColor || 'amber']}`}>
              {product.badge}
            </span>
            <h3 className="text-white font-bold text-base mt-1.5 leading-snug line-clamp-2">{product.title}</h3>
            <p className="text-amber-400 font-extrabold text-lg mt-0.5">{product.price} Bs <span className="text-neutral-500 text-xs font-normal">/ {product.unit}</span></p>
          </div>
        </div>

        {/* Ficha */}
        <div className="bg-neutral-950/50 rounded-2xl p-4 border border-white/5 mb-5 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-medium">Origen Agrícola:</span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-neutral-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              Municipio {product.location}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-medium">Productor Asociado:</span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-neutral-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
              {product.seller}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-medium">Nro. de Contacto:</span>
            <span className="text-amber-500 font-semibold">{product.phone}</span>
          </div>
        </div>

        {/* Mapa Simulado de Ubicación Regional */}
        <div className="mb-6 rounded-2xl bg-neutral-950/80 border border-neutral-800 overflow-hidden relative">
          <div className="h-28 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] flex flex-col items-center justify-center p-3 text-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white relative z-10" />
            <span className="text-[10px] text-emerald-400 font-black mt-2 tracking-widest uppercase">GEOLOCALIZACIÓN RURAL ACTIVA</span>
            <span className="text-[9px] text-neutral-500 mt-1 max-w-xs">{product.location}, Departamento de Oruro, Bolivia</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onInteraction(product.id, 'whatsapp')}
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-950/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H8.63v.01h-.005V9.75Zm5.625 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0h.01v.01h-.01V9.75Zm-3 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H11.3v.01h-.005V9.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 20.247 12 21a2 2 0 0 0 2-2v-.247a18.232 18.232 0 0 0 4.19-.949A2.25 2.25 0 0 0 21 15.688V9.75a2.25 2.25 0 0 0-2.81-2.185A18.18 18.18 0 0 0 12.006 6.75a18.18 18.18 0 0 0-6.195.815A2.25 2.25 0 0 0 3 9.75v5.938c0 1.09.78 2.02 1.848 2.204a18.236 18.236 0 0 0 4.153.905Z" /></svg>
            Chatear por WhatsApp
          </a>
          <a
            href={`tel:${product.phone}`}
            onClick={() => onInteraction(product.id, 'llamada')}
            className="flex items-center justify-center gap-2 w-full bg-neutral-800 hover:bg-neutral-700 active:scale-98 text-white font-bold text-sm py-3 rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.155-.44.01-1.21.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
            Llamar Directamente
          </a>
        </div>
      </div>
    </div>
  )
}
