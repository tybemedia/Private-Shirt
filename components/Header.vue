<template>
  <header class="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
    <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
      <div class="text-2xl font-bold text-gray-900 cursor-pointer" @click="$emit('navigate', 'Home')">
        <img src="/assets/group-25.svg" 
             alt="private-shirt.de Logo" 
             class="h-8"
             @error="handleLogoError">
      </div>
      <div class="hidden lg:flex items-center space-x-8">
        <a @mouseenter="fertigeProdukteHover = true" @mouseleave="fertigeProdukteHover = false" @click="$emit('navigate', 'ReadyToBuy')" class="nav-link relative">
          Fertige Produkte
        </a>
        <a @click="$emit('navigate', 'CustomizationCreator')" class="nav-link">Gestalten / Creator</a>
        <a @click="$emit('navigate', 'Grossbestellung')" class="nav-link">Großbestellung</a>
      </div>
      <div>
        <!-- Cart Icon -->
        <button @click="$emit('toggleCart')" class="relative ml-4 p-2 rounded-full hover:bg-gray-100 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span v-if="cartItemCount > 0" 
                class="absolute -top-1 -right-1 bg-[#D8127D] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {{ cartItemCount }}
          </span>
        </button>

        <button class="lg:hidden ml-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>
    </nav>
    <!-- Submenu Bar -->
    <transition name="fade">
      <div v-if="fertigeProdukteHover" @mouseenter="fertigeProdukteHover = true" @mouseleave="fertigeProdukteHover = false" class="fixed left-0 right-0 top-[72px] z-50 bg-gray-100 border-b border-gray-200 shadow-sm">
        <div class="container mx-auto px-6 flex space-x-8 py-2 justify-center">
          <button v-for="cat in submenuCategories" :key="cat.id" class="text-gray-700 hover:text-[#D8127D] font-medium px-3 py-1 rounded transition">
            {{ cat.name }}
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// Props
defineProps({
  cartItemCount: {
    type: Number,
    default: 0
  }
})

// Emits
defineEmits(['navigate', 'toggleCart'])

// State
const fertigeProdukteHover = ref(false)
const submenuCategories = [
  { name: 'Männer', id: 'maenner' },
  { name: 'Frauen', id: 'frauen' },
  { name: 'Kinder', id: 'kinder' },
  { name: 'Accessoires', id: 'accessoires' },
  { name: 'Arbeitskleidung', id: 'arbeitskleidung' }
]

// Methods
const handleLogoError = (event) => {
  // Replace logo with text
  const logoContainer = event.target.parentElement;
  const textLogo = document.createElement('span');
  textLogo.textContent = 'private-shirt.de';
  textLogo.className = 'text-2xl font-bold text-[#D8127D]';
  logoContainer.replaceChild(textLogo, event.target);
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-[#D8127D] font-medium cursor-pointer transition;
}

/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
  