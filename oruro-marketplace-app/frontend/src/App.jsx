import { useState } from 'react'
import './index.css'

const CATEGORIES = [
  { id: 'all',      label: 'Todo',         icon: '🏠' },
  { id: 'quinua',   label: 'Quinua Real',   icon: '🌾' },
  { id: 'camelidos',label: 'Camélidos',     icon: '🦙' },
  { id: 'textiles', label: 'Textiles',      icon: '🧶' },
  { id: 'artesania',label: 'Artesanía',     icon: '🪴' },
]

const PRODUCTS = [
  {
    id: 1,
    title: 'Quinua Real Orgánica en Grano',
    description: 'Grano de oro seleccionado, lavado y listo. Alto contenido proteico, ideal para exportación.',
    category: 'quinua',
    price: '120.00',
    unit: 'por kg',
    location: 'Salinas de Garci Mendoza',
    seller: 'Cooperativa Quinua Oruro',
    badge: 'Certificado',
    badgeColor: 'amber',
    phone: '591-76543210',
    emoji: '🌾',
    bg: 'from-amber-950/40 to-stone-950/60',
  },
  {
    id: 2,
    title: 'Charque de Llama Sajama',
    description: 'Carne deshidratada al sol altiplánico. Alta proteína, sin conservantes, tradición ancestral.',
    category: 'camelidos',
    price: '85.50',
    unit: 'por 500g',
    location: 'Turco · Sajama',
    seller: 'Familia Mamani',
    badge: 'Artesanal',
    badgeColor: 'orange',
    phone: '591-71234567',
    emoji: '🦙',
    bg: 'from-orange-950/40 to-stone-950/60',
  },
  {
    id: 3,
    title: 'Lana de Alpaca Fina',
    description: 'Fibra natural sin teñir, suave al tacto. Categoría superfine, apta para exportación textil.',
    category: 'textiles',
    price: '210.00',
    unit: 'por kg',
    location: 'Curahuara de Carangas',
    seller: 'Comunidad Alpaquera Norte',
    badge: 'Premium',
    badgeColor: 'sky',
    phone: '591-70987654',
    emoji: '🧶',
    bg: 'from-sky-950/40 to-stone-950/60',
  },
  {
    id: 4,
    title: 'Poncho Andino Tejido a Mano',
    description: 'Tejido en telar de cintura con iconografía andina ancestral. Lana de alpaca 100% natural.',
    category: 'textiles',
    price: '450.00',
    unit: 'por unidad',
    location: 'Totora · Oruro',
    seller: 'Artesanas de Totora',
    badge: 'Exclusivo',
    badgeColor: 'violet',
    phone: '591-79988776',
    emoji: '🪅',
    bg: 'from-violet-950/40 to-stone-950/60',
  },
  {
    id: 5,
    title: 'Quinua Pop / Pipoca de Quinua',
    description: 'Quinua procesada lista para consumo. Snack nutritivo del altiplano boliviano.',
    category: 'quinua',
    price: '35.00',
    unit: 'por bolsa 250g',
    location: 'Oruro · Ciudad',
    seller: 'Procesadora Altiplano',
    badge: 'Nuevo',
    badgeColor: 'green',
    phone: '591-60001234',
    emoji: '🍿',
    bg: 'from-green-950/40 to-stone-950/60',
  },
  {
    id: 6,
    title: 'Charango Artesanal de Quirquincho',
    description: 'Instrumento musical tradicional boliviano. Fabricado artesanalmente con caparazón natural.',
    category: 'artesania',
    price: '800.00',
    unit: 'por unidad',
    location: 'Oruro · Bolivia',
    seller: 'Taller Folclore Boliviano',
    badge: 'Único',
    badgeColor: 'rose',
    phone: '591-72222333',
    emoji: '🎵',
    bg: 'from-rose-950/40 to-stone-950/60',
  },
]

const BADGE_STYLES = {
  amber:  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  sky:    'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  violet: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  green:  'bg-green-500/10 text-green-400 border border-green-500/20',
  rose:   'bg-rose-500/10 text-rose-400 border border-rose-500/20',
}

function ProductCard({ product, onContact }) {
  return (
    <div className={`relative rounded-2xl border border-white/5 overflow-hidden bg-gradient-to-br ${product.bg} backdrop-blur-sm hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-900/20 transition-all duration-300 group`}>
      {/* Emoji Image Placeholder */}
      <div className="h-40 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center border-b border-white/5">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
      </div>

      <div className="p-4">
        {/* Badge + Ubicación */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE_STYLES[product.badgeColor]}`}>
            {product.badge}
          </span>
          <span className="text-[10px] text-neutral-500 font-medium truncate ml-2">📍 {product.location}</span>
        </div>

        {/* Título */}
        <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
          {product.title}
        </h3>

        {/* Descripción */}
        <p className="text-neutral-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Precio */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-neutral-600 uppercase tracking-wider font-bold">Precio</p>
            <p className="text-amber-400 font-black text-xl leading-none">
              {product.price} <span className="text-amber-600 text-xs font-semibold">Bs</span>
            </p>
            <p className="text-neutral-600 text-[10px]">{product.unit}</p>
          </div>

          {/* Botón WhatsApp */}
          <button
            onClick={() => onContact(product)}
            className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-black font-black text-xs px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-1.5 shadow-lg shadow-amber-900/30"
          >
            💬 Contactar
          </button>
        </div>

        {/* Vendedor */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-amber-800 flex items-center justify-center text-[9px] font-bold text-amber-200 shrink-0">
            {product.seller[0]}
          </div>
          <span className="text-neutral-500 text-[10px] truncate">{product.seller}</span>
        </div>
      </div>
    </div>
  )
}

function ContactModal({ product, onClose }) {
  if (!product) return null
  const waLink = `https://wa.me/${product.phone.replace(/\D/g, '')}?text=Hola! Vi tu publicación de "${product.title}" en Marketplace Oruro. ¿Está disponible?`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{product.emoji}</span>
          <div>
            <p className="text-white font-bold text-sm leading-tight">{product.title}</p>
            <p className="text-amber-400 font-black text-lg">{product.price} Bs</p>
          </div>
        </div>
        <p className="text-neutral-400 text-xs mb-5">📍 {product.location} · {product.seller}</p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-600 hover:bg-green-500 text-white font-black text-sm py-4 rounded-2xl text-center transition-colors mb-3"
        >
          💬 Abrir WhatsApp
        </a>
        <a
          href={`tel:${product.phone}`}
          className="block w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm py-3 rounded-2xl text-center transition-colors mb-3"
        >
          📞 Llamar al Productor
        </a>
        <button
          onClick={onClose}
          className="block w-full text-neutral-500 font-medium text-xs py-2 text-center hover:text-neutral-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [contactProduct, setContactProduct] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ─── NAVBAR ─── */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Logo */}
          <div className="shrink-0">
            <p className="text-amber-500 text-[9px] font-black tracking-widest uppercase leading-none">GAD Oruro</p>
            <p className="text-white font-black text-base tracking-tight leading-none">
              Market<span className="text-amber-500">Oruro</span>
            </p>
          </div>

          {/* Buscador */}
          <div className="flex-1 max-w-xl mx-auto">
            <div className="bg-neutral-900 border border-neutral-800 focus-within:border-amber-600/50 rounded-xl px-3 py-2 flex items-center gap-2 transition-colors">
              <span className="text-neutral-500 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar quinua, lana, artesanías..."
                className="bg-transparent text-white text-sm flex-1 outline-none placeholder:text-neutral-600"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-neutral-500 hover:text-white text-xs">✕</button>
              )}
            </div>
          </div>

          {/* Botón Publicar — oculto en móvil pequeño */}
          <a
            href="#publicar"
            className="hidden sm:flex shrink-0 items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-black font-black text-xs px-4 py-2.5 rounded-xl transition-colors"
          >
            ＋ Publicar
          </a>
        </div>
      </header>

      {/* ─── LAYOUT PRINCIPAL ─── */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* ─── SIDEBAR (solo desktop) ─── */}
        <aside className="hidden lg:flex flex-col gap-2 w-52 shrink-0">
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest px-2 mb-1">Categorías</p>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                activeCategory === cat.id
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}

          <div className="mt-6 border-t border-white/5 pt-4">
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest px-2 mb-3">Panel Gobernación</p>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-400 hover:bg-white/5 hover:text-white transition-all w-full text-left">
              📊 Métricas
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-400 hover:bg-white/5 hover:text-white transition-all w-full text-left">
              🛡️ Moderación
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-400 hover:bg-white/5 hover:text-white transition-all w-full text-left">
              👥 Productores
            </button>
          </div>

          {/* Stats Card */}
          <div className="mt-4 bg-neutral-950 border border-neutral-900 rounded-2xl p-4">
            <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-3">Actividad</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-xs">Productores</span>
                <span className="text-amber-400 font-black text-sm">142</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-xs">Productos</span>
                <span className="text-amber-400 font-black text-sm">524</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-xs">Contactos hoy</span>
                <span className="text-amber-400 font-black text-sm">89</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── CONTENIDO PRINCIPAL ─── */}
        <main className="flex-1 min-w-0">
          {/* Filtros horizontal en mobile */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 lg:hidden scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-600 text-black'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Encabezado de resultados */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white font-black text-lg leading-none">
                {CATEGORIES.find(c => c.id === activeCategory)?.label || 'Todos los Productos'}
              </h1>
              <p className="text-neutral-500 text-xs mt-0.5">{filtered.length} publicaciones en Oruro</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-600 text-xs">Ordenar:</span>
              <select className="bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs px-2 py-1.5 rounded-lg outline-none">
                <option>Recientes</option>
                <option>Menor precio</option>
                <option>Mayor precio</option>
              </select>
            </div>
          </div>

          {/* Grilla de Productos */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} onContact={setContactProduct} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-white font-bold text-lg">No se encontraron productos</p>
              <p className="text-neutral-500 text-sm mt-1">Intenta con otra búsqueda o categoría</p>
            </div>
          )}

          {/* ─── BANNER REGISTRO PRODUCTOR ─── */}
          <div id="publicar" className="mt-10 rounded-3xl border border-amber-600/20 bg-gradient-to-br from-amber-950/20 to-stone-950 p-8 text-center">
            <p className="text-3xl mb-3">🌾</p>
            <h2 className="text-white font-black text-xl mb-2">¿Eres Productor del Departamento de Oruro?</h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
              Publica tu quinua, ganado, fibra de alpaca, textiles y artesanías de forma <strong className="text-amber-500">gratuita</strong>.
              Conecta directamente con compradores de Bolivia y el mundo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-amber-600 hover:bg-amber-500 text-black font-black px-8 py-4 rounded-2xl text-sm transition-colors shadow-lg shadow-amber-900/30">
                📱 Registrar mi Negocio
              </button>
              <button className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-colors">
                ℹ️ Más información
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ─── BOTTOM NAV MÓVIL ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/5 flex">
        {[
          { icon: '🏠', label: 'Inicio', id: 'all' },
          { icon: '🔍', label: 'Buscar', id: 'search' },
          { icon: '🌾', label: 'Quinua', id: 'quinua' },
          { icon: '🦙', label: 'Camélidos', id: 'camelidos' },
          { icon: '＋', label: 'Publicar', id: 'publish' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => item.id !== 'publish' && item.id !== 'search' && setActiveCategory(item.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
              activeCategory === item.id ? 'text-amber-500' : 'text-neutral-500 hover:text-neutral-300'
            } ${item.id === 'publish' ? 'text-amber-500' : ''}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Padding final para nav móvil */}
      <div className="h-20 lg:hidden" />

      {/* ─── MODAL DE CONTACTO ─── */}
      <ContactModal product={contactProduct} onClose={() => setContactProduct(null)} />
    </div>
  )
}
