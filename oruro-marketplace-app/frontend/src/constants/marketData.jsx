import React from 'react'

export const CATEGORIES = [
  { id: 'all',        label: 'Todo el Catálogo' },
  { id: 'quinua',     label: 'Quinua Real' },
  { id: 'camelidos',  label: 'Camélidos' },
  { id: 'textiles',   label: 'Textiles Yute' },
  { id: 'artesania',  label: 'Artesanía Fina' },
  { id: 'otros',      label: 'Otros Rubros' }
]

export const MUNICIPALES = [
  'Todos los municipios',
  'Salinas de Garci Mendoza',
  'Sajama',
  'Turco',
  'Curahuara de Carangas',
  'Totora',
  'Challapata',
  'Huanuni',
  'Caracollo',
  'Soracachi',
  'Santiago de Andamarca',
  'Oruro (Cercado)'
]

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Quinua Real Orgánica en Grano',
    description: 'Grano de oro de exportación seleccionado, lavado y listo para el consumo. Cultivado en tierras volcánicas a orillas del salar, garantizando un contenido proteico insuperable y un calibre premium.',
    category: 'quinua',
    price: '120.00',
    unit: 'por kg',
    location: 'Salinas de Garci Mendoza',
    seller: 'Asociación de Productores de Salinas',
    badge: 'Certificado Orgánico',
    badgeColor: 'amber',
    phone: '59171234567',
    image: '/assets/images/quinua_real.png',
    status: 'activo',
    created: '2026-07-10T12:00:00.000Z'
  },
  {
    id: 'prod-2',
    title: 'Charque de Llama Sajama Premium',
    description: 'Carne deshidratada al sol y viento altiplánico. Alta concentración de proteínas, cero colesterol y libre de aditivos. Curado tradicional idóneo para charquekán orureño.',
    category: 'camelidos',
    price: '85.50',
    unit: 'por 500g',
    location: 'Sajama',
    seller: 'Estancia Ganadera Turco',
    badge: 'Artesanal Altiplano',
    badgeColor: 'orange',
    phone: '59172345678',
    image: '/assets/images/charque_llama.png',
    status: 'activo',
    created: '2026-07-12T14:30:00.000Z'
  },
  {
    id: 'prod-3',
    title: 'Lana de Alpaca Superfina Hilada',
    description: 'Fibra natural extraída bajo estándares ecológicos. Textura ultra suave y térmica, ideal para exportación textil. Se presenta en madejas de colores naturales sin tintes sintéticos.',
    category: 'textiles',
    price: '150.00',
    unit: 'por kg',
    location: 'Curahuara de Carangas',
    seller: 'Hilanderas del Norte',
    badge: 'Premium Export',
    badgeColor: 'sky',
    phone: '59170987654',
    image: '/assets/images/lana_alpaca.png',
    status: 'activo',
    created: '2026-07-14T09:15:00.000Z'
  },
  {
    id: 'prod-4',
    title: 'Poncho Tradicional Oruro Tejido a Mano',
    description: 'Tejido exclusivo en telar rústico con iconografía prehispánica de la región de Carangas. Hecho 100% con hilo fino de llama y alpaca. Una obra de arte de alta durabilidad.',
    category: 'textiles',
    price: '450.00',
    unit: 'por unidad',
    location: 'Totora',
    seller: 'Comunidad Artesanas Totora',
    badge: 'Herencia Cultural',
    badgeColor: 'violet',
    phone: '59179988776',
    image: '/assets/images/poncho_oruro.png',
    status: 'activo',
    created: '2026-07-15T18:45:00.000Z'
  },
  {
    id: 'prod-5',
    title: 'Pipocas de Quinua Real / Quinua Pop',
    description: 'Quinua real insuflada ideal para desayunos nutritivos o meriendas rápidas. Producto 100% natural, sin edulcorantes artificiales, apto para celíacos. Rico en fibra y magnesio.',
    category: 'quinua',
    price: '35.00',
    unit: 'por bolsa 250g',
    location: 'Challapata',
    seller: 'Cereales Andinos Oruro',
    badge: 'Nutritivo',
    badgeColor: 'green',
    phone: '59160001234',
    image: '/assets/images/quinua_pop.png',
    status: 'activo',
    created: '2026-07-16T08:00:00.000Z'
  },
  {
    id: 'prod-6',
    title: 'Charango Profesional de Madera Noble',
    description: 'Instrumento musical folclórico de alta resonancia. Caja de resonancia maciza, clavijeros de precisión y cuerdas de nylon de gran tensión. Ideal para concertistas y folcloristas bolivianos.',
    category: 'artesania',
    price: '800.00',
    unit: 'por unidad',
    location: 'Huanuni',
    seller: 'Luthiers del Altiplano',
    badge: 'Edición de Concierto',
    badgeColor: 'rose',
    phone: '59172222333',
    image: '/assets/images/charango.png',
    status: 'activo',
    created: '2026-07-16T11:20:00.000Z'
  }
]

export const BADGE_STYLES = {
  amber:  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  sky:    'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  violet: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  green:  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  rose:   'bg-rose-500/10 text-rose-400 border border-rose-500/20',
}

export function renderCategoryIcon(id) {
  switch (id) {
    case 'all':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      )
    case 'quinua':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3c-2 4-4 6-4 10s2 5 4 8M12 3c2 4 4 6 4 10s-2 5-4 8M8 11h8" />
        </svg>
      )
    case 'camelidos':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 20h20L12 3Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l4 8H8l4-8Z" />
        </svg>
      )
    case 'textiles':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
        </svg>
      )
    case 'artesania':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-1.242 2.25 2.25 0 0 1 2.246-2.4 4.5 4.5 0 0 0 1.242-8.4 2.25 2.25 0 0 1 2.4-2.246 4.5 4.5 0 0 0-8.4 1.242 2.25 2.25 0 0 1-2.245 2.4Z" />
        </svg>
      )
    case 'otros':
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25" />
        </svg>
      )
  }
}
