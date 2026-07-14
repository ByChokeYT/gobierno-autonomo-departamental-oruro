import { useState } from 'react'

export default function App() {
  // Mock data alineado con las semillas cargadas en la Base de Datos
  const [productos, setProductos] = useState([
    { id: 1, titulo: "Quinua Real Orgánica en Grano", municipio: "Salinas de Garci Mendoza", categoria: "Quinua Real", precio: "120.00 Bs", estado: "Activo" },
    { id: 2, titulo: "Charque de Llama Deshidratado", municipio: "Sajama", categoria: "Camélidos", precio: "85.50 Bs", estado: "Activo" },
    { id: 3, titulo: "Lana de Alpaca Natural", municipio: "Sajama", categoria: "Textiles", precio: "150.00 Bs", estado: "Activo" },
    { id: 4, titulo: "Poncho Tradicional Oruro", municipio: "Sajama", categoria: "Textiles", precio: "450.00 Bs", estado: "Activo" }
  ]);

  const toggleEstado = (id) => {
    setProductos(productos.map(p => 
      p.id === id ? { ...p, estado: p.estado === 'Activo' ? 'Suspendido' : 'Activo' } : p
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <p className="text-amber-500 text-xs font-bold tracking-widest uppercase">Gobernación Autónoma de Oruro</p>
            <h1 className="text-xl font-extrabold text-white tracking-tight m-0">Panel de Moderación y Analítica Comercial</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-neutral-400 font-mono">Conectado a PostgreSQL</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Estadísticas de Comercio (KPIs) */}
        <section className="mb-10">
          <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-400 mb-5">Indicadores del Marketplace Oruro</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KPI 1 */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Productores Registrados</span>
              <p className="text-4xl font-black text-white mt-2">142</p>
              <div className="h-1 w-12 bg-amber-600 mt-4 rounded"></div>
            </div>

            {/* KPI 2 */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Ofertas Publicadas</span>
              <p className="text-4xl font-black text-white mt-2">524</p>
              <div className="h-1 w-12 bg-amber-600 mt-4 rounded"></div>
            </div>

            {/* KPI 3 */}
            <div className="bg-neutral-900 border border-amber-600/20 rounded-2xl p-6">
              <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">Interacciones Comerciales (WhatsApp/Llamadas)</span>
              <p className="text-4xl font-black text-amber-500 mt-2">2,932</p>
              <div className="h-1 w-12 bg-amber-600 mt-4 rounded"></div>
            </div>

          </div>
        </section>

        {/* Tabla de Moderación de Productos */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-400">Bandeja de Catálogo de Productores</h2>
            <span className="text-xs text-neutral-500 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">Filtro: Todo el Departamento</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950/20 text-neutral-400 text-xs font-bold uppercase tracking-wider">
                    <th className="p-4 pl-6">Producto</th>
                    <th className="p-4">Municipio de Origen</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precio Sugerido</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 pr-6 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-sm">
                  {productos.map((prod) => (
                    <tr key={prod.id} className="hover:bg-neutral-950/20 transition-colors">
                      <td className="p-4 pl-6 font-bold text-white">{prod.titulo}</td>
                      <td className="p-4 text-neutral-300">{prod.municipio}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-neutral-850 text-neutral-300 border border-neutral-700">
                          {prod.categoria}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-amber-500">{prod.precio}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          prod.estado === 'Activo' 
                            ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-950/30 text-amber-500 border border-amber-500/20'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${prod.estado === 'Activo' ? 'bg-emerald-400' : 'bg-amber-500'}`}></span>
                          {prod.estado}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => toggleEstado(prod.id)}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-colors ${
                            prod.estado === 'Activo'
                              ? 'bg-neutral-800 text-white hover:bg-amber-600 hover:text-black'
                              : 'bg-amber-600 text-black hover:bg-amber-700'
                          }`}
                        >
                          {prod.estado === 'Activo' ? 'Suspender' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
