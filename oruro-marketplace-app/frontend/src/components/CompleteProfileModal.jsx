import React, { useState, useEffect } from 'react'
import { MUNICIPALES } from '../constants/marketData'

export default function CompleteProfileModal({ isOpen, currentUser, onSaveSuccess }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('Salinas de Garci Mendoza')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '')
      setPhone(currentUser.phone || '')
      setLocation(currentUser.location || 'Salinas de Garci Mendoza')
    }
  }, [currentUser, isOpen])

  if (!isOpen || !currentUser) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Por favor ingrese su nombre o asociación de productores')
      return
    }

    if (!phone.trim()) {
      setError('Por favor ingrese su número de teléfono de WhatsApp')
      return
    }

    setIsLoading(true)

    // Simular un guardado en la base de datos de Firebase Firestore
    setTimeout(() => {
      setIsLoading(false)

      const updatedUser = {
        ...currentUser,
        name: name,
        phone: phone.replace(/\D/g, ''), // solo digitos
        location: location
      }

      // Actualizar en el localStorage la base de datos de productores
      const savedUsers = localStorage.getItem('market_oruro_users')
      if (savedUsers) {
        const users = JSON.parse(savedUsers)
        const updatedUsersList = users.map(u => 
          u.email.toLowerCase() === currentUser.email.toLowerCase()
            ? { ...u, name: name, phone: phone.replace(/\D/g, ''), location: location }
            : u
        )
        // Si no estaba en la lista de alguna manera, lo agregamos
        if (!updatedUsersList.some(u => u.email.toLowerCase() === currentUser.email.toLowerCase())) {
          updatedUsersList.push({
            email: currentUser.email,
            name: name,
            phone: phone.replace(/\D/g, ''),
            location: location,
            role: 'productor',
            uid: currentUser.uid
          })
        }
        localStorage.setItem('market_oruro_users', JSON.stringify(updatedUsersList))
      }

      onSaveSuccess(updatedUser)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Línea de gradiente superior premium */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-sky-500" />

        <div className="text-center mb-6 mt-2">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3 border border-amber-500/20 text-lg font-bold animate-bounce">
            🌾
          </div>
          <h2 className="text-white font-extrabold text-xl tracking-tight">Completar Ficha de Productor</h2>
          <p className="text-neutral-400 text-xs mt-1">
            Hola <span className="text-white font-bold">{currentUser.name}</span>. Para habilitar tu cuenta en el catálogo, por favor introduce tus datos de origen y contacto.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs mb-4">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Nombre / Asociación */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Nombre o Razón Social Comercial *</label>
            <input 
              type="text" 
              placeholder="Ej. Marcelo Condori - Asociación Sajama"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-600/50 rounded-xl px-4 py-3 text-white outline-none"
            />
          </div>

          {/* Teléfono WhatsApp */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Nro de WhatsApp (Con código de país) *</label>
            <input 
              type="text" 
              placeholder="Ej. 59171122334"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-600/50 rounded-xl px-4 py-3 text-white outline-none"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">Este número será usado por los compradores para chatear directo contigo.</span>
          </div>

          {/* Municipio */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Municipio de Oruro donde produces</label>
            <div className="relative">
              <select 
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-3 text-white outline-none select-clean cursor-pointer"
              >
                {MUNICIPALES.slice(1).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-6 active:scale-98 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Guardando en Firebase...
              </>
            ) : 'Activar Cuenta de Productor'}
          </button>
        </form>
      </div>
    </div>
  )
}
