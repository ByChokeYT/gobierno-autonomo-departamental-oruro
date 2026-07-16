import React, { useState, useMemo } from 'react'

export default function GovDashboardView({ products, interactions, onModerate }) {
  const [searchTerm, setSearchTerm] = useState('')

  // Métricas agregadas
  const metrics = useMemo(() => {
    const totalListings = products.length
    const activeListings = products.filter(p => p.status === 'activo').length
    const suspendedListings = products.filter(p => p.status === 'suspendido').length
    const totalProducers = new Set(products.map(p => p.seller)).size

    const waClicks = interactions.filter(i => i.type === 'whatsapp').length
    const callClicks = interactions.filter(i => i.type === 'llamada').length

    return {
      totalListings,
      activeListings,
      suspendedListings,
      totalProducers,
      waClicks,
      callClicks,
      totalContacts: waClicks + callClicks
    }
  }, [products, interactions])

  // Datos para gráficos
  const chartCategoryData = useMemo(() => {
    const map = { quinua: 0, camelidos: 0, textiles: 0, artesania: 0, otros: 0 }
    products.forEach(p => {
      if (map[p.category] !== undefined) map[p.category]++
      else map.otros++
    })
    return [
      { key: 'Quinua Real', value: map.quinua, color: '#f59e0b' },
      { key: 'Camélidos', value: map.camelidos, color: '#f97316' },
      { key: 'Textiles', value: map.textiles, color: '#0ea5e9' },
      { key: 'Artesanía', value: map.artesania, color: '#ec4899' },
      { key: 'Otros', value: map.otros, color: '#10b981' }
    ]
  }, [products])

  const chartMunicipalityData = useMemo(() => {
    const map = {}
    products.forEach(p => {
      map[p.location] = (map[p.location] || 0) + 1
    })
    return Object.entries(map).map(([mun, val]) => ({
      name: mun,
      value: val
    })).sort((a,b) => b.value - a.value).slice(0, 5)
  }, [products])

  // Filtrado de tabla
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
        <div>
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest font-display">GOBIERNO AUTÓNOMO DEPARTAMENTAL DE ORURO</span>
          <h2 className="text-white font-black text-2xl mt-1 tracking-tight font-display">Monitoreo Comercial y Moderación</h2>
          <p className="text-neutral-400 text-xs mt-1">Estadísticas agregadas de interacciones y control del catálogo para fomento agrícola local.</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Servidor DB local activo
          </span>
        </div>
      </div>

      {/* Grid KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Anuncios Activos</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-white font-black text-3xl">{metrics.activeListings}</span>
            <span className="text-neutral-500 text-xs">/ {metrics.totalListings} total</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest font-display">Productores Locales</span>
          <div className="mt-3">
            <span className="text-amber-500 font-black text-3xl">{metrics.totalProducers}</span>
            <span className="text-neutral-400 text-xs block mt-1">Registrados en provincias</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Contactos Registrados</span>
          <div className="mt-3">
            <span className="text-emerald-500 font-black text-3xl">{metrics.totalContacts}</span>
            <span className="text-neutral-400 text-[10px] block mt-1">Interés comercial inferido</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Canal Preferido</span>
          <div className="mt-3 flex items-center justify-between text-xs">
            <div>
              <p className="text-white font-bold">{metrics.waClicks} clicks</p>
              <p className="text-neutral-500 text-[10px]">WhatsApp 💬</p>
            </div>
            <div className="border-l border-white/5 pl-4">
              <p className="text-white font-bold">{metrics.callClicks} clics</p>
              <p className="text-neutral-500 text-[10px]">Llamadas 📞</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos Visuales SVG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución Categorías */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">Productos por Categorías</h3>
          <div className="space-y-4">
            {chartCategoryData.map(cat => {
              const maxVal = Math.max(...chartCategoryData.map(c => c.value), 1)
              const percent = (cat.value / maxVal) * 100
              return (
                <div key={cat.key}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 font-semibold">{cat.key}</span>
                    <span className="text-white font-bold">{cat.value} anuncios</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${percent}%`, 
                        backgroundColor: cat.color 
                      }} 
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Municipios Productores */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">Top 5 Municipios con Mayor Oferta</h3>
            <div className="space-y-3">
              {chartMunicipalityData.map((mun, idx) => {
                const colors = ['bg-amber-500', 'bg-orange-500', 'bg-sky-500', 'bg-violet-500', 'bg-emerald-500']
                return (
                  <div key={mun.name} className="flex items-center gap-3 text-xs bg-neutral-950/40 p-2.5 rounded-xl border border-white/[0.02]">
                    <span className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-[10px] text-black ${colors[idx] || 'bg-neutral-700'}`}>
                      {idx + 1}
                    </span>
                    <span className="text-neutral-300 flex-1 font-medium">{mun.name}</span>
                    <span className="text-white font-extrabold">{mun.value} anuncios</span>
                  </div>
                )
              })}
              {chartMunicipalityData.length === 0 && (
                <p className="text-neutral-500 text-center py-8 text-xs">No hay datos suficientes registrados.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control de Moderación */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-white font-bold text-base tracking-tight font-display">Listado General de Moderación</h3>
            <p className="text-neutral-400 text-xs mt-0.5">Gestione y suspenda publicaciones inapropiadas o finalice campañas comerciales.</p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 flex items-center gap-2 w-full sm:max-w-xs">
            <span className="text-xs">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar título, productor, municipio..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none border-none text-xs text-white placeholder:text-neutral-600 w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-950 text-neutral-400 border-b border-white/5 font-bold uppercase tracking-wider">
                <th className="p-4">Producto</th>
                <th className="p-4">Productor</th>
                <th className="p-4">Municipio</th>
                <th className="p-4">Precio (Bs)</th>
                <th className="p-4">Rubro</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-850 border border-white/5 shrink-0">
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-white font-semibold truncate max-w-[150px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-neutral-300">{p.seller}</td>
                  <td className="p-4 text-neutral-400">{p.location}</td>
                  <td className="p-4 text-amber-400 font-extrabold">{p.price}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-950 text-neutral-300 border border-white/5">
                      {p.category.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      p.status === 'activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-1.5">
                      {p.status === 'activo' ? (
                        <button
                          onClick={() => onModerate(p.id, 'suspendido')}
                          className="bg-red-950/30 hover:bg-red-900/50 text-red-400 font-semibold px-2.5 py-1.5 rounded-lg border border-red-500/20 transition-all active:scale-95"
                        >
                          Suspender
                        </button>
                      ) : (
                        <button
                          onClick={() => onModerate(p.id, 'activo')}
                          className="bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-400 font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-500/20 transition-all active:scale-95"
                        >
                          Aprobar
                        </button>
                      )}
                      <button
                        onClick={() => onModerate(p.id, 'delete')}
                        className="bg-neutral-800 hover:bg-neutral-700 text-neutral-400 font-semibold px-2 py-1.5 rounded-lg hover:text-white transition-all active:scale-95"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-neutral-500 font-medium">No se encontraron registros coincidentes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
