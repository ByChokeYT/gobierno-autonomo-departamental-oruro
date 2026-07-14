import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-4">
        {/* Header de la Aplicación */}
        <View className="items-center mt-6 mb-8">
          <Text className="text-amber-500 text-xs font-bold tracking-widest uppercase">
            Gobernación Autónoma de Oruro
          </Text>
          <Text className="text-white text-3xl font-extrabold tracking-tight mt-1">
            MARKETPLACE
          </Text>
          <Text className="text-amber-600 text-lg font-semibold tracking-wide">
            ORURO
          </Text>
          <View className="h-[2px] w-20 bg-amber-600 mt-2" />
        </View>

        {/* Banner Informativo */}
        <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
          <Text className="text-white text-lg font-bold mb-1">
            Fase 1: Catálogo Nacional
          </Text>
          <Text className="text-neutral-400 text-sm leading-relaxed">
            Digitalizando el trabajo de nuestros productores de Quinua Real, textiles y derivados de camélidos.
          </Text>
        </View>

        {/* Sección de Destacados */}
        <Text className="text-white text-sm font-bold tracking-wider uppercase mb-4">
          Producto Destacado de Oruro
        </Text>

        {/* Tarjeta de Producto (Estilo Premium Oro y Negro) */}
        <View className="bg-neutral-900 border border-amber-600/30 rounded-2xl overflow-hidden mb-8">
          <View className="p-4 bg-neutral-900/50">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-amber-500 text-xs font-bold px-2.5 py-1 bg-amber-950/50 border border-amber-500/20 rounded-full">
                Salinas de Garci Mendoza
              </Text>
              <Text className="text-neutral-400 text-xs">Cosecha 2026</Text>
            </View>
            
            <Text className="text-white text-xl font-bold mb-1">
              Quinua Real Orgánica en Grano
            </Text>
            <Text className="text-neutral-400 text-sm mb-4">
              Quinua real de grano blanco seleccionado y lavado de la asociación local.
            </Text>

            <View className="flex-row justify-between items-center pt-3 border-t border-neutral-800">
              <View>
                <Text className="text-neutral-500 text-xs uppercase">Precio sugerido</Text>
                <Text className="text-amber-500 text-2xl font-black">120.00 Bs</Text>
              </View>
              
              <TouchableOpacity className="bg-amber-600 hover:bg-amber-700 px-5 py-2.5 rounded-xl">
                <Text className="text-black font-extrabold text-sm">Contactar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Botones de Acción - Registro Dual */}
        <View className="gap-3 mt-auto mb-6">
          <TouchableOpacity className="bg-white py-4 rounded-xl items-center">
            <Text className="text-black font-black text-base">Ingresar como Productor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="border border-neutral-700 py-4 rounded-xl items-center">
            <Text className="text-neutral-300 font-bold text-base">Explorar Catálogo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
