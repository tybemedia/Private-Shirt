<template>
  <div class="container mx-auto px-6 py-12">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
      <!-- Thumbnails -->
      <div class="hidden md:flex flex-col space-y-4 md:col-span-2">
        <img v-for="(thumb, i) in thumbnails" :key="i" :src="thumb" alt="T-Shirt Ansicht" class="w-full rounded-lg border cursor-pointer hover:border-[#D8127D]" :class="{'border-[#D8127D]': selectedThumb === i, 'border-gray-200': selectedThumb !== i}" @click="selectedThumb = i" />
      </div>
      <!-- Main Product Image -->
      <div class="md:col-span-6 flex items-center justify-center">
        <img :src="thumbnails[selectedThumb]" alt="Produktbild" class="w-full max-w-md rounded-lg shadow-lg object-contain bg-white" />
      </div>
      <!-- Sidebar -->
      <div class="md:col-span-4 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
        <div>
          <h1 class="text-2xl font-bold mb-1">Unisex Basic T-Shirt <span class="text-xs text-gray-400">#E150</span></h1>
          <div class="text-sm text-[#D8127D] font-semibold mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M12 12a4 4 0 01-4-4V4a4 4 0 018 0v4a4 4 0 01-4 4z"/></svg>
            Partner-Artikel: <span class="text-gray-600">Frauen | Kinder | Teenager | Übergrößen</span>
          </div>
        </div>
        <!-- Color Swatches -->
        <div>
          <div class="font-semibold mb-2">Produktfabe</div>
          <div class="grid grid-cols-8 gap-2 mb-2">
            <button v-for="(color, i) in colors" :key="color.name" :title="color.name" @click="selectedColor = i" :class="['w-7 h-7 rounded-full border-2', selectedColor === i ? 'border-[#D8127D] ring-2 ring-[#ffd44d]' : 'border-gray-200']" :style="{backgroundColor: color.hex}"></button>
          </div>
          <div class="text-xs text-gray-500">Gewählte Farbe: <span class="font-semibold text-[#0a3a47]">{{ colors[selectedColor].name }}</span></div>
        </div>
        <!-- Product Info -->
        <div>
          <details class="mb-2">
            <summary class="cursor-pointer font-semibold text-[#D8127D]">Produktinformationen</summary>
            <div class="text-xs text-gray-600 mt-2">100% Baumwolle, Regular Fit, B&C Collection, waschbar bis 40°C, Unisex.</div>
          </details>
          <details>
            <summary class="cursor-pointer font-semibold text-[#D8127D]">Aktueller Lagerbestand</summary>
            <div class="text-xs text-gray-600 mt-2">Viele Größen und Farben sofort verfügbar.</div>
          </details>
        </div>
        <!-- Price & Delivery -->
        <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-[#0a3a47]">Gesamtsumme</span>
            <span class="text-lg font-bold text-[#D8127D]">11,90 €</span>
          </div>
          <div class="text-xs text-gray-500">inkl. MwSt. EU / inkl. Druckkosten / zzgl. <a href="#" class="underline text-[#D8127D]">Versand</a></div>
          <div class="text-sm text-[#0a3a47] font-semibold mt-2">Lieferung in der Regel innerhalb von 4 Werktagen</div>
        </div>
        <!-- Action Button -->
        <button class="btn w-full bg-[#ff7a00] hover:bg-[#ffa940] text-white text-lg font-bold py-3 rounded-lg mt-2">Größe und Menge wählen</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const thumbnails = [
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
]
const selectedThumb = ref(0)
const colors = [
  { name: 'Weiß', hex: '#f5f5f5' },
  { name: 'Schwarz', hex: '#222' },
  { name: 'Atoll', hex: '#1cc6ea' },
  { name: 'Gelb', hex: '#ffe600' },
  { name: 'Pink', hex: '#D8127D' },
  { name: 'Grün', hex: '#6bbf59' },
  { name: 'Rot', hex: '#e53935' },
  { name: 'Blau', hex: '#1976d2' },
  { name: 'Grau', hex: '#bdbdbd' },
  { name: 'Navy', hex: '#0a3a47' },
  { name: 'Orange', hex: '#ff7a00' },
  { name: 'Lila', hex: '#8e24aa' },
  { name: 'Beige', hex: '#f5e9da' },
  { name: 'Oliv', hex: '#808000' },
  { name: 'Bordeaux', hex: '#800020' },
  { name: 'Türkis', hex: '#30d5c8' },
]
const selectedColor = ref(2)
</script>

<style scoped>
.btn {
  @apply transition font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style> 