import React, { useState } from 'react'
import { MUNICIPALES } from '../constants/marketData'

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login') // 'login', 'register'
  const [role, setRole] = useState('productor') // 'productor', 'admin'
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  // Form states
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regLocation, setRegLocation] = useState('Salinas de Garci Mendoza')

  if (!isOpen) return null

  // Inicializar productores registrados en localStorage
  const getRegisteredProducers = () => {
    const saved = localStorage.getItem('market_oruro_users')
    if (!saved) {
      const defaultUsers = [
        {
          email: 'productor@oruro.com',
          password: 'productor123',
          name: 'Cooperativa Salinas Real',
          phone: '59171234567',
          location: 'Salinas de Garci Mendoza',
          role: 'productor'
        }
      ]
      localStorage.setItem('market_oruro_users', JSON.stringify(defaultUsers))
      return defaultUsers
    }
    return JSON.parse(saved)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setAuthError('')

    if (!loginEmail || !loginPassword) {
      setAuthError('Todos los campos son requeridos')
      return
    }

    setIsLoading(true)

    // Si Firebase está disponible a través de la etiqueta <script>
    if (window.firebaseAuth) {
      const { auth, signInWithEmailAndPassword } = window.firebaseAuth
      signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        .then((userCredential) => {
          setIsLoading(false)
          const user = userCredential.user
          
          // Buscar metadatos del usuario en localStorage
          const users = getRegisteredProducers()
          const matchedUser = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase())

          if (loginEmail.toLowerCase() === 'admin@oruro.gob.bo') {
            const adminUser = {
              email: loginEmail,
              name: 'Administración GAD Oruro',
              role: 'admin',
              uid: user.uid
            }
            onLoginSuccess(adminUser)
          } else {
            const producerUser = {
              email: loginEmail,
              name: matchedUser ? matchedUser.name : loginEmail.split('@')[0],
              phone: matchedUser ? matchedUser.phone : '59171234567',
              location: matchedUser ? matchedUser.location : 'Salinas de Garci Mendoza',
              role: 'productor',
              uid: user.uid
            }
            onLoginSuccess(producerUser)
          }
          onClose()
        })
        .catch((error) => {
          setIsLoading(false)
          console.error("Firebase Auth Error: ", error)
          let errorMsg = 'Error al iniciar sesión con Firebase'
          if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            errorMsg = 'Credenciales inválidas. Registre su cuenta o verifique los datos.'
          } else if (error.code === 'auth/invalid-email') {
            errorMsg = 'Formato de correo electrónico no válido.'
          } else {
            errorMsg = error.message
          }
          setAuthError(errorMsg)
        })
    } else {
      // Simular retraso de red si no está cargado Firebase
      setTimeout(() => {
        setIsLoading(false)

        if (role === 'admin') {
          if (loginEmail === 'admin@oruro.gob.bo' && loginPassword === 'admin123') {
            const adminUser = {
              email: loginEmail,
              name: 'Administración GAD Oruro',
              role: 'admin'
            }
            onLoginSuccess(adminUser)
            onClose()
          } else {
            setAuthError('Credenciales de Gobernación incorrectas. Use admin@oruro.gob.bo / admin123')
          }
        } else {
          const users = getRegisteredProducers()
          const user = users.find(u => u.email === loginEmail && u.password === loginPassword)
          if (user) {
            onLoginSuccess(user)
            onClose()
          } else {
            setAuthError('Correo o contraseña incorrectos. Use productor@oruro.com / productor123 o regístrese.')
          }
        }
      }, 1200)
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setAuthError('')

    if (!regName || !regEmail || !regPassword || !regPhone) {
      setAuthError('Todos los campos marcados con * son requeridos')
      return
    }

    setIsLoading(true)

    // Si Firebase está disponible
    if (window.firebaseAuth) {
      const { auth, createUserWithEmailAndPassword } = window.firebaseAuth
      createUserWithEmailAndPassword(auth, regEmail, regPassword)
        .then((userCredential) => {
          setIsLoading(false)
          const user = userCredential.user
          
          const newUser = {
            email: regEmail,
            name: regName,
            phone: regPhone.replace(/\D/g, ''),
            location: regLocation,
            role: 'productor',
            uid: user.uid
          }

          // Guardar metadatos localmente
          const users = getRegisteredProducers()
          users.push(newUser)
          localStorage.setItem('market_oruro_users', JSON.stringify(users))

          onLoginSuccess(newUser)
          onClose()
        })
        .catch((error) => {
          setIsLoading(false)
          console.error("Firebase Registration Error: ", error)
          let errorMsg = 'Error al registrarse en Firebase'
          if (error.code === 'auth/email-already-in-use') {
            errorMsg = 'El correo electrónico ya está registrado.'
          } else if (error.code === 'auth/weak-password') {
            errorMsg = 'La contraseña debe tener al menos 6 caracteres.'
          } else if (error.code === 'auth/invalid-email') {
            errorMsg = 'Formato de correo electrónico no válido.'
          } else {
            errorMsg = error.message
          }
          setAuthError(errorMsg)
        })
    } else {
      setTimeout(() => {
        setIsLoading(false)
        const users = getRegisteredProducers()

        if (users.some(u => u.email === regEmail)) {
          setAuthError('El correo ingresado ya está registrado como productor')
          return
        }

        const newUser = {
          email: regEmail,
          password: regPassword,
          name: regName,
          phone: regPhone.replace(/\D/g, ''),
          location: regLocation,
          role: 'productor'
        }

        users.push(newUser)
        localStorage.setItem('market_oruro_users', JSON.stringify(users))
        
        onLoginSuccess(newUser)
        onClose()
      }, 1500)
    }
  }

  // Inicio de sesión real / simulado con Google Authentication
  const handleGoogleLogin = () => {
    setAuthError('')
    setIsLoading(true)

    if (window.firebaseAuth && window.firebaseAuth.GoogleAuthProvider && window.firebaseAuth.signInWithPopup) {
      const { auth, GoogleAuthProvider, signInWithPopup } = window.firebaseAuth
      const provider = new GoogleAuthProvider()

      signInWithPopup(auth, provider)
        .then((result) => {
          setIsLoading(false)
          const user = result.user
          
          // Buscar si ya tiene metadatos locales (ej: teléfono, ubicación)
          const users = getRegisteredProducers()
          const matchedUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase())

          const loggedInUser = {
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            phone: matchedUser ? matchedUser.phone : '59171234567', // fallback si no tiene
            location: matchedUser ? matchedUser.location : 'Salinas de Garci Mendoza',
            role: user.email.toLowerCase() === 'admin@oruro.gob.bo' ? 'admin' : 'productor',
            uid: user.uid
          }

          // Si es un productor nuevo entrado con Google, guardarlo localmente
          if (!matchedUser && user.email.toLowerCase() !== 'admin@oruro.gob.bo') {
            users.push(loggedInUser)
            localStorage.setItem('market_oruro_users', JSON.stringify(users))
          }

          onLoginSuccess(loggedInUser)
          onClose()
        })
        .catch((error) => {
          setIsLoading(false)
          console.error("Google Auth Error: ", error)
          setAuthError(error.message || 'Error al iniciar sesión con Google')
        })
    } else {
      // Simulación en desarrollo/offline de Google Sign-in
      setTimeout(() => {
        setIsLoading(false)
        const mockGoogleUser = {
          email: 'marcelo.condori@gmail.com',
          name: 'Marcelo Condori',
          phone: '59171122334',
          location: 'Sajama',
          role: 'productor',
          uid: 'google-mock-123456'
        }

        const users = getRegisteredProducers()
        if (!users.some(u => u.email === mockGoogleUser.email)) {
          users.push(mockGoogleUser)
          localStorage.setItem('market_oruro_users', JSON.stringify(users))
        }

        onLoginSuccess(mockGoogleUser)
        onClose()
      }, 1200)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Indicador superior de Firebase */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-sky-500" />

        {/* Cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">✕</button>

        {/* Encabezado */}
        <div className="text-center mb-6 mt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path d="M12 2L2 22h20L12 2zm0 4.5l5.5 11H6.5L12 6.5z"/></svg>
            Conexión Firebase SDK Activa
          </div>
          <h2 className="text-white font-extrabold text-xl tracking-tight">Acceso a Oruro Market</h2>
          <p className="text-neutral-400 text-xs mt-1">Conéctese como productor rural o administrador institucional.</p>
        </div>

        {/* Botón de Google Sign-In */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>
        </div>

        {/* Divisor */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-neutral-800 flex-1" />
          <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">O usar correo</span>
          <div className="h-px bg-neutral-800 flex-1" />
        </div>

        {/* Tabs de Operación */}
        <div className="flex bg-neutral-950 p-1 rounded-xl mb-5 border border-neutral-850">
          <button 
            type="button"
            onClick={() => { setActiveTab('login'); setAuthError(''); }}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'login' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('register'); setAuthError(''); }}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'register' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Alerta de Error */}
        {authError && (
          <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs mb-4 flex items-start gap-2">
            <span className="mt-0.5">⚠️</span>
            <p className="font-semibold leading-normal">{authError}</p>
          </div>
        )}

        {/* Formularios */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Roles */}
            {!window.firebaseAuth && (
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Rol de Acceso (Modo Local)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('productor')}
                    className={`py-2 px-3 border rounded-xl font-bold transition-all text-center ${
                      role === 'productor' 
                        ? 'border-amber-500 bg-amber-500/5 text-amber-400' 
                        : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    🌾 Productor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 border rounded-xl font-bold transition-all text-center ${
                      role === 'admin' 
                        ? 'border-sky-500 bg-sky-500/5 text-sky-400' 
                        : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    🏛️ GAD Oruro
                  </button>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="ejemplo@oruro.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-600/50 rounded-xl px-4 py-3 text-white outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-600/50 rounded-xl px-4 py-3 text-white outline-none"
              />
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
                  Conectando a Firebase Auth...
                </>
              ) : 'Iniciar Sesión'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {/* Nombre */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Nombre Completo o Asociación *</label>
              <input 
                type="text" 
                placeholder="Ej. Asociación Agrícola Salinas"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-600/50 rounded-xl px-4 py-3 text-white outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Correo Electrónico *</label>
              <input 
                type="email" 
                placeholder="ejemplo@oruro.com"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-600/50 rounded-xl px-4 py-3 text-white outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Contraseña *</label>
              <input 
                type="password" 
                placeholder="Mínimo 6 caracteres"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-600/50 rounded-xl px-4 py-3 text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* WhatsApp */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Nro de WhatsApp *</label>
                <input 
                  type="text" 
                  placeholder="Ej. 59171234567"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-600/50 rounded-xl px-4 py-3 text-white outline-none"
                />
              </div>

              {/* Municipio */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Municipio</label>
                <div className="relative">
                  <select 
                    value={regLocation}
                    onChange={e => setRegLocation(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-3 text-white outline-none select-clean cursor-pointer"
                  >
                    {MUNICIPALES.slice(1).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
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
                  Creando cuenta en Firebase...
                </>
              ) : 'Registrarse como Productor'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
