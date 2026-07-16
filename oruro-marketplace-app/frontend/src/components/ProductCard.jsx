import React from 'react'
import { BADGE_STYLES } from '../constants/marketData'

export default function ProductCard({ 
  product, 
  onContact, 
  isAdminView, 
  onModerate,
  isFavorite,
  onToggleFavorite,
  onShare,
  onSelectSeller
}) {
  const isSuspended = product.status === 'suspendido';

  return (
    <div 
      className={`group relative rounded-2xl overflow-hidden glass-panel glow-amber transition-all duration-300 flex flex-col justify-between ${
        isSuspended ? 'opacity-55 border-dashed border-red-500/30' : ''
      }`}
    >
      <div>
        {/* Card Header con Imagen */}
        <div className="relative h-32 xs:h-36 sm:h-48 w-full overflow-hidden bg-neutral-900/50 flex items-center justify-center">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : null}
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none" />
          
          {/* Badge del Estado del Producto */}
          <span className={`absolute top-2 left-2 sm:top-3 sm:left-3 text-[8px] sm:text-[10px] uppercase font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg backdrop-blur-md ${BADGE_STYLES[product.badgeColor || 'amber']}`}>
            {product.badge}
          </span>

          {/* Botones de Acción sobre la Imagen (Favorito y Compartir) */}
          {!isAdminView && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1.5 z-10">
              {/* Compartir */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onShare) { onShare(product); }
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-950/60 hover:bg-neutral-900 backdrop-blur-md border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-all active:scale-90 cursor-pointer"
                title="Compartir oferta"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186.011-.005a2.25 2.25 0 1 1 2.897 2.897l-.013-.005m-2.895-2.887L11.75 8.22M13.684 20.73l-2.684-1.397m2.684 1.397a2.25 2.25 0 1 0 0-2.186m0 2.186-.013-.005a2.25 2.25 0 1 1 2.897-2.897l-.011-.005M11 16.13l-2.684-1.397" /></svg>
              </button>

              {/* Favorito */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleFavorite) { onToggleFavorite(product.id); }
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-950/60 hover:bg-neutral-900 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  strokeWidth="2.5" 
                  stroke="currentColor" 
                  className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'fill-none text-neutral-300 hover:text-rose-400'}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>
          )}

          {/* Badge Administrativo (solo en modo admin/moderador) */}
          {isAdminView && (
            <span className={`absolute top-2 right-2 sm:top-3 sm:right-3 text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
              product.status === 'activo' ? 'bg-emerald-600/80 text-white' : 'bg-red-600/80 text-white'
            }`}>
              {product.status}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-5">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <span className="text-neutral-400 text-[10px] sm:text-xs flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              <span className="font-semibold text-neutral-300 truncate max-w-[80px] sm:max-w-none">{product.location}</span>
            </span>
          </div>

          <h3 className="text-white font-semibold text-xs sm:text-base leading-tight mb-1 sm:mb-2 tracking-tight group-hover:text-amber-400 transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-neutral-400 text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer / Precio */}
      <div className="p-3 sm:p-5 pt-0 mt-auto">
        <div className="flex flex-col xs:flex-row xs:items-end justify-between border-t border-white/5 pt-2 sm:pt-4 gap-2">
          <div>
            <span className="text-[8px] sm:text-[10px] text-neutral-500 uppercase tracking-widest font-semibold block mb-0.5">Precio Frecuente</span>
            <div className="flex items-baseline gap-0.5 sm:gap-1">
              <span className="text-amber-400 font-extrabold text-base sm:text-2xl tracking-tight">{product.price}</span>
              <span className="text-amber-500 text-[10px] sm:text-xs font-semibold">Bs</span>
              <span className="text-neutral-500 text-[8px] sm:text-[10px] ml-1">/ {product.unit}</span>
            </div>
          </div>

          {isAdminView ? (
            <div className="flex gap-1">
              {product.status === 'activo' ? (
                <button
                  onClick={() => onModerate(product.id, 'suspendido')}
                  className="bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-red-500/20 transition-all active:scale-95 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                  Suspender
                </button>
              ) : (
                <button
                  onClick={() => onModerate(product.id, 'activo')}
                  className="bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-emerald-500/20 transition-all active:scale-95 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  Activar
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => onContact(product)}
              className="bg-neutral-900 hover:bg-amber-600 hover:text-black text-amber-400 border border-amber-500/20 hover:border-transparent active:scale-95 font-bold text-[10px] sm:text-xs px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-amber-500/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 sm:w-3.5 sm:h-3.5 text-inherit"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H8.63v.01h-.005V9.75Zm5.625 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0h.01v.01h-.01V9.75Zm-3 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H11.3v.01h-.005V9.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 20.247 12 21a2 2 0 0 0 2-2v-.247a18.232 18.232 0 0 0 4.19-.949A2.25 2.25 0 0 0 21 15.688V9.75a2.25 2.25 0 0 0-2.81-2.185A18.18 18.18 0 0 0 12.006 6.75a18.18 18.18 0 0 0-6.195.815A2.25 2.25 0 0 0 3 9.75v5.938c0 1.09.78 2.02 1.848 2.204a18.236 18.236 0 0 0 4.153.905Z" /></svg>
              Contactar
            </button>
          )}
        </div>

        {/* Seller Info footer */}
        <div className="mt-2.5 flex items-center gap-1.5 text-neutral-500 text-[8px] sm:text-[10px] pt-2 border-t border-white/[0.02]">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-800/50 flex items-center justify-center text-amber-200 text-[8px] font-bold">
            {product.seller[0].toUpperCase()}
          </div>
          <button 
            onClick={() => onSelectSeller && onSelectSeller(product.seller)}
            className="truncate max-w-[80px] sm:max-w-none hover:underline hover:text-amber-500 text-left focus:outline-none transition-colors"
            title={`Ver todas las ofertas de ${product.seller}`}
          >
            {product.seller}
          </button>
        </div>
      </div>
    </div>
  )
}
