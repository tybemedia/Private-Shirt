<template>
  <div class="bg-gray-50 min-h-screen font-sans text-gray-800">
    <!-- Notification Bar -->
    <div class="bg-gray-900 text-white text-center py-2 text-sm font-medium overflow-hidden relative h-8">
      <transition name="slide-fade" mode="out-in">
        <span :key="currentNotificationMessage">{{ notificationMessages[currentNotificationMessage] }}</span>
      </transition>
    </div>

    <!-- Header & Navigation -->
    <Header />

    <main>
      <!-- Page Content -->
      <slot />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
// Notification system
const currentNotificationMessage = ref(0)
const notificationMessages = [
  '🎉 Kostenloser Versand ab 50€ Bestellwert!',
  '⚡ Express-Druck: Deine Bestellung in 24h fertig',
  '💯 100% Zufriedenheitsgarantie'
]

// Auto-rotate notifications
onMounted(() => {
  setInterval(() => {
    currentNotificationMessage.value = (currentNotificationMessage.value + 1) % notificationMessages.length
  }, 5000)
})
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
