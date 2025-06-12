<template>
    <section class="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-white text-center px-4">
      <div class="absolute inset-0 bg-black/50 z-10"></div>
      <img src="https://images.unsplash.com/photo-1620799139652-715e4d5b232d?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="[Person in einem individuell bedruckten T-Shirt]" class="absolute inset-0 w-full h-full object-cover">
      <div class="relative z-20 max-w-3xl">
        <h1 class="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 shadow-lg">Individuell bedruckte Shirts & mehr – in Premium-Qualität</h1>
        <p class="text-lg md:text-2xl font-light mb-8">Für dich, dein Team oder dein Business – ab 1 Stück.</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink to="/t-shirts" class="btn btn-primary btn-lg">Jetzt gestalten</NuxtLink>
          <NuxtLink to="/grossbestellung" class="btn btn-secondary-outline btn-lg">Großbestellung anfragen</NuxtLink>
        </div>
      </div>
    </section>
  </template>
  