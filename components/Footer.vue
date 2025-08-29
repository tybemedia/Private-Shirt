<template>
  <footer class="bg-[#D8127D] text-white">
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div class="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
          <img src="/assets/group-25.svg" 
               alt="private-shirt.de Logo" 
               class="h-8 mb-4"
               @error="handleLogoError">
          <p class="text-white text-sm opacity-80">Dein Druck. Deine Idee. Dein Shirt.</p>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Shop</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">T-Shirts</a></li>
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">Hoodies</a></li>
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">Tassen</a></li>
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">Accessoires</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Service</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">Großbestellungen</a></li>
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">Hilfe & FAQ</a></li>
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">Kontakt</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Unternehmen</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">Über uns</a></li>
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">Jobs</a></li>
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">Nachhaltigkeit</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Legal</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">Impressum</a></li>
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">Datenschutz</a></li>
            <li><a href="#" class="footer-link text-white hover:text-[#ffd44d]">AGB</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-12 border-t border-[#ffd44d] pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-white opacity-80">&copy; {{ new Date().getFullYear() }} private-shirt.de. Alle Rechte vorbehalten.</p>
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
</template>

<script setup>
// Methods
const handleLogoError = (event) => {
  // Replace logo with text
  const logoContainer = event.target.parentElement;
  const textLogo = document.createElement('span');
  textLogo.textContent = 'private-shirt.de';
  textLogo.className = 'text-2xl font-bold text-white';
  logoContainer.replaceChild(textLogo, event.target);
}
</script>

<style scoped>
.footer-link {
  @apply text-gray-400 hover:text-white transition-colors duration-200;
}
</style>
  