<template>
    <div>
      <HeroSection />
  
      <!-- Top Categories -->
      <section class="py-16 sm:py-24 bg-white">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-12">Entdecke unsere Bestseller</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            <NuxtLink v-for="category in categories" :key="category.name" :to="category.link" class="category-tile group">
              <img :src="category.image" :alt="`[Bild von ${category.name}]`" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110">
              <div class="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
              <span class="absolute bottom-4 left-4 text-white text-xl font-semibold">{{ category.name }}</span>
            </NuxtLink>
          </div>
        </div>
      </section>
      <!-- Why Us -->
      <section class="py-16 sm:py-24">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-12">Warum private-shirt.de?</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="feature in features" :key="feature.title" class="text-center p-6">
              <div class="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                 <component :is="feature.icon" class="h-8 w-8" />
              </div>
              <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
              <p class="text-gray-600">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Testimonials -->
      <section class="py-16 sm:py-24 bg-indigo-50">
          <div class="container mx-auto px-6">
              <h2 class="text-3xl font-bold text-center mb-2">Was unsere Kunden sagen</h2>
              <div class="flex justify-center items-center mb-10">
                  <div class="flex text-yellow-400 text-2xl">
                      <Star v-for="i in 5" :key="i" class="fill-current"/>
                  </div>
                  <span class="ml-2 text-gray-700 font-semibold">4.9 / 5 bei Trustpilot</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div v-for="i in 3" :key="i" class="bg-white p-8 rounded-xl shadow-lg">
                      <p class="text-gray-600 mb-4">"Absolut begeistert von der Qualität und dem schnellen Versand! Mein Team-Hoodie sieht fantastisch aus. Jederzeit wieder!"</p>
                      <p class="font-bold text-gray-900">- Anna S., Projektmanagerin</p>
                  </div>
              </div>
          </div>
      </section>
  
      <!-- B2B & Creator CTA -->
       <section class="py-16 sm:py-24">
          <div class="container mx-auto px-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div class="bg-white p-10 rounded-xl shadow-lg text-center">
                      <h3 class="text-2xl font-bold mb-3">Für Firmen, Vereine & Events</h3>
                      <p class="text-gray-600 mb-6">Wir bieten attraktive Mengenrabatte und persönlichen Service für Ihre Großbestellung.</p>
                      <NuxtLink to="/grossbestellung" class="btn btn-secondary">Jetzt anfragen</NuxtLink>
                  </div>
                  <div class="bg-indigo-600 text-white p-10 rounded-xl shadow-lg text-center">
                      <h3 class="text-2xl font-bold mb-3">Werde Creator!</h3>
                      <p class="opacity-80 mb-6">Verkaufe deine Designs auf unseren Produkten – ohne Risiko und ohne Kosten.</p>
                       <NuxtLink to="/creator" class="btn btn-primary-inverted">Kostenlos starten</NuxtLink>
                  </div>
              </div>
          </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Download, Leaf, Zap, Award, Star } from 'lucide-vue-next';
  import HeroSection from '~/components/HeroSection.vue';
  
  const categories = ref([
    { name: 'T-Shirts', link: '/t-shirts', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop' },
    { name: 'Hoodies', link: '/hoodies', image: 'https://images.unsplash.com/photo-1556156026-e01c89f5f19c?q=80&w=800&auto=format&fit=crop' },
    { name: 'Tassen', link: '/tassen', image: 'https://images.unsplash.com/photo-1594225019830-798c8a1fe4a0?q=80&w=800&auto=format&fit=crop' },
    { name: 'Stofftaschen', link: '/accessoires', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop' },
    { name: 'Caps', link: '/accessoires', image: 'https://images.unsplash.com/photo-1521369909049-ecaf380c8536?q=80&w=800&auto=format&fit=crop' },
  ]);
  
  const features = ref([
    { title: 'Premiumdruck ab 1 Stück', description: 'Keine Mindestbestellmenge. Perfekt für Einzelstücke und Geschenke.', icon: Download },
    { title: 'Nachhaltige Textilien', description: 'Wir setzen auf Bio-Baumwolle und umweltfreundliche Materialien.', icon: Leaf },
    { title: 'Versand in 2–4 Tagen', description: 'Schnelle Produktion und Lieferung mit unseren zuverlässigen Partnern.', icon: Zap },
    { title: 'Made in Germany', description: 'Druck und Veredelung finden direkt bei uns in Deutschland statt.', icon: Award }
  ]);
  
  useHead({
    title: 'private-shirt.de – Individueller Textildruck',
    meta: [
      { name: 'description', content: 'Individuell bedruckte T-Shirts, Hoodies, Tassen & mehr in Premium-Qualität. Für dich, dein Team oder dein Business – ab 1 Stück.' }
    ]
  })
  </script>
  
  <style scoped>
  .category-tile {
    @apply relative aspect-[4/5] w-full rounded-lg overflow-hidden cursor-pointer shadow-lg;
  }
  </style>
  