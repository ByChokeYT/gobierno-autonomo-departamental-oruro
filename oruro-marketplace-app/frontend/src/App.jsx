import React, { useState, useEffect, useMemo } from 'react'
import { CATEGORIES, MUNICIPALES, INITIAL_PRODUCTS, renderCategoryIcon } from './constants/marketData'
import ProductCard from './components/ProductCard'
import ContactModal from './components/ContactModal'
import PublishDrawer from './components/PublishDrawer'
import GovDashboardView from './components/GovDashboardView'
import AuthModal from './components/AuthModal'
import CompleteProfileModal from './components/CompleteProfileModal'
import LandingView from './components/LandingView'
import './index.css'

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeMunicipio, setActiveMunicipio] = useState('Todos los municipios')
  const [search, setSearch] = useState('')
  const [currentView, setCurrentView] = useState('landing') // 'landing', 'marketplace', 'dashboard', 'my-products'
  
  // Modales
  const [contactProduct, setContactProduct] = useState(null)
  const [publishOpen, setPublishOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

  // Estado del usuario autenticado (persiste en localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('market_oruro_currentUser')
    return saved ? JSON.parse(saved) : null
  })

  // Verificar si el perfil del productor requiere completación (onboarding)
  const isProfileIncomplete = useMemo(() => {
    return currentUser && currentUser.role === 'productor' && (!currentUser.phone || !currentUser.location);
  }, [currentUser]);

  // Estado local para los productos
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('market_oruro_products')
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS
  })

  // Estado local para interacciones simuladas
  const [interactions, setInteractions] = useState(() => {
    const saved = localStorage.getItem('market_oruro_interactions')
    if (!saved) {
      const initial = [
        { id: 'int-1', productId: 'prod-1', type: 'whatsapp', date: new Date().toISOString() },
        { id: 'int-2', productId: 'prod-1', type: 'llamada', date: new Date().toISOString() },
        { id: 'int-3', productId: 'prod-2', type: 'whatsapp', date: new Date().toISOString() },
        { id: 'int-4', productId: 'prod-3', type: 'whatsapp', date: new Date().toISOString() },
        { id: 'int-5', productId: 'prod-5', type: 'llamada', date: new Date().toISOString() }
      ]
      localStorage.setItem('market_oruro_interactions', JSON.stringify(initial))
      return initial
    }
    return JSON.parse(saved)
  })

  // Sincronización en localStorage
  useEffect(() => {
    localStorage.setItem('market_oruro_products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('market_oruro_interactions', JSON.stringify(interactions))
  }, [interactions])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('market_oruro_currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('market_oruro_currentUser')
    }
  }, [currentUser])

  // Registro de interacción comercial
  const handleInteraction = (prodId, type) => {
    const newInt = {
      id: `int-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: prodId,
      type: type,
      date: new Date().toISOString()
    }
    setInteractions(prev => [...prev, newInt])
  }

  // Creación de producto
  const handlePublishProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev])
  }

  // Moderación / Borrado de producto
  const handleModerateProduct = (prodId, action) => {
    if (action === 'delete') {
      setProducts(prev => prev.filter(p => p.id !== prodId))
    } else {
      setProducts(prev => prev.map(p => p.id === prodId ? { ...p, status: action } : p))
    }
  }

  // Click en Publicar Producto (Control de acceso con Auth)
  const handlePublishClick = () => {
    if (!currentUser) {
      alert('Debe iniciar sesión o registrarse como productor para publicar un anuncio en el catálogo.')
      setAuthOpen(true)
    } else if (currentUser.role === 'admin') {
      alert('La cuenta de la Gobernación no puede publicar anuncios comerciales. Inicie sesión como productor.')
    } else {
      setPublishOpen(true)
    }
  }

  // Cerrar Sesión
  const handleLogout = () => {
    if (window.firebaseAuth) {
      const { auth, signOut } = window.firebaseAuth;
      signOut(auth)
        .then(() => {
          setCurrentUser(null);
          setCurrentView('landing');
        })
        .catch((error) => {
          console.error("Error al cerrar sesión en Firebase: ", error);
          setCurrentUser(null);
          setCurrentView('landing');
        });
    } else {
      setCurrentUser(null);
      setCurrentView('landing');
    }
  }

  // Filtrado de productos para la visualización del Feed
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Si estamos en el marketplace general, solo vemos productos activos
      if (currentView === 'marketplace' && p.status !== 'activo') return false
      
      // Si estamos en Mis Publicaciones, vemos los productos que pertenecen al productor autenticado
      if (currentView === 'my-products') {
        if (!currentUser) return false
        return p.seller.toLowerCase() === currentUser.name.toLowerCase()
      }

      const matchCat = activeCategory === 'all' || p.category === activeCategory
      const matchMun = activeMunicipio === 'Todos los municipios' || p.location.toLowerCase() === activeMunicipio.toLowerCase()
      
      const searchLower = search.toLowerCase()
      const matchSearch = p.title.toLowerCase().includes(searchLower) ||
        p.location.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.seller.toLowerCase().includes(searchLower)

      return matchCat && matchMun && matchSearch
    })
  }, [products, activeCategory, activeMunicipio, search, currentView, currentUser])

  // Helper para renderizar los bloques del Sidebar
  const renderSidebarContent = () => (
    <>
      {/* Navegación de Vistas */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl">
        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest px-2.5 block mb-3">Navegación</span>
        <div className="space-y-1">
          {/* Inicio / Presentación GAD */}
          <button
            onClick={() => { setCurrentView('landing'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              currentView === 'landing'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4.5 h-4.5 text-inherit"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            Inicio / Presentación
          </button>

          <button
            onClick={() => { setCurrentView('marketplace'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              currentView === 'marketplace'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-inherit"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.25A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V15.75a2.25 2.25 0 0 1 2.25-2.25Zm0-4.5h18A2.25 2.25 0 0 0 21 9V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
            Catálogo de Oferta
          </button>

          {/* Vista Mis Publicaciones */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (!currentUser) {
                alert('Debe iniciar sesión como Productor para ver sus publicaciones.')
                setAuthOpen(true)
              } else if (currentUser.role !== 'productor') {
                alert('Su rol actual es institucional. Regístrese o inicie sesión como productor.')
              } else {
                setCurrentView('my-products')
              }
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              currentView === 'my-products'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            Mis Publicaciones
          </button>

          {/* Panel de la Gobernación */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (!currentUser) {
                alert('Acceso Institucional: Debe iniciar sesión con credenciales de la Gobernación.')
                setAuthOpen(true)
              } else if (currentUser.role !== 'admin') {
                alert('Acceso restringido. Esta sección requiere una cuenta de la Gobernación (GAD).')
              } else {
                setCurrentView('dashboard')
              }
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              currentView === 'dashboard'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
            Panel Gobernación
          </button>
        </div>
      </div>

      {/* Filtros de Categorías */}
      {currentView !== 'dashboard' && currentView !== 'landing' && (
        <>
          {/* Categorías */}
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest px-2.5 block mb-3">Filtrar por Rubro</span>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    setMobileMenuOpen(false);
                    if (currentView !== 'marketplace' && currentView !== 'my-products') {
                      setCurrentView('marketplace')
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    activeCategory === cat.id
                      ? 'bg-white/5 text-white font-bold'
                      : 'text-neutral-400 hover:bg-white/[0.02] hover:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-neutral-950 w-7 h-7 rounded-lg flex items-center justify-center text-amber-500 font-bold">
                      {renderCategoryIcon(cat.id)}
                    </span>
                    <span>{cat.label}</span>
                  </div>
                  {activeCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Municipios */}
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest px-2.5 block mb-3">Provincia / Municipio</span>
            <div className="relative">
              <select 
                value={activeMunicipio}
                onChange={e => { setActiveMunicipio(e.target.value); setMobileMenuOpen(false); }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none select-clean cursor-pointer font-medium"
              >
                {MUNICIPALES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {/* Tarjeta de Información General */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Comercio Solidario</h4>
        <p className="text-neutral-400 text-[11px] leading-relaxed mb-3">
          Esta plataforma es pública y gratuita. Los tratos comerciales y la coordinación de envíos se realizan de forma directa y externa entre productores y compradores.
        </p>
        <a 
          href="#guia" 
          onClick={(e) => {
            e.preventDefault()
            setMobileMenuOpen(false)
            alert("Para registrarse: pulse 'Ingresar' arriba, regístrese como productor y complete sus datos. No requiere intermediarios.")
          }}
          className="text-amber-500 hover:text-amber-400 font-black text-[10px] uppercase tracking-wider"
        >
          Cómo registrarse ➔
        </a>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex flex-col font-sans text-neutral-100 pb-16 lg:pb-0">
      
      {/* ─── BARRA INSTITUCIONAL SUPERIOR ─── */}
      <div className="bg-neutral-950 border-b border-white/5 py-1.5 px-4 text-center">
        <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
          Gobierno Autónomo Departamental de Oruro <span className="text-amber-500">·</span> Fomento Económico y Productivo Regional
        </p>
      </div>

      {/* ─── NAVBAR PRINCIPAL ─── */}
      <header className="sticky top-0 z-40 bg-[#0c0c0e]/95 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo y Enlace a Inicio + Menú Hamburguesa en Móvil */}
          <div className="flex items-center justify-between w-full sm:w-auto shrink-0">
            <div className="flex items-center gap-3">
              {/* Botón Hamburguesa en Móvil (Esquina Izquierda) */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer active:scale-95 transition-all"
                title="Abrir menú de navegación"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              </button>

              <button 
                onClick={() => {
                  setCurrentView('landing')
                  setActiveCategory('all')
                  setActiveMunicipio('Todos los municipios')
                  setSearch('')
                }}
                className="text-left focus:outline-none cursor-pointer flex items-center gap-2.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center font-extrabold text-black text-lg shadow-md group-hover:bg-amber-500 transition-colors">
                  O
                </div>
                <div>
                  <p className="text-white font-extrabold text-lg tracking-tight leading-none group-hover:text-amber-400 transition-colors font-display">
                    Market<span className="text-amber-500">Oruro</span>
                  </p>
                  <p className="text-neutral-500 text-[10px] font-semibold tracking-wider uppercase mt-0.5">Catálogo Departamental</p>
                </div>
              </button>
            </div>

            {/* Perfil del Usuario en Móvil (Esquina Derecha) */}
            <div className="flex lg:hidden items-center">
              {currentUser ? (
                <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-black text-[10px] font-black select-none">
                    {currentUser.name[0].toUpperCase()}
                  </div>
                  <button 
                    onClick={handleLogout}
                    title="Cerrar Sesión"
                    className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setAuthOpen(true)}
                  className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                  Ingresar
                </button>
              )}
            </div>
          </div>

          {/* Buscador Integrado */}
          <div className="w-full sm:max-w-xs md:max-w-md">
            <div className="bg-neutral-900 border border-neutral-800 focus-within:border-amber-600/50 rounded-2xl px-4 py-2.5 flex items-center gap-3 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-neutral-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" /></svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por quinua real, charque, lana, municipio..."
                className="bg-transparent text-white text-sm w-full outline-none placeholder:text-neutral-600"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-neutral-500 hover:text-white text-xs">✕</button>
              )}
            </div>
          </div>

          {/* Botones de Acción y Usuario (Auth) (Escritorio) */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <button
              onClick={handlePublishClick}
              className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-black font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-amber-950/20 flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Publicar Producto
            </button>

            {/* Componente del Perfil del Usuario */}
            <div className="h-9 border-l border-white/10" />

            {currentUser ? (
              <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-black text-xs font-black select-none">
                  {currentUser.name[0].toUpperCase()}
                </div>
                <div className="hidden md:block min-w-0 text-left">
                  <p className="text-white text-[11px] font-bold truncate max-w-[100px]">{currentUser.name}</p>
                  <p className={`text-[8px] font-black uppercase tracking-wider ${
                    currentUser.role === 'admin' ? 'text-sky-400' : 'text-amber-500'
                  }`}>
                    {currentUser.role === 'admin' ? 'Gobernación' : 'Productor'}
                  </p>
                </div>
                <button 
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                  className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthOpen(true)}
                className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                Ingresar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── CUERPO PRINCIPAL DE LA APP ─── */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full flex flex-col lg:flex-row gap-8">
        
        {/* ─── SIDEBAR DE FILTROS Y VISTAS (ESCRITORIO) ─── */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          {renderSidebarContent()}
        </aside>

        {/* ─── MENÚ LATERAL DESPLEGABLE MÓVIL (DRAWER OVERLAY) ─── */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setMobileMenuOpen(false)}>
            <aside 
              className="bg-neutral-900 border-r border-neutral-800 w-72 h-full p-6 space-y-6 relative overflow-y-auto animate-in slide-in-from-left duration-300 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Botón de cerrar */}
              <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">✕</button>

              {/* Encabezado del menú */}
              <div className="flex items-center gap-2 pt-2 pb-4 border-b border-white/5">
                <div className="w-7.5 h-7.5 rounded-lg bg-amber-600 flex items-center justify-center font-black text-black text-sm">O</div>
                <span className="text-white font-extrabold text-sm tracking-tight">MarketOruro Menú</span>
              </div>

              <div className="space-y-6 flex-1">
                {renderSidebarContent()}
              </div>
            </aside>
          </div>
        )}

        {/* ─── CONTENIDO DINÁMICO (VISTAS) ─── */}
        <main className="flex-1 min-w-0">
          
          {currentView === 'dashboard' ? (
            <GovDashboardView 
              products={products} 
              interactions={interactions} 
              onModerate={handleModerateProduct} 
            />
          ) : currentView === 'landing' ? (
            <LandingView 
              onNavigate={setCurrentView} 
              onOpenAuth={() => setAuthOpen(true)} 
            />
          ) : (
            <div className="space-y-6">
              
              {/* BANNER BIENVENIDA / HERO INTERACTIVO */}
              {currentView === 'marketplace' && (
                <div className="relative rounded-3xl border border-amber-600/10 overflow-hidden bg-gradient-to-br from-neutral-950 to-neutral-900 p-6 md:p-8 animate-gradient-slow flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 max-w-lg text-center md:text-left">
                    <span className="text-[10px] text-amber-500 font-extrabold tracking-widest uppercase">PRODUCCIÓN ORUREÑA DIRECTA</span>
                    <h1 className="text-white font-extrabold text-2xl md:text-3xl mt-1 tracking-tight font-display">El Altiplano en sus Manos</h1>
                    <p className="text-neutral-400 text-xs mt-2 leading-relaxed">
                      Conecte con asociaciones agropecuarias de Oruro. Compre quinua real orgánica, fibra de alpaca y artesanías ancestrales directo de origen, sin intermediación comercial.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/5 border border-amber-500/10 relative">
                    <span className="text-4xl animate-bounce duration-1000">🌾</span>
                  </div>
                </div>
              )}

              {/* VISTA MIS PRODUCTOS */}
              {currentView === 'my-products' && (
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl mb-4">
                  <h2 className="text-white font-black text-xl tracking-tight font-display">Panel del Productor Local</h2>
                  <p className="text-neutral-400 text-xs mt-1">
                    Sesión activa: <span className="text-amber-500 font-bold">{currentUser?.name}</span>. 
                    Aquí puedes ver y gestionar las ofertas que has subido.
                  </p>
                </div>
              )}

              {/* ENCABEZADO DE RESULTADOS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-white font-extrabold text-lg tracking-tight flex items-center gap-2 font-display">
                    {currentView === 'my-products' 
                      ? 'Mis Ofertas Activas' 
                      : (CATEGORIES.find(c => c.id === activeCategory)?.label || 'Todos los Productos')
                    }
                    {activeMunicipio !== 'Todos los municipios' && currentView !== 'my-products' && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-900 border border-white/5 text-neutral-300">
                        📍 {activeMunicipio}
                      </span>
                    )}
                  </h2>
                  <p className="text-neutral-500 text-xs mt-0.5">Se muestran {filteredProducts.length} publicaciones</p>
                </div>

                <div className="flex items-center gap-2.5">
                  {(activeCategory !== 'all' || activeMunicipio !== 'Todos los municipios' || search) && (
                    <button
                      onClick={() => {
                        setActiveCategory('all')
                        setActiveMunicipio('Todos los municipios')
                        setSearch('')
                      }}
                      className="text-neutral-500 hover:text-white text-xs font-bold border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded-xl transition-all"
                    >
                      Limpiar Filtros
                    </button>
                  )}
                </div>
              </div>

              {/* Swipable Horizontal Category Bar for Mobile */}
              {currentView !== 'landing' && currentView !== 'dashboard' && (
                <div className="flex lg:hidden overflow-x-auto gap-2 pb-3 pt-1 -mx-4 px-4 scrollbar-none">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                        activeCategory === cat.id
                          ? 'bg-amber-600 text-black border-transparent shadow-lg shadow-amber-950/20'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                      }`}
                    >
                      <span className="text-sm">{renderCategoryIcon(cat.id)}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* GRILLA DE PRODUCTOS */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onContact={setContactProduct} 
                      isAdminView={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-neutral-900/30 border border-neutral-800 border-dashed rounded-3xl">
                  <span className="text-5xl block mb-4">🔍</span>
                  <h3 className="text-white font-bold text-base">No se encontraron productos</h3>
                  <p className="text-neutral-500 text-xs mt-1 max-w-sm mx-auto">
                    {currentView === 'my-products' 
                      ? 'Aún no has registrado ningún producto. ¡Comienza haciendo clic en Publicar Producto!'
                      : 'Intente buscar con otros términos o seleccionar otra categoría en el menú lateral.'
                    }
                  </p>
                  {currentView !== 'my-products' && (
                    <button
                      onClick={() => {
                        setActiveCategory('all')
                        setActiveMunicipio('Todos los municipios')
                        setSearch('')
                      }}
                      className="mt-4 bg-neutral-900 hover:bg-neutral-800 text-amber-500 font-bold text-xs px-4 py-2 rounded-xl border border-neutral-800 transition-all"
                    >
                      Ver todo el catálogo
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ─── PIE DE PÁGINA (FOOTER) ─── */}
      <footer className="bg-neutral-950 border-t border-white/5 py-8 mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="text-white font-bold tracking-tight font-display">MarketOruro — Plataforma Comercial Departamental</p>
          <p className="text-neutral-500 max-w-lg mx-auto leading-relaxed">
            Una iniciativa del Gobierno Autónomo Departamental de Oruro para el incentivo económico de productores altiplánicos. Desarrollado bajo los estándares de ByChokeYT.
          </p>
          <div className="pt-4 border-t border-white/[0.03] text-neutral-600 text-[10px] flex justify-between items-center max-w-md mx-auto">
            <span>© 2026 GAD Oruro. Todos los derechos reservados.</span>
            <span>Versión 1.3.0 (Modular + Firebase Auth)</span>
          </div>
        </div>
      </footer>

      {/* ─── MODAL DE DETALLE / CONTACTO ─── */}
      <ContactModal 
        product={contactProduct} 
        onClose={() => setContactProduct(null)} 
        onInteraction={handleInteraction}
      />

      {/* ─── COMPONENTE FORMULARIO PUBLICACIÓN ─── */}
      <PublishDrawer 
        isOpen={publishOpen} 
        onClose={() => setPublishOpen(false)} 
        onPublish={handlePublishProduct}
        currentUser={currentUser}
      />

      {/* ─── MODAL DE INICIO DE SESIÓN / REGISTRO (FIREBASE AUTH) ─── */}
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onLoginSuccess={setCurrentUser}
      />

      {/* ─── MODAL DE COMPLETAR PERFIL (ONBOARDING) ─── */}
      <CompleteProfileModal 
        isOpen={isProfileIncomplete} 
        currentUser={currentUser} 
        onSaveSuccess={setCurrentUser} 
      />

      {/* ─── MODAL DE SOPORTE / CONTACTO GAD ─── */}
      {supportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md" onClick={() => setSupportOpen(false)}>
          <div 
            className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setSupportOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">✕</button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base leading-none">Contacto & Soporte GAD</h3>
                <p className="text-neutral-500 text-[10px] uppercase font-bold mt-1 tracking-wider">Gobierno Autónomo de Oruro</p>
              </div>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed mb-5">
              ¿Tienes dudas sobre cómo registrarte como productor, editar tus ofertas o necesitas denunciar alguna publicación? Comunícate directo con el equipo de Fomento Económico.
            </p>

            <div className="bg-neutral-950/50 rounded-2xl p-4 border border-white/5 mb-6 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Oficina Central:</span>
                <span className="text-white font-semibold">Plaza 10 de Febrero, Oruro</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Correo Electrónico:</span>
                <span className="text-amber-500 font-semibold select-all">fomento@oruro.gob.bo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Horario de Atención:</span>
                <span className="text-white font-semibold">Lun a Vie (08:00 - 16:00)</span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="https://wa.me/59172455555?text=Hola%2C%20necesito%20soporte%20en%20la%20plataforma%20MarketOruro."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-950/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H8.63v.01h-.005V9.75Zm5.625 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0h.01v.01h-.01V9.75Zm-3 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H11.3v.01h-.005V9.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 20.247 12 21a2 2 0 0 0 2-2v-.247a18.232 18.232 0 0 0 4.19-.949A2.25 2.25 0 0 0 21 15.688V9.75a2.25 2.25 0 0 0-2.81-2.185A18.18 18.18 0 0 0 12.006 6.75a18.18 18.18 0 0 0-6.195.815A2.25 2.25 0 0 0 3 9.75v5.938c0 1.09.78 2.02 1.848 2.204a18.236 18.236 0 0 0 4.153.905Z" /></svg>
                Chatear con Soporte GAD
              </a>
              <a
                href="tel:59125251111"
                className="flex items-center justify-center gap-2 w-full bg-neutral-800 hover:bg-neutral-700 active:scale-98 text-white font-bold text-sm py-3 rounded-xl transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.155-.44.01-1.21.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                Llamar por Teléfono
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─── BARRA DE NAVEGACIÓN INFERIOR MÓVIL (ESTILO APP / FACEBOOK MARKETPLACE) ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-45 bg-neutral-950/80 backdrop-blur-lg border-t border-white/5 py-2 px-4 flex items-center justify-around lg:hidden shadow-2xl safe-bottom text-neutral-400">
        
        {/* Inicio */}
        <button
          onClick={() => setCurrentView('landing')}
          className={`flex flex-col items-center gap-1 focus:outline-none transition-colors ${
            currentView === 'landing' ? 'text-amber-500 font-bold' : 'hover:text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
          <span className="text-[9px] uppercase tracking-wide">Inicio</span>
        </button>

        {/* Catálogo */}
        <button
          onClick={() => {
            setCurrentView('marketplace');
            setActiveCategory('all');
            setActiveMunicipio('Todos los municipios');
          }}
          className={`flex flex-col items-center gap-1 focus:outline-none transition-colors ${
            currentView === 'marketplace' ? 'text-amber-500 font-bold' : 'hover:text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.25A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V15.75a2.25 2.25 0 0 1 2.25-2.25Zm0-4.5h18A2.25 2.25 0 0 0 21 9V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
          <span className="text-[9px] uppercase tracking-wide">Catálogo</span>
        </button>

        {/* Publicar (Botón central destacado) */}
        <button
          onClick={handlePublishClick}
          className="flex flex-col items-center justify-center -mt-5 bg-amber-600 active:scale-95 text-black w-11 h-11 rounded-full shadow-lg shadow-amber-950/40 focus:outline-none transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        </button>

        {/* Mis Ventas */}
        <button
          onClick={() => {
            if (!currentUser) {
              alert('Debe iniciar sesión como Productor para ver sus publicaciones.');
              setAuthOpen(true);
            } else if (currentUser.role !== 'productor') {
              alert('Su rol actual es institucional. Regístrese o inicie sesión como productor.');
            } else {
              setCurrentView('my-products');
            }
          }}
          className={`flex flex-col items-center gap-1 focus:outline-none transition-colors ${
            currentView === 'my-products' ? 'text-amber-500 font-bold' : 'hover:text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
          <span className="text-[9px] uppercase tracking-wide">Mis Ventas</span>
        </button>

        {/* Soporte GAD */}
        <button
          onClick={() => setSupportOpen(true)}
          className={`flex flex-col items-center gap-1 focus:outline-none transition-colors ${
            supportOpen ? 'text-amber-500 font-bold' : 'hover:text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H8.63v.01h-.005V9.75Zm5.625 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0h.01v.01h-.01V9.75Zm-3 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H11.3v.01h-.005V9.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 20.247 12 21a2 2 0 0 0 2-2v-.247a18.232 18.232 0 0 0 4.19-.949A2.25 2.25 0 0 0 21 15.688V9.75a2.25 2.25 0 0 0-2.81-2.185A18.18 18.18 0 0 0 12.006 6.75a18.18 18.18 0 0 0-6.195.815A2.25 2.25 0 0 0 3 9.75v5.938c0 1.09.78 2.02 1.848 2.204a18.236 18.236 0 0 0 4.153.905Z" /></svg>
          <span className="text-[9px] uppercase tracking-wide">Soporte</span>
        </button>

        {/* Panel GAD */}
        {currentUser && currentUser.role === 'admin' && (
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-1 focus:outline-none transition-colors ${
              currentView === 'dashboard' ? 'text-amber-500 font-bold' : 'hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
            <span className="text-[9px] uppercase tracking-wide">Panel GAD</span>
          </button>
        )}
      </nav>

    </div>
  )
}
