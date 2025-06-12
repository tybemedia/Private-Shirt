<template>
  <div class="bg-gray-50 min-h-screen font-sans text-gray-800">
    <!-- 
      This is a single-file Vue 3 prototype simulating a multi-page Nuxt.js application.
      In a real Nuxt project, each page (Home, T-Shirts, etc.) and component (Header, Footer)
      would be in its own .vue file within the /pages and /components directories respectively.
      Navigation is simulated using a reactive `currentPage` variable instead of Nuxt's file-based router.
    -->
    
    <!-- Header & Navigation -->
    <header class="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="text-2xl font-bold text-gray-900 cursor-pointer" @click="currentPage = 'Home'">
          <img src="/assets/group-25.svg" alt="private-shirt.de Logo" class="h-8">
        </div>
        <div class="hidden lg:flex items-center space-x-8">
          <a @click="currentPage = 'ReadyToBuy'" class="nav-link">Fertige Produkte</a>
          <a @click="currentPage = 'Customizable'" class="nav-link">Individuell gestalten</a>
          <a @click="currentPage = 'Creator'" class="nav-link">Creator</a>
          <a @click="currentPage = 'Grossbestellung'" class="nav-link">Großbestellung</a>
        </div>
        <div>
          <button @click="currentPage = 'Grossbestellung'" class="btn btn-secondary hidden sm:inline-block">Großbestellung</button>
          <button class="lg:hidden ml-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </nav>
    </header>

    <main>
      <!-- Page Content - Dynamically rendered based on `currentPage` -->
      <transition name="fade" mode="out-in">
        <div :key="currentPage">
          
          <!-- READY TO BUY PAGE -->
          <div v-if="currentPage === 'ReadyToBuy'">
            <div class="container mx-auto px-6 py-12">
              <h1 class="text-4xl font-bold mb-2">Fertige Produkte</h1>
              <p class="text-lg text-gray-600 mb-10">Entdecke unsere Kollektion an fertigen Produkten.</p>
              
              <!-- Category Navigation -->
              <div class="flex space-x-4 mb-8 overflow-x-auto pb-4">
                <button v-for="category in categories" 
                        :key="category.id"
                        @click="selectedCategory = category.id"
                        :class="['px-4 py-2 rounded-lg whitespace-nowrap', 
                                selectedCategory === category.id ? 'bg-[#D8127D] text-white' : 'bg-gray-100']">
                  {{ category.name }}
                </button>
              </div>

              <!-- Search and Sort Bar -->
              <div class="bg-white border-b mb-8">
                <div class="container mx-auto px-6 py-4">
                  <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <!-- Search -->
                    <div class="w-full md:w-96">
                      <div class="relative">
                        <input 
                          type="text" 
                          v-model="searchQuery"
                          @input="debouncedSearch($event.target.value)"
                          placeholder="Produkte suchen..." 
                          class="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-[#D8127D] focus:ring-1 focus:ring-[#D8127D]"
                        >
                        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                      </div>
                    </div>

                    <!-- Sort -->
                    <div class="w-full md:w-64">
                      <select 
                        v-model="sortBy"
                        class="w-full px-4 py-2 border rounded-lg focus:border-[#D8127D] focus:ring-1 focus:ring-[#D8127D]"
                      >
                        <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Products Grid -->
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <template v-if="!isLoading">
                  <div v-for="product in filteredReadyToBuyProducts" 
                       :key="product.id" 
                       class="bg-white rounded-lg shadow-md overflow-hidden group"
                       @click="currentPage = 'ProductDetail'; selectedProduct = product">
                    <div class="relative">
                      <img :src="product.image" :alt="product.name" class="w-full h-64 object-cover">
                      <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="btn bg-white text-gray-900">Details anzeigen</button>
                      </div>
                    </div>
                    <div class="p-4">
                      <h4 class="font-semibold">{{ product.name }}</h4>
                      <p class="text-[#D8127D] font-bold">{{ product.price }} €</p>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <!-- Loading Skeleton -->
                  <div v-for="n in 8" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="animate-pulse">
                      <div class="bg-gray-200 h-64"></div>
                      <div class="p-4">
                        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Pagination -->
              <div class="flex justify-center space-x-2 mt-8">
                <button 
                  v-for="page in totalPages" 
                  :key="page"
                  @click="currentPageNumber = page"
                  :class="[
                    'px-4 py-2 rounded-lg',
                    currentPageNumber === page 
                      ? 'bg-[#D8127D] text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
            </div>
          </div>

          <!-- CUSTOMIZABLE PRODUCTS PAGE -->
          <div v-if="currentPage === 'Customizable'">
            <div class="container mx-auto px-6 py-12">
              <h1 class="text-4xl font-bold mb-2">Individuell gestalten</h1>
              <p class="text-lg text-gray-600 mb-10">Gestalte deine eigenen Produkte nach deinen Wünschen.</p>
              
              <!-- Category Navigation -->
              <div class="flex space-x-4 mb-8 overflow-x-auto pb-4">
                <button v-for="category in categories" 
                        :key="category.id"
                        @click="selectedCategory = category.id"
                        :class="['px-4 py-2 rounded-lg whitespace-nowrap', 
                                selectedCategory === category.id ? 'bg-[#D8127D] text-white' : 'bg-gray-100']">
                  {{ category.name }}
                </button>
              </div>

              <!-- Products Grid -->
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="product in filteredCustomizableProducts" 
                     :key="product.id" 
                     class="bg-white rounded-lg shadow-md overflow-hidden group"
                     @click="currentPage = 'ProductDetail'; selectedProduct = product">
                  <div class="relative">
                    <img :src="product.image" :alt="product.name" class="w-full h-64 object-cover">
                    <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button class="btn bg-[#D8127D] text-white">Jetzt gestalten</button>
                    </div>
                  </div>
                  <div class="p-4">
                    <h4 class="font-semibold">{{ product.name }}</h4>
                    <p class="text-gray-600">Ab {{ product.price }} €</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- HOME PAGE (/pages/index.vue) -->
          <div v-if="currentPage === 'Home'">
            <!-- Hero Section -->
            <section class="relative h-[50vh] flex">
              <!-- Left side - Brand color with text -->
              <div class="w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
                <div class="max-w-xl text-white">
                  <h1 class="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-3">
                    <span class="text-[#D8127D]">Individuell</span> bedruckte Shirts & mehr – in Premium-Qualität
                  </h1>
                  <p class="text-base md:text-xl font-light mb-6">Für dich, dein Team oder dein Business – ab 1 Stück.</p>
                  <div class="flex flex-col sm:flex-row gap-4">
                    <button class="btn bg-[#D8127D] hover:bg-[#b30f68] text-white">Jetzt gestalten</button>
                    <button @click="currentPage = 'Grossbestellung'" class="btn border-2 border-white text-white hover:bg-white hover:text-gray-900">Großbestellung anfragen</button>
                  </div>
                </div>
              </div>
              
              <!-- Right side - Video -->
              <div class="w-1/2 relative overflow-hidden">
                <div class="absolute inset-0 bg-black/20 z-10"></div>
                <video 
                  class="absolute inset-0 w-full h-full object-cover"
                  autoplay 
                  loop 
                  muted 
                  playsinline
                >
                  <source src="https://videos.pexels.com/video-files/7567992/7567992-hd_1920_1080_25fps.mp4" type="video/mp4">
                </video>
              </div>
            </section>

            <!-- Top Categories (/components/CategoryTiles.vue) -->
            <section class="py-12 bg-white">
              <div class="container mx-auto px-6">
                <h2 class="text-3xl font-bold text-center mb-8">Entdecke unsere Bestseller</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                  <div v-for="category in categories" :key="category.name" class="category-tile group" @click="currentPage = category.page">
                    <img :src="category.image" :alt="`[Bild von ${category.name}]`" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black/30"></div>
                    <span class="absolute bottom-4 left-4 text-white text-xl font-semibold">{{ category.name }}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Why Us? (/components/TrustElements.vue) -->
            <section class="py-16 sm:py-24">
              <div class="container mx-auto px-6">
                <h2 class="text-3xl font-bold text-center mb-12">Warum private-shirt.de?</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div v-for="feature in features" :key="feature.title" class="text-center p-6">
                    <div class="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                      <svg v-html="feature.icon" class="h-8 w-8 feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
                    <p class="text-gray-600">{{ feature.description }}</p>
                  </div>
                </div>
              </div>
            </section>
            
            <!-- Testimonials (/components/Testimonials.vue) -->
            <section class="py-16 sm:py-24 bg-indigo-50">
                <div class="container mx-auto px-6">
                    <h2 class="text-3xl font-bold text-center mb-2">Was unsere Kunden sagen</h2>
                    <div class="flex justify-center items-center mb-10">
                        <span class="text-yellow-400 text-2xl">★★★★★</span>
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

            <!-- B2B & Creator CTA Sections -->
             <section class="py-16 sm:py-24">
                <div class="container mx-auto px-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div class="bg-white p-10 rounded-xl shadow-lg text-center">
                            <h3 class="text-2xl font-bold mb-3">Für Firmen, Vereine & Events</h3>
                            <p class="text-gray-600 mb-6">Wir bieten attraktive Mengenrabatte und persönlichen Service für Ihre Großbestellung.</p>
                            <button @click="currentPage = 'Grossbestellung'" class="btn btn-secondary">Jetzt anfragen</button>
                        </div>
                        <div class="bg-indigo-600 text-white p-10 rounded-xl shadow-lg text-center">
                            <h3 class="text-2xl font-bold mb-3">Werde Creator!</h3>
                            <p class="opacity-80 mb-6">Verkaufe deine Designs auf unseren Produkten – ohne Risiko und ohne Kosten.</p>
                             <button @click="currentPage = 'Creator'" class="btn btn-primary-inverted">Kostenlos starten</button>
                        </div>
                    </div>
                </div>
            </section>
          </div>

          <!-- PRODUCT DETAIL PAGE -->
          <div v-if="currentPage === 'ProductDetail' && selectedProduct">
            <div class="container mx-auto px-6 py-12">
              <!-- Breadcrumb Navigation -->
              <div class="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                <a @click="currentPage = 'Home'" class="hover:text-[#D8127D] cursor-pointer">Home</a>
                <span>/</span>
                <a @click="currentPage = selectedProduct.customizable ? 'Customizable' : 'ReadyToBuy'" 
                   class="hover:text-[#D8127D] cursor-pointer">
                  {{ selectedProduct.customizable ? 'Individuell gestalten' : 'Fertige Produkte' }}
                </a>
                <span>/</span>
                <span class="text-gray-900">{{ selectedProduct.name }}</span>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Product Images -->
                <div class="space-y-4">
                  <div class="relative aspect-square rounded-lg overflow-hidden">
                    <img :src="selectedProduct.image" 
                         :alt="selectedProduct.name" 
                         class="w-full h-full object-cover">
                    <div v-if="selectedProduct.customizable" 
                         class="absolute top-4 left-4 bg-[#D8127D] text-white px-3 py-1 rounded-full text-sm">
                      Individuell gestaltbar
                    </div>
                  </div>
                  <div class="grid grid-cols-4 gap-4">
                    <button v-for="(image, index) in selectedProduct.gallery" 
                            :key="index"
                            @click="selectedImage = image"
                            class="aspect-square rounded-lg overflow-hidden border-2"
                            :class="selectedImage === image ? 'border-[#D8127D]' : 'border-transparent'">
                      <img :src="image" 
                           :alt="`${selectedProduct.name} - Bild ${index + 1}`"
                           class="w-full h-full object-cover">
                    </button>
                  </div>
                </div>

                <!-- Product Info -->
                <div>
                  <h1 class="text-3xl font-bold mb-2">{{ selectedProduct.name }}</h1>
                  <div class="flex items-center space-x-4 mb-4">
                    <p class="text-2xl text-[#D8127D] font-bold">{{ selectedProduct.price }} €</p>
                    <span v-if="selectedProduct.customizable" class="text-gray-500">Ab</span>
                    <div class="flex items-center">
                      <span class="text-yellow-400">★★★★★</span>
                      <span class="ml-2 text-gray-600">(4.9)</span>
                    </div>
                  </div>
                  
                  <div class="prose max-w-none mb-8">
                    <p>{{ selectedProduct.description }}</p>
                  </div>

                  <!-- Product Options -->
                  <div class="space-y-6">
                    <!-- Size Selection -->
                    <div v-if="selectedProduct.sizes">
                      <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold">Größe</h3>
                        <button class="text-sm text-[#D8127D] hover:underline">Größentabelle</button>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <button v-for="size in selectedProduct.sizes" 
                                :key="size"
                                @click="selectedSize = size"
                                class="px-4 py-2 border rounded-lg hover:border-[#D8127D] hover:text-[#D8127D] transition"
                                :class="selectedSize === size ? 'border-[#D8127D] text-[#D8127D]' : ''">
                          {{ size }}
                        </button>
                      </div>
                    </div>

                    <!-- Color Selection -->
                    <div v-if="selectedProduct.colors">
                      <h3 class="font-semibold mb-2">Farbe</h3>
                      <div class="flex flex-wrap gap-2">
                        <button v-for="color in selectedProduct.colors" 
                                :key="color"
                                @click="selectedColor = color"
                                class="w-8 h-8 rounded-full border-2 transition"
                                :class="selectedColor === color ? 'border-[#D8127D]' : 'border-transparent'"
                                :style="{ backgroundColor: color }">
                        </button>
                      </div>
                    </div>

                    <!-- Quantity -->
                    <div>
                      <h3 class="font-semibold mb-2">Menge</h3>
                      <div class="flex items-center gap-4">
                        <button @click="quantity = Math.max(1, quantity - 1)" 
                                class="w-10 h-10 border rounded-lg hover:border-[#D8127D] hover:text-[#D8127D] transition">
                          -
                        </button>
                        <input type="number" 
                               v-model="quantity" 
                               min="1" 
                               class="w-20 text-center border rounded-lg focus:border-[#D8127D] focus:ring-1 focus:ring-[#D8127D]">
                        <button @click="quantity++" 
                                class="w-10 h-10 border rounded-lg hover:border-[#D8127D] hover:text-[#D8127D] transition">
                          +
                        </button>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-4">
                      <button v-if="selectedProduct.customizable" 
                              class="btn bg-[#D8127D] text-white flex-1 hover:bg-[#b30f68]">
                        Jetzt gestalten
                      </button>
                      <button v-else 
                              class="btn bg-[#D8127D] text-white flex-1 hover:bg-[#b30f68]">
                        In den Warenkorb
                      </button>
                      <button class="btn border-2 border-gray-300 hover:border-[#D8127D] hover:text-[#D8127D]">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>
                    </div>

                    <!-- Product Features -->
                    <div class="grid grid-cols-2 gap-4 pt-6 border-t">
                      <div class="flex items-center space-x-2">
                        <svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span class="text-sm">Kostenloser Versand</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                        <span class="text-sm">2 Jahre Garantie</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                        </svg>
                        <span class="text-sm">Sicherer Zahlung</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span class="text-sm">Persönlicher Service</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Additional Information Tabs -->
              <div class="mt-16">
                <div class="border-b border-gray-200">
                  <nav class="flex space-x-8">
                    <button v-for="tab in ['Beschreibung', 'Material & Pflege', 'Versand & Rücksendung', 'Bewertungen']"
                            :key="tab"
                            @click="selectedTab = tab"
                            class="py-4 px-1 border-b-2 font-medium text-sm"
                            :class="selectedTab === tab ? 'border-[#D8127D] text-[#D8127D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                      {{ tab }}
                    </button>
                  </nav>
                </div>

                <div class="py-8">
                  <!-- Description Tab -->
                  <div v-if="selectedTab === 'Beschreibung'" class="prose max-w-none">
                    <p>{{ selectedProduct.description }}</p>
                    <ul>
                      <li>Hochwertige Materialien</li>
                      <li>Nachhaltige Produktion</li>
                      <li>Made in Germany</li>
                    </ul>
                  </div>

                  <!-- Material & Care Tab -->
                  <div v-if="selectedTab === 'Material & Pflege'" class="prose max-w-none">
                    <h3 class="text-lg font-semibold mb-4">Material</h3>
                    <p>100% Bio-Baumwolle, GOTS zertifiziert</p>
                    
                    <h3 class="text-lg font-semibold mb-4 mt-8">Pflegehinweise</h3>
                    <ul>
                      <li>Maschinenwäsche bei 30°C</li>
                      <li>Nicht bleichen</li>
                      <li>Bügeln bei mittlerer Temperatur</li>
                      <li>Nicht chemisch reinigen</li>
                    </ul>
                  </div>

                  <!-- Shipping & Returns Tab -->
                  <div v-if="selectedTab === 'Versand & Rücksendung'" class="prose max-w-none">
                    <h3 class="text-lg font-semibold mb-4">Versand</h3>
                    <ul>
                      <li>Kostenloser Versand ab 50€</li>
                      <li>Standardversand: 2-4 Werktage</li>
                      <li>Expressversand: 1-2 Werktage</li>
                    </ul>

                    <h3 class="text-lg font-semibold mb-4 mt-8">Rücksendung</h3>
                    <ul>
                      <li>14 Tage Rückgaberecht</li>
                      <li>Kostenlose Rücksendung</li>
                      <li>Einfacher Rückgabeprozess</li>
                    </ul>
                  </div>

                  <!-- Reviews Tab -->
                  <div v-if="selectedTab === 'Bewertungen'" class="space-y-8">
                    <div class="flex items-center space-x-4">
                      <div class="text-4xl font-bold text-[#D8127D]">4.9</div>
                      <div>
                        <div class="flex text-yellow-400">
                          <span>★★★★★</span>
                        </div>
                        <div class="text-sm text-gray-500">Basierend auf 128 Bewertungen</div>
                      </div>
                    </div>

                    <div class="space-y-6">
                      <div v-for="i in 3" :key="i" class="border-b pb-6">
                        <div class="flex items-center space-x-4 mb-2">
                          <div class="w-10 h-10 rounded-full bg-gray-200"></div>
                          <div>
                            <div class="font-semibold">Max Mustermann</div>
                            <div class="text-sm text-gray-500">Vor 2 Wochen</div>
                          </div>
                        </div>
                        <div class="flex text-yellow-400 mb-2">★★★★★</div>
                        <p class="text-gray-600">Sehr zufrieden mit der Qualität und dem Service. Die Lieferung war schnell und das Produkt entspricht genau der Beschreibung.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- GROSSBESTELLUNG PAGE (/pages/grossbestellung.vue) -->
          <div v-if="currentPage === 'Grossbestellung'">
            <div class="bg-white">
                <div class="container mx-auto px-6 py-16">
                    <div class="max-w-4xl mx-auto">
                        <h1 class="text-4xl font-bold text-center mb-4">Großbestellungen für Ihr Business</h1>
                        <p class="text-xl text-gray-600 text-center mb-12">Perfekt für Firmen, Vereine, Events und Merchandise.</p>

                        <div class="grid md:grid-cols-3 gap-8 text-center mb-16">
                           <div v-for="benefit in b2bBenefits" :key="benefit.title" class="p-4">
                               <div class="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                                  <svg v-html="benefit.icon" class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></svg>
                               </div>
                               <h3 class="text-lg font-semibold">{{ benefit.title }}</h3>
                               <p class="text-sm text-gray-500">{{ benefit.description }}</p>
                           </div>
                        </div>

                        <div class="bg-gray-50 p-8 rounded-xl border border-gray-200">
                             <h2 class="text-2xl font-bold mb-6 text-center">Unverbindliche Anfrage stellen</h2>
                             <form class="space-y-6">
                               <div class="grid md:grid-cols-2 gap-6">
                                 <input type="text" placeholder="Firma / Name*" class="form-input">
                                 <input type="email" placeholder="E-Mail*" class="form-input">
                               </div>
                               <input type="tel" placeholder="Telefon (optional)" class="form-input">
                               <input type="number" placeholder="Geschätzte Stückzahl*" class="form-input">
                               <textarea placeholder="Ihre Nachricht an uns..." rows="5" class="form-input"></textarea>
                               <div>
                                 <label class="block mb-2 text-sm font-medium text-gray-700">Design hochladen (optional)</label>
                                 <input type="file" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                               </div>
                               <div class="text-center">
                                 <button type="submit" class="btn btn-primary btn-lg">Anfrage senden</button>
                               </div>
                             </form>
                        </div>
                    </div>
                </div>
            </div>
          </div>
            
          <!-- OTHER PAGES (Placeholders) -->
          <div v-if="!['Home', 'ReadyToBuy', 'Customizable', 'Grossbestellung'].includes(currentPage)">
              <div class="container mx-auto px-6 py-24 text-center">
                  <h1 class="text-4xl font-bold mb-4">{{ currentPage }}</h1>
                  <p class="text-lg text-gray-600">Diese Seite befindet sich im Aufbau.</p>
                  <button @click="currentPage = 'Home'" class="btn btn-primary mt-8">Zurück zur Startseite</button>
              </div>
          </div>

          <!-- Checkout Page -->
          <div v-if="currentPage === 'Checkout'" class="container mx-auto px-6 py-12">
            <div class="max-w-4xl mx-auto">
              <h1 class="text-3xl font-bold mb-8">Zur Kasse</h1>
              
              <!-- Checkout Steps -->
              <div class="flex justify-between mb-8">
                <div v-for="step in 3" :key="step" 
                     :class="['flex-1 text-center', checkoutStep >= step ? 'text-[#D8127D]' : 'text-gray-400']">
                  <div class="w-8 h-8 rounded-full border-2 mx-auto mb-2 flex items-center justify-center"
                       :class="checkoutStep >= step ? 'border-[#D8127D]' : 'border-gray-400'">
                    {{ step }}
                  </div>
                  <span class="text-sm">
                    {{ step === 1 ? 'Versand' : step === 2 ? 'Zahlung' : 'Bestätigung' }}
                  </span>
                </div>
              </div>

              <!-- Step 1: Shipping -->
              <div v-if="checkoutStep === 1" class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Versandadresse</h2>
                <form @submit.prevent="checkoutStep = 2" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <input v-model="shippingAddress.firstName" type="text" placeholder="Vorname" required class="form-input">
                    <input v-model="shippingAddress.lastName" type="text" placeholder="Nachname" required class="form-input">
                  </div>
                  <input v-model="shippingAddress.email" type="email" placeholder="E-Mail" required class="form-input">
                  <input v-model="shippingAddress.phone" type="tel" placeholder="Telefon" required class="form-input">
                  <input v-model="shippingAddress.address" type="text" placeholder="Adresse" required class="form-input">
                  <div class="grid grid-cols-2 gap-4">
                    <input v-model="shippingAddress.city" type="text" placeholder="Stadt" required class="form-input">
                    <input v-model="shippingAddress.postalCode" type="text" placeholder="PLZ" required class="form-input">
                  </div>
                  <select v-model="shippingAddress.country" class="form-input">
                    <option value="Deutschland">Deutschland</option>
                    <option value="Österreich">Österreich</option>
                    <option value="Schweiz">Schweiz</option>
                  </select>
                  <button type="submit" class="btn bg-[#D8127D] text-white w-full">Weiter zur Zahlung</button>
                </form>
              </div>

              <!-- Step 2: Payment -->
              <div v-if="checkoutStep === 2" class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Zahlungsmethode</h2>
                <div class="space-y-4">
                  <div class="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer"
                       :class="paymentMethod === 'credit_card' ? 'border-[#D8127D]' : 'border-gray-200'"
                       @click="paymentMethod = 'credit_card'">
                    <input type="radio" v-model="paymentMethod" value="credit_card" class="text-[#D8127D]">
                    <div>
                      <h3 class="font-semibold">Kreditkarte</h3>
                      <p class="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer"
                       :class="paymentMethod === 'paypal' ? 'border-[#D8127D]' : 'border-gray-200'"
                       @click="paymentMethod = 'paypal'">
                    <input type="radio" v-model="paymentMethod" value="paypal" class="text-[#D8127D]">
                    <div>
                      <h3 class="font-semibold">PayPal</h3>
                      <p class="text-sm text-gray-500">Schnell und sicher bezahlen</p>
                    </div>
                  </div>
                  <textarea v-model="orderNotes" placeholder="Bestellnotizen (optional)" class="form-input" rows="3"></textarea>
                  <div class="flex justify-between">
                    <button @click="checkoutStep = 1" class="btn border-2 border-gray-300">Zurück</button>
                    <button @click="checkoutStep = 3" class="btn bg-[#D8127D] text-white">Weiter zur Bestätigung</button>
                  </div>
                </div>
              </div>

              <!-- Step 3: Confirmation -->
              <div v-if="checkoutStep === 3" class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Bestellung bestätigen</h2>
                <div class="space-y-6">
                  <div class="border-b pb-4">
                    <h3 class="font-semibold mb-2">Versandadresse</h3>
                    <p>{{ shippingAddress.firstName }} {{ shippingAddress.lastName }}</p>
                    <p>{{ shippingAddress.address }}</p>
                    <p>{{ shippingAddress.postalCode }} {{ shippingAddress.city }}</p>
                    <p>{{ shippingAddress.country }}</p>
                  </div>
                  <div class="border-b pb-4">
                    <h3 class="font-semibold mb-2">Zahlungsmethode</h3>
                    <p>{{ paymentMethod === 'credit_card' ? 'Kreditkarte' : 'PayPal' }}</p>
                  </div>
                  <div class="border-b pb-4">
                    <h3 class="font-semibold mb-2">Bestellübersicht</h3>
                    <div v-for="item in cart" :key="item.id" class="flex justify-between py-2">
                      <span>{{ item.name }} ({{ item.quantity }})</span>
                      <span>{{ (parseFloat(item.price) * item.quantity).toFixed(2) }} €</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold">Gesamtsumme: {{ cartTotal.toFixed(2) }} €</p>
                  </div>
                  <div class="flex justify-between">
                    <button @click="checkoutStep = 2" class="btn border-2 border-gray-300">Zurück</button>
                    <button @click="completeOrder" class="btn bg-[#D8127D] text-white">Bestellung abschließen</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Confirmation Page -->
          <div v-if="currentPage === 'OrderConfirmation'" class="container mx-auto px-6 py-12">
            <div class="max-w-2xl mx-auto text-center">
              <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <h1 class="text-3xl font-bold mb-4">Vielen Dank für Ihre Bestellung!</h1>
              <p class="text-gray-600 mb-8">Wir haben Ihnen eine Bestätigungs-E-Mail gesendet.</p>
              <button @click="currentPage = 'Home'" class="btn bg-[#D8127D] text-white">
                Zurück zur Startseite
              </button>
            </div>
          </div>

          <!-- Creator Page -->
          <div v-if="currentPage === 'Creator'" class="container mx-auto px-4 py-8">
            <DesignCreator />
          </div>

          <!-- Enhanced Cart Sidebar -->
          <div v-if="isCartOpen" class="fixed inset-0 bg-black/50 z-50">
            <div class="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl">
              <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-bold">Warenkorb ({{ cartItemCount }})</h2>
                  <button @click="isCartOpen = false" class="text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <!-- Cart Tabs -->
                <div class="flex border-b mb-4">
                  <button 
                    v-for="tab in ['Warenkorb', 'Gespeichert', 'Kürzlich angesehen']" 
                    :key="tab"
                    class="px-4 py-2 border-b-2"
                    :class="activeCartTab === tab ? 'border-[#D8127D] text-[#D8127D]' : 'border-transparent'"
                    @click="activeCartTab = tab"
                  >
                    {{ tab }}
                  </button>
                </div>

                <!-- Cart Items -->
                <div v-if="activeCartTab === 'Warenkorb' && cart.length > 0" class="space-y-4">
                  <div v-for="(item, index) in cart" :key="index" class="flex gap-4 pb-4 border-b">
                    <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded">
                    <div class="flex-1">
                      <h3 class="font-semibold">{{ item.name }}</h3>
                      <p class="text-sm text-gray-500">
                        {{ item.selectedSize }} / {{ item.selectedColor }}
                      </p>
                      <div class="flex justify-between items-center mt-2">
                        <div class="text-[#D8127D] font-bold">
                          {{ item.price }} €
                        </div>
                        <button 
                          @click="removeFromCart(index)"
                          class="text-[#D8127D] hover:text-[#b30f68]"
                        >
                          Entfernen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Saved For Later -->
                <div v-if="activeCartTab === 'Gespeichert' && savedForLater.length > 0" class="space-y-4">
                  <div v-for="(item, index) in savedForLater" :key="index" class="flex gap-4 pb-4 border-b">
                    <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded">
                    <div class="flex-1">
                      <h3 class="font-semibold">{{ item.name }}</h3>
                      <p class="text-sm text-gray-500">
                        {{ item.selectedSize }} / {{ item.selectedColor }}
                      </p>
                      <div class="flex justify-between items-center mt-2">
                        <div class="text-[#D8127D] font-bold">
                          {{ item.price }} €
                        </div>
                        <button 
                          @click="moveToCart(index)"
                          class="text-[#D8127D] hover:text-[#b30f68]"
                        >
                          In den Warenkorb
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Recently Viewed -->
                <div v-if="activeCartTab === 'Kürzlich angesehen'" class="space-y-4">
                  <div v-for="item in recentlyViewed" :key="item.id" class="flex gap-4 pb-4 border-b">
                    <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded">
                    <div class="flex-1">
                      <h3 class="font-semibold">{{ item.name }}</h3>
                      <p class="text-[#D8127D] font-bold">{{ item.price }} €</p>
                      <button 
                        @click="addToCart(item)"
                        class="text-[#D8127D] hover:text-[#b30f68]"
                      >
                        In den Warenkorb
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Empty States -->
                <div v-if="
                  (activeCartTab === 'Warenkorb' && cart.length === 0) ||
                  (activeCartTab === 'Gespeichert' && savedForLater.length === 0) ||
                  (activeCartTab === 'Kürzlich angesehen' && recentlyViewed.length === 0)
                " class="text-center py-8">
                  <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <p class="text-gray-500">
                    {{ activeCartTab === 'Warenkorb' ? 'Ihr Warenkorb ist leer' :
                       activeCartTab === 'Gespeichert' ? 'Keine gespeicherten Artikel' :
                       'Keine kürzlich angesehenen Artikel' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </transition>
    </main>

    <!-- Footer (/layouts/default.vue) -->
    <footer class="bg-gray-900 text-white">
        <div class="container mx-auto px-6 py-12">
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                <div class="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
                    <img src="/assets/group-25.svg" alt="private-shirt.de Logo" class="h-8 mb-4">
                    <p class="text-gray-400 text-sm">Dein Druck. Deine Idee. Dein Shirt.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-3">Shop</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="#" class="footer-link">T-Shirts</a></li>
                        <li><a href="#" class="footer-link">Hoodies</a></li>
                        <li><a href="#" class="footer-link">Tassen</a></li>
                        <li><a href="#" class="footer-link">Accessoires</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-3">Service</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="#" class="footer-link">Großbestellungen</a></li>
                        <li><a href="#" class="footer-link">Hilfe & FAQ</a></li>
                        <li><a href="#" class="footer-link">Kontakt</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 class="font-semibold mb-3">Unternehmen</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="#" class="footer-link">Über uns</a></li>
                        <li><a href="#" class="footer-link">Jobs</a></li>
                        <li><a href="#" class="footer-link">Nachhaltigkeit</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 class="font-semibold mb-3">Legal</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="#" class="footer-link">Impressum</a></li>
                        <li><a href="#" class="footer-link">Datenschutz</a></li>
                        <li><a href="#" class="footer-link">AGB</a></li>
                    </ul>
                </div>
            </div>
            <div class="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p class="text-sm text-gray-400">&copy; {{ new Date().getFullYear() }} private-shirt.de. Alle Rechte vorbehalten.</p>
                <div class="flex space-x-4 mt-4 md:mt-0">
                    <!-- Trust Logos Placeholder -->
                    <span class="text-xs">VISA</span>
                    <span class="text-xs">Mastercard</span>
                    <span class="text-xs">PayPal</span>
                    <span class="text-xs">DHL</span>
                </div>
            </div>
        </div>
    </footer>
    
    <!-- Live Chat Icon (UI Only) -->
    <div class="fixed bottom-5 right-5 z-50">
      <button class="bg-[#D8127D] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-[#b30f68] transition">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
      </button>
    </div>

    <!-- Add loading state -->
    <div v-if="isLoading" class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#D8127D] border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Lade Produkte...</p>
      </div>
    </div>

    <!-- Add error state -->
    <div v-if="error" class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="text-center p-8 bg-white rounded-lg shadow-lg">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-semibold mb-2">Fehler beim Laden</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="initializeData" class="btn bg-[#D8127D] text-white">
          Erneut versuchen
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DesignCreator from './components/DesignCreator.vue'

// WooCommerce API Configuration
const WOO_CONFIG = {
  baseUrl: 'https://timob10.sg-host.com/wp-json/wc/v3',
  consumerKey: 'ck_17e70b1dcd1b0d0aab92da0c8ac7bda10a280827',
  consumerSecret: 'cs_e7d6fe86192848c4d06c5b0eb4692d32d2b42a50'
};

// State
const currentPage = ref('Home')
const selectedProduct = ref(null)
const selectedCategory = ref('all')
const selectedImage = ref(null)
const selectedSize = ref(null)
const selectedColor = ref(null)
const quantity = ref(1)
const selectedTab = ref('Beschreibung')

// Pagination
const currentPageNumber = ref(1)
const itemsPerPage = ref(12)
const totalProducts = ref(0)

// Search & Sort
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const sortBy = ref('menu_order') // Default WooCommerce sorting
const sortOptions = [
  { value: 'menu_order', label: 'Standard' },
  { value: 'popularity', label: 'Beliebtheit' },
  { value: 'date', label: 'Neueste' },
  { value: 'price', label: 'Preis: Niedrig zu Hoch' },
  { value: 'price-desc', label: 'Preis: Hoch zu Niedrig' }
];

// Cart
const cart = ref([])
const isCartOpen = ref(false)

// Data
const categories = ref([])
const readyToBuyProducts = ref([])
const customizableProducts = ref([])
const isLoading = ref(true)
const error = ref(null)

// Additional State
const checkoutStep = ref(1)
const shippingAddress = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'Deutschland'
})
const paymentMethod = ref('credit_card')
const orderNotes = ref('')

// Filters
const priceRange = ref([0, 100])
const selectedColors = ref([])
const selectedSizes = ref([])
const showFilters = ref(false)

// Cart Features
const savedForLater = ref([])
const recentlyViewed = ref([])

// Creator State
const canvas = ref(null)
const isCreatorOpen = ref(false)
const selectedTool = ref('text')
const textColor = ref('#000000')
const fontSize = ref(20)
const uploadedImages = ref([])
const activeCartTab = ref('Warenkorb')

// Debounce function
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Create debounced search function
const debouncedSearch = debounce((value) => {
  debouncedSearchQuery.value = value
}, 300) // 300ms delay

// Watch for changes in search, sort, or pagination
watch([debouncedSearchQuery, sortBy, currentPageNumber], () => {
  initializeData();
});

// WooCommerce API Service
const wooService = {
  async fetchCategories() {
    try {
      const response = await fetch(
        `${WOO_CONFIG.baseUrl}/products/categories?per_page=100`,
        {
          headers: {
            'Authorization': 'Basic ' + btoa(`${WOO_CONFIG.consumerKey}:${WOO_CONFIG.consumerSecret}`)
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (err) {
      console.error('Error fetching categories:', err);
      throw err;
    }
  },

  async fetchProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        per_page: itemsPerPage.value,
        page: currentPageNumber.value,
        search: debouncedSearchQuery.value,
        orderby: sortBy.value,
        ...params
      }).toString();

      const response = await fetch(
        `${WOO_CONFIG.baseUrl}/products?${queryParams}`,
        {
          headers: {
            'Authorization': 'Basic ' + btoa(`${WOO_CONFIG.consumerKey}:${WOO_CONFIG.consumerSecret}`)
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch products');
      
      // Get total products from headers
      totalProducts.value = parseInt(response.headers.get('X-WP-Total')) || 0;
      
      return await response.json();
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  },

  async fetchProduct(id) {
    try {
      const response = await fetch(
        `${WOO_CONFIG.baseUrl}/products/${id}`,
        {
          headers: {
            'Authorization': 'Basic ' + btoa(`${WOO_CONFIG.consumerKey}:${WOO_CONFIG.consumerSecret}`)
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    }
  }
};

// Cart Methods
const addToCart = (product, quantity = 1) => {
  const existingItem = cart.value.find(item => 
    item.id === product.id && 
    item.selectedSize === selectedSize.value && 
    item.selectedColor === selectedColor.value
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.value.push({
      ...product,
      quantity,
      selectedSize: selectedSize.value,
      selectedColor: selectedColor.value
    });
  }
  
  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

const updateCartItemQuantity = (index, quantity) => {
  if (quantity < 1) return;
  cart.value[index].quantity = quantity;
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

const clearCart = () => {
  cart.value = [];
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

// Computed properties
const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);
});

const cartItemCount = computed(() => {
  return cart.value.reduce((count, item) => count + item.quantity, 0);
});

const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / itemsPerPage.value);
});

// Initialize Data
const initializeData = async () => {
  try {
    isLoading.value = true;
    
    // Fetch categories
    const wooCategories = await wooService.fetchCategories();
    categories.value = [
      { id: 'all', name: 'Alle Kategorien' },
      ...wooCategories.map(cat => ({
        id: cat.id.toString(),
        name: cat.name,
        image: cat.image?.src || '/assets/placeholder.jpg'
      }))
    ];

    // Fetch products
    const products = await wooService.fetchProducts();
    
    // Separate products into ready-to-buy and customizable
    readyToBuyProducts.value = products
      .filter(product => !product.meta_data?.some(meta => meta.key === '_customizable' && meta.value === 'yes'))
      .map(formatProduct);

    customizableProducts.value = products
      .filter(product => product.meta_data?.some(meta => meta.key === '_customizable' && meta.value === 'yes'))
      .map(formatProduct);

  } catch (err) {
    error.value = err.message;
    console.error('Error initializing data:', err);
  } finally {
    isLoading.value = false;
  }
};

// Format product data from WooCommerce
const formatProduct = (product) => {
  const customizable = product.meta_data?.some(meta => meta.key === '_customizable' && meta.value === 'yes');
  
  return {
    id: product.id,
    category: product.categories[0]?.id.toString() || 'all',
    name: product.name,
    price: product.price,
    image: product.images[0]?.src || '/assets/placeholder.jpg',
    description: product.description,
    gallery: product.images.map(img => img.src),
    customizable,
    sizes: product.attributes?.find(attr => attr.name === 'Size')?.options || [],
    colors: product.attributes?.find(attr => attr.name === 'Color')?.options || [],
    stock_status: product.stock_status,
    stock_quantity: product.stock_quantity,
    sku: product.sku,
    weight: product.weight,
    dimensions: product.dimensions
  };
};

// Computed properties for filtered products
const filteredReadyToBuyProducts = computed(() => {
  if (selectedCategory.value === 'all') return readyToBuyProducts.value;
  return readyToBuyProducts.value.filter(product => product.category === selectedCategory.value);
});

const filteredCustomizableProducts = computed(() => {
  if (selectedCategory.value === 'all') return customizableProducts.value;
  return customizableProducts.value.filter(product => product.category === selectedCategory.value);
});

// Load data on component mount
onMounted(() => {
  const savedCart = localStorage.getItem('cart');
  const savedForLaterData = localStorage.getItem('savedForLater');
  const recentlyViewedData = localStorage.getItem('recentlyViewed');
  
  if (savedCart) cart.value = JSON.parse(savedCart);
  if (savedForLaterData) savedForLater.value = JSON.parse(savedForLaterData);
  if (recentlyViewedData) recentlyViewed.value = JSON.parse(recentlyViewedData);
  
  initializeData();
});

// Icons from Lucide (lucide.dev) - using raw SVG paths
const features = ref([
  { title: 'Premiumdruck ab 1 Stück', description: 'Keine Mindestbestellmenge. Perfekt für Einzelstücke und Geschenke.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>' },
  { title: 'Nachhaltige Textilien', description: 'Wir setzen auf Bio-Baumwolle und umweltfreundliche Materialien.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343m11.314 11.314a8 8 0 00-11.314-11.314"/>' },
  { title: 'Versand in 2–4 Tagen', description: 'Schnelle Produktion und Lieferung mit unseren zuverlässigen Partnern.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>' },
  { title: 'Made in Germany', description: 'Druck und Veredelung finden direkt bei uns in Deutschland statt.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M4 17v4M2 19h4M17 3v4M15 5h4M16 17v4M14 19h4"/>' }
]);

const b2bBenefits = ref([
  { title: 'Attraktive Mengenrabatte', description: 'Sparen Sie bei größeren Bestellungen für Ihr Team.', icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { title: 'Persönliche Beratung', description: 'Ein fester Ansprechpartner begleitet Ihr Projekt.', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { title: 'Kauf auf Rechnung', description: 'Bequeme und sichere Zahlung für Geschäftskunden.', icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' }
]);

// Cart Methods
const moveToSavedForLater = (index) => {
  const item = cart.value[index];
  savedForLater.value.push(item);
  removeFromCart(index);
  localStorage.setItem('savedForLater', JSON.stringify(savedForLater.value));
};

const moveToCart = (index) => {
  const item = savedForLater.value[index];
  addToCart(item, item.quantity);
  savedForLater.value.splice(index, 1);
  localStorage.setItem('savedForLater', JSON.stringify(savedForLater.value));
};

const addToRecentlyViewed = (product) => {
  const index = recentlyViewed.value.findIndex(p => p.id === product.id);
  if (index > -1) {
    recentlyViewed.value.splice(index, 1);
  }
  recentlyViewed.value.unshift(product);
  if (recentlyViewed.value.length > 4) {
    recentlyViewed.value.pop();
  }
  localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed.value));
};

// Checkout Methods
const proceedToCheckout = () => {
  if (cart.value.length === 0) return;
  currentPage.value = 'Checkout';
  checkoutStep.value = 1;
};

const completeOrder = async () => {
  try {
    // Here you would typically create the order in WooCommerce
    const orderData = {
      payment_method: paymentMethod.value,
      payment_method_title: paymentMethod.value === 'credit_card' ? 'Kreditkarte' : 'PayPal',
      set_paid: false,
      billing: shippingAddress.value,
      shipping: shippingAddress.value,
      line_items: cart.value.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      })),
      customer_note: orderNotes.value
    };
    
    // Clear cart after successful order
    clearCart();
    currentPage.value = 'OrderConfirmation';
  } catch (error) {
    console.error('Error creating order:', error);
  }
};

// Watch for page changes to initialize canvas
watch(() => currentPage.value, (newPage) => {
  if (newPage === 'Creator') {
    nextTick(() => {
      initCanvas();
    });
  }
});

</script>

<style>
/* In a real Nuxt/Vue project with Tailwind, this would be in a global CSS file
  or handled by Tailwind's configuration.
*/
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --primary-color: #D8127D;
  --primary-hover: #b30f68;
}

body {
  font-family: 'Inter', sans-serif;
}

/* Custom Component Styles using @apply */
.btn {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-center transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}
.btn-lg {
  @apply px-8 py-4 text-lg;
}
.btn-primary {
  @apply bg-[#D8127D] text-white hover:bg-[#b30f68] focus:ring-[#D8127D];
}
.btn-secondary {
  @apply bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-600;
}
.btn-primary-inverted {
   @apply bg-white text-[#D8127D] hover:bg-pink-50 focus:ring-[#D8127D];
}
.btn-secondary-outline {
  @apply bg-transparent text-white border-2 border-white hover:bg-white hover:text-gray-900;
}
.nav-link {
  @apply text-gray-600 hover:text-[#D8127D] font-medium cursor-pointer transition;
}
.footer-link {
    @apply text-gray-400 hover:text-white transition-colors duration-200;
}
.category-tile {
  @apply relative aspect-w-1 aspect-h-1 md:aspect-w-4 md:aspect-h-5 w-full rounded-lg overflow-hidden cursor-pointer shadow-lg;
}
.form-input {
    @apply w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D8127D] focus:border-[#D8127D] transition;
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

/* Base styles for SVGs injected via v-html to ensure they inherit color */
svg {
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
}

/* Update feature icons to use primary color */
.feature-icon {
  @apply text-[#D8127D];
}

/* Update B2B section background */
.bg-indigo-600 {
  @apply bg-[#D8127D];
}

/* Update hover states */
.hover\:bg-indigo-700:hover {
  @apply hover:bg-[#b30f68];
}

/* Update focus rings */
.focus\:ring-indigo-500:focus {
  @apply focus:ring-[#D8127D];
}

/* Add new styles for the creator */
#creator-canvas {
  width: 100% !important;
  height: 500px !important;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

/* Add styles for filters */
.filter-section {
  @apply bg-white p-4 rounded-lg shadow-md;
}

.filter-title {
  @apply font-semibold mb-4;
}

.filter-group {
  @apply space-y-2;
}

.filter-label {
  @apply flex items-center space-x-2;
}

/* Add styles for checkout */
.checkout-step {
  @apply flex items-center space-x-2;
}

.checkout-step-number {
  @apply w-8 h-8 rounded-full border-2 flex items-center justify-center;
}

/* Add styles for cart tabs */
.cart-tab {
  @apply px-4 py-2 border-b-2;
}

.cart-tab-active {
  @apply border-[#D8127D] text-[#D8127D];
}
</style>
