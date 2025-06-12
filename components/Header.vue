<template>
    <header class="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-gray-900">
          private-shirt.de
        </NuxtLink>
        <div class="hidden lg:flex items-center space-x-8">
          <NuxtLink to="/t-shirts" class="nav-link">Textilien</NuxtLink>
          <NuxtLink to="/tassen" class="nav-link">Tassen</NuxtLink>
          <NuxtLink to="/accessoires" class="nav-link">Accessoires</NuxtLink>
          <NuxtLink to="/creator" class="nav-link">Creator</NuxtLink>
        </div>
        <div class="flex items-center">
          <NuxtLink to="/grossbestellung" class="btn btn-secondary hidden sm:inline-block">Großbestellung</NuxtLink>
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="lg:hidden ml-4 p-2">
            <Menu class="w-6 h-6" />
          </button>
        </div>
      </nav>
      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="lg:hidden bg-white shadow-md">
         <div class="flex flex-col px-6 py-4 space-y-4">
            <NuxtLink to="/t-shirts" class="nav-link" @click="isMobileMenuOpen = false">Textilien</NuxtLink>
            <NuxtLink to="/tassen" class="nav-link" @click="isMobileMenuOpen = false">Tassen</NuxtLink>
            <NuxtLink to="/accessoires" class="nav-link" @click="isMobileMenuOpen = false">Accessoires</NuxtLink>
            <NuxtLink to="/creator" class="nav-link" @click="isMobileMenuOpen = false">Creator</NuxtLink>
            <NuxtLink to="/grossbestellung" class="btn btn-secondary w-full mt-2" @click="isMobileMenuOpen = false">Großbestellung</NuxtLink>
         </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Menu } from 'lucide-vue-next';
  
  const isMobileMenuOpen = ref(false);
  </script>
  