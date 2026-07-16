import React, { useState, useEffect } from 'react'
import { MUNICIPALES } from '../constants/marketData'

export default function PublishDrawer({ isOpen, onClose, onPublish, currentUser }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'quinua',
    price: '',
    unit: 'por kg',
    location: 'Salinas de Garci Mendoza',
    seller: '',
    phone: '',
    imageOption: '/assets/images/quinua_real.png',
    customImage: '',
    badgeText: 'Productor Directo'
  })

  const [errors, setErrors] = useState({})

  // Autocompletar datos del productor si hay sesión iniciada
  useEffect(() => {
    if (currentUser && currentUser.role === 'productor') {
      setFormData(prev => ({
        ...prev,
        seller: currentUser.name || '',
        phone: currentUser.phone || '',
        location: currentUser.location || 'Salinas de Garci Mendoza'
      }))
    }
  }, [currentUser, isOpen])

  if (!isOpen) return null

  const handlePublish = (e) => {
    e.preventDefault()
    
    // Validaciones
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'El título comercial es requerido'
    if (!formData.description.trim()) newErrors.description = 'Describa las propiedades del producto'
    if (!formData.seller.trim()) newErrors.seller = 'Indique su nombre o asociación'
    if (!formData.phone.trim()) newErrors.phone = 'Ingrese un número telefónico de contacto'
    if (!formData.price.trim() || isNaN(formData.price)) newErrors.price = 'Ingrese un precio válido'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const finalImage = formData.imageOption === 'custom' ? formData.customImage : formData.imageOption

    const badgeColors = {
      quinua: 'amber',
      camelidos: 'orange',
      textiles: 'sky',
      artesania: 'rose',
      otros: 'green'
    }

    const productPayload = {
      id: `prod-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price).toFixed(2),
      unit: formData.unit,
      location: formData.location,
      seller: formData.seller,
      phone: formData.phone.replace(/\D/g, ''),
      image: finalImage || '/assets/images/quinua_real.png',
      badge: formData.badgeText || 'Local',
      badgeColor: badgeColors[formData.category] || 'amber',
      status: 'activo',
      created: new Date().toISOString()
    }

    onPublish(productPayload)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-neutral-900 border-l border-neutral-800 w-full max-w-lg h-full overflow-y-auto p-6 md:p-8 relative shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">✕</button>

        <div className="mb-6">
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block">NUEVA PUBLICACIÓN</span>
          <h2 className="text-white font-extrabold text-2xl mt-1 tracking-tight">Formulario del Productor</h2>
          <p className="text-neutral-400 text-xs mt-1">Registre su producto de forma gratuita en el catálogo oficial del Departamento de Oruro.</p>
        </div>

        <form onSubmit={handlePublish} className="space-y-5 text-sm">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Nombre Comercial del Producto *</label>
            <input 
              type="text" 
              placeholder="Ej. Quinua Real Roja Seleccionada"
              value={formData.title}
              onChange={e => {
                setFormData({...formData, title: e.target.value})
                if(errors.title) setErrors({...errors, title: null})
              }}
              className={`w-full bg-neutral-950 border ${errors.title ? 'border-red-500/50' : 'border-neutral-800 focus:border-amber-600/50'} rounded-xl px-4 py-3 text-white outline-none transition-colors`}
            />
            {errors.title && <span className="text-xs text-red-400 mt-1 block">{errors.title}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Categoria */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Rubro / Categoría</label>
              <div className="relative">
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none select-clean cursor-pointer"
                >
                  <option value="quinua">🌾 Quinua Real</option>
                  <option value="camelidos">🦙 Camélidos</option>
                  <option value="textiles">🧶 Textiles</option>
                  <option value="artesania">🪴 Artesanía</option>
                  <option value="otros">📦 Otros</option>
                </select>
              </div>
            </div>

            {/* Municipio */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Municipio de Origen</label>
              <div className="relative">
                <select 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none select-clean cursor-pointer"
                >
                  {MUNICIPALES.slice(1).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Precio */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Precio sugerido (Bs) *</label>
              <input 
                type="text" 
                placeholder="Ej. 130.00"
                value={formData.price}
                onChange={e => {
                  setFormData({...formData, price: e.target.value})
                  if(errors.price) setErrors({...errors, price: null})
                }}
                className={`w-full bg-neutral-950 border ${errors.price ? 'border-red-500/50' : 'border-neutral-800 focus:border-amber-600/50'} rounded-xl px-4 py-3 text-white outline-none transition-colors`}
              />
              {errors.price && <span className="text-xs text-red-400 mt-1 block">{errors.price}</span>}
            </div>

            {/* Unidad de Medida */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Unidad de Venta</label>
              <input 
                type="text" 
                placeholder="Ej. por quintal, por kg, por unidad"
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-600/50 rounded-xl px-4 py-3 text-white outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Productor */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Productor o Asociación *</label>
              <input 
                type="text" 
                placeholder="Ej. Coop. Altiplano Central"
                value={formData.seller}
                onChange={e => {
                  setFormData({...formData, seller: e.target.value})
                  if(errors.seller) setErrors({...errors, seller: null})
                }}
                className={`w-full bg-neutral-950 border ${errors.seller ? 'border-red-500/50' : 'border-neutral-800 focus:border-amber-600/50'} rounded-xl px-4 py-3 text-white outline-none transition-colors`}
              />
              {errors.seller && <span className="text-xs text-red-400 mt-1 block">{errors.seller}</span>}
            </div>

            {/* Telefono de contacto */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Nro de WhatsApp (Con código) *</label>
              <input 
                type="text" 
                placeholder="Ej. 59171234567"
                value={formData.phone}
                onChange={e => {
                  setFormData({...formData, phone: e.target.value})
                  if(errors.phone) setErrors({...errors, phone: null})
                }}
                className={`w-full bg-neutral-950 border ${errors.phone ? 'border-red-500/50' : 'border-neutral-800 focus:border-amber-600/50'} rounded-xl px-4 py-3 text-white outline-none transition-colors`}
              />
              {errors.phone && <span className="text-xs text-red-400 mt-1 block">{errors.phone}</span>}
            </div>
          </div>

          {/* Badge Label */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Etiqueta de Destacado (Badge)</label>
            <input 
              type="text" 
              placeholder="Ej. Agroecológico, Orgánico, Directo de granja"
              value={formData.badgeText}
              onChange={e => setFormData({...formData, badgeText: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-600/50 rounded-xl px-4 py-3 text-white outline-none transition-colors"
            />
          </div>

          {/* Selector de Imagen */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Selección de Imagen Representativa</label>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <label className={`cursor-pointer rounded-xl p-3 border text-center flex flex-col items-center gap-1.5 transition-all ${
                formData.imageOption === '/assets/images/quinua_real.png' 
                  ? 'border-amber-500 bg-amber-500/5 text-white' 
                  : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
              }`}>
                <span className="text-xl">🌾</span>
                <span className="text-[10px] font-semibold">Fondo Quinua</span>
                <input 
                  type="radio" 
                  name="imageOption" 
                  value="/assets/images/quinua_real.png" 
                  checked={formData.imageOption === '/assets/images/quinua_real.png'}
                  onChange={e => setFormData({...formData, imageOption: e.target.value})}
                  className="sr-only"
                />
              </label>

              <label className={`cursor-pointer rounded-xl p-3 border text-center flex flex-col items-center gap-1.5 transition-all ${
                formData.imageOption === '/assets/images/charque_llama.png' 
                  ? 'border-amber-500 bg-amber-500/5 text-white' 
                  : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
              }`}>
                <span className="text-xl">🦙</span>
                <span className="text-[10px] font-semibold">Fondo Llama</span>
                <input 
                  type="radio" 
                  name="imageOption" 
                  value="/assets/images/charque_llama.png" 
                  checked={formData.imageOption === '/assets/images/charque_llama.png'}
                  onChange={e => setFormData({...formData, imageOption: e.target.value})}
                  className="sr-only"
                />
              </label>

              <label className={`cursor-pointer rounded-xl p-3 border text-center flex flex-col items-center gap-1.5 transition-all ${
                formData.imageOption === '/assets/images/lana_alpaca.png' 
                  ? 'border-amber-500 bg-amber-500/5 text-white' 
                  : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
              }`}>
                <span className="text-xl">🧶</span>
                <span className="text-[10px] font-semibold">Fondo Lana</span>
                <input 
                  type="radio" 
                  name="imageOption" 
                  value="/assets/images/lana_alpaca.png" 
                  checked={formData.imageOption === '/assets/images/lana_alpaca.png'}
                  onChange={e => setFormData({...formData, imageOption: e.target.value})}
                  className="sr-only"
                />
              </label>

              <label className={`cursor-pointer rounded-xl p-3 border text-center flex flex-col items-center gap-1.5 transition-all ${
                formData.imageOption === 'custom' 
                  ? 'border-amber-500 bg-amber-500/5 text-white' 
                  : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
              }`}>
                <span className="text-xl">🔗</span>
                <span className="text-[10px] font-semibold">URL Externa</span>
                <input 
                  type="radio" 
                  name="imageOption" 
                  value="custom" 
                  checked={formData.imageOption === 'custom'}
                  onChange={e => setFormData({...formData, imageOption: e.target.value})}
                  className="sr-only"
                />
              </label>
            </div>

            {formData.imageOption === 'custom' && (
              <input 
                type="text" 
                placeholder="Pegue la URL de la imagen aquí (http://...)"
                value={formData.customImage}
                onChange={e => setFormData({...formData, customImage: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-600/50 rounded-xl px-4 py-3 text-white outline-none transition-colors"
              />
            )}
          </div>

          {/* Descripcion */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Detalle y Descripción *</label>
            <textarea 
              placeholder="Describa el tamaño, calidad, empaque o entrega del producto..."
              value={formData.description}
              onChange={e => {
                setFormData({...formData, description: e.target.value})
                if(errors.description) setErrors({...errors, description: null})
              }}
              rows="4"
              className={`w-full bg-neutral-950 border ${errors.description ? 'border-red-500/50' : 'border-neutral-800 focus:border-amber-600/50'} rounded-xl px-4 py-3 text-white outline-none transition-colors resize-none`}
            />
            {errors.description && <span className="text-xs text-red-400 mt-1 block">{errors.description}</span>}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-850 hover:bg-neutral-800 text-white font-bold py-3.5 rounded-2xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-2xl transition-colors shadow-lg shadow-amber-950/20"
            >
              🚀 Registrar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
