import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('Todo');

  const categories = [
    { id: 'all', name: 'Todo', icon: '✨' },
    { id: 'quinua', name: 'Quinua Real', icon: '🌾' },
    { id: 'camelidos', name: 'Camélidos', icon: '🦙' },
    { id: 'textiles', name: 'Textiles', icon: '🧶' }
  ];

  const products = [
    {
      id: 1,
      titulo: "Quinua Real Orgánica en Grano",
      descripcion: "Grano de oro seleccionado, lavado y listo para exportación. Directo de Salinas.",
      categoria: "Quinua Real",
      precio: "120.00",
      municipio: "Salinas de Garci Mendoza",
      badge: "Premium",
      stars: "⭐⭐⭐⭐⭐"
    },
    {
      id: 2,
      titulo: "Charque de Llama Sajama",
      descripcion: "Carne deshidratada al sol de primera calidad, alta en proteína y baja en grasa.",
      categoria: "Camélidos",
      precio: "85.50",
      municipio: "Turco / Sajama",
      badge: "Artesanal",
      stars: "⭐⭐⭐⭐⭐"
    },
    {
      id: 3,
      titulo: "Poncho de Alpaca Tradicional",
      descripcion: "Tejido artesanal a mano en telar de cintura con iconografía andina ancestral.",
      categoria: "Textiles",
      precio: "450.00",
      municipio: "Curahuara de Carangas",
      badge: "Exclusivo",
      stars: "⭐⭐⭐⭐⭐"
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      {/* Top Premium Navbar */}
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-neutral-900 bg-black/60">
        <View>
          <Text className="text-amber-500 text-[10px] font-black tracking-widest uppercase">
            Gobierno Autónomo de Oruro
          </Text>
          <Text className="text-white text-xl font-black tracking-tight">
            MARKETPLACE<Text className="text-amber-500">ORURO</Text>
          </Text>
        </View>
        {/* Avatar Circular con Borde de Oro */}
        <View className="h-9 w-9 rounded-full border border-amber-500 bg-neutral-900 justify-center items-center">
          <Text className="text-amber-500 font-bold text-xs">GO</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-4">
        {/* buscador Moderno */}
        <View className="mb-6 mt-2">
          <View className="bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 flex-row items-center">
            <Text className="text-neutral-400 mr-2 text-base">🔍</Text>
            <TextInput 
              placeholder="Buscar quinua, lana, artesanías..."
              placeholderTextColor="#737373"
              className="text-white text-sm flex-1 font-medium p-0"
            />
          </View>
        </View>

        {/* Categorías Horizontales */}
        <View className="mb-6">
          <Text className="text-neutral-500 text-xs font-bold tracking-wider uppercase mb-3">
            Rubros Productivos
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.name)}
                className={`flex-row items-center px-4 py-3 rounded-2xl mr-3 border transition-colors ${
                  activeCategory === cat.name
                    ? 'bg-amber-600 border-amber-600'
                    : 'bg-neutral-900 border-neutral-800'
                }`}
              >
                <Text className="text-base mr-1.5">{cat.icon}</Text>
                <Text className={`text-xs font-bold ${
                  activeCategory === cat.name ? 'text-black' : 'text-neutral-300'
                }`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Listado de Productos */}
        <View className="mb-6">
          <Text className="text-neutral-500 text-xs font-bold tracking-wider uppercase mb-4">
            Catálogo del Altiplano
          </Text>

          {products.map((prod) => (
            <View 
              key={prod.id} 
              className="bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden mb-6 p-5 relative shadow-lg"
            >
              {/* Badge de Categoría / Municipio */}
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[10px] text-amber-500 font-bold px-2 py-0.5 bg-amber-950/40 border border-amber-500/20 rounded-full">
                    {prod.badge}
                  </Text>
                  <Text className="text-[10px] text-neutral-400 font-medium">
                    {prod.municipio}
                  </Text>
                </View>
                <Text className="text-[10px] text-neutral-500 font-mono">{prod.stars}</Text>
              </View>

              {/* Título y Descripción */}
              <Text className="text-white text-lg font-extrabold mb-1.5">
                {prod.titulo}
              </Text>
              <Text className="text-neutral-400 text-xs leading-relaxed mb-4">
                {prod.descripcion}
              </Text>

              {/* Fila de Precio y Contacto */}
              <View className="flex-row justify-between items-center pt-4 border-t border-neutral-900">
                <View>
                  <Text className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Precio Sugerido</Text>
                  <View className="flex-row items-baseline">
                    <Text className="text-amber-500 text-2xl font-black">{prod.precio}</Text>
                    <Text className="text-amber-600 text-xs font-bold ml-1">Bs</Text>
                  </View>
                </View>
                
                {/* Botón Premium Oro */}
                <TouchableOpacity className="bg-amber-600 active:bg-amber-700 px-5 py-3 rounded-2xl flex-row items-center">
                  <Text className="text-black font-black text-xs mr-1">💬 Contactar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Sección del Productor / Registro */}
        <View className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 mb-8 text-center items-center">
          <Text className="text-amber-500 text-xl font-bold mb-2">¿Eres Productor de Oruro?</Text>
          <Text className="text-neutral-400 text-xs text-center leading-relaxed mb-5">
            Publica tu quinua, ganado, hilados o textiles de forma gratuita y vende directo al comprador.
          </Text>
          <TouchableOpacity className="bg-white px-8 py-4 rounded-2xl w-full items-center shadow-md">
            <Text className="text-black font-black text-sm">Registrar mi Negocio</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
