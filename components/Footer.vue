<template>
    <footer class="bg-gray-900 text-white">
        <div class="container mx-auto px-6 py-12">
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                <div class="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
                    <h3 class="text-xl font-bold mb-2">private-shirt.de</h3>
                    <p class="text-gray-400 text-sm">Dein Druck. Deine Idee. Dein Shirt.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-3">Shop</h4>
                    <ul class="space-y-2 text-sm">
                        <li><NuxtLink to="/t-shirts" class="footer-link">T-Shirts</NuxtLink></li>
                        <li><NuxtLink to="/hoodies" class="footer-link">Hoodies</NuxtLink></li>
                        <li><NuxtLink to="/tassen" class="footer-link">Tassen</NuxtLink></li>
                        <li><NuxtLink to="/accessoires" class="footer-link">Accessoires</NuxtLink></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-3">Service</h4>
                    <ul class="space-y-2 text-sm">
                        <li><NuxtLink to="/grossbestellung" class="footer-link">Großbestellungen</NuxtLink></li>
                        <li><NuxtLink to="/hilfe" class="footer-link">Hilfe & FAQ</NuxtLink></li>
                        <li><NuxtLink to="/kontakt" class="footer-link">Kontakt</NuxtLink></li>
                    </ul>
                </div>
                 <div>
                    <h4 class="font-semibold mb-3">Unternehmen</h4>
                    <ul class="space-y-2 text-sm">
                        <li><NuxtLink to="/ueber-uns" class="footer-link">Über uns</NuxtLink></li>
                        <li><NuxtLink to="/jobs" class="footer-link">Jobs</NuxtLink></li>
                        <li><NuxtLink to="/nachhaltigkeit" class="footer-link">Nachhaltigkeit</NuxtLink></li>
                    </ul>
                </div>
                 <div>
                    <h4 class="font-semibold mb-3">Legal</h4>
                    <ul class="space-y-2 text-sm">
                        <li><NuxtLink to="/impressum" class="footer-link">Impressum</NuxtLink></li>
                        <li><NuxtLink to="/datenschutz" class="footer-link">Datenschutz</NuxtLink></li>
                        <li><NuxtLink to="/agb" class="footer-link">AGB</NuxtLink></li>
                    </ul>
                </div>
            </div>
            <div class="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p class="text-sm text-gray-400">&copy; {{ new Date().getFullYear() }} private-shirt.de. Alle Rechte vorbehalten.</p>
                <div class="flex space-x-6 items-center mt-4 md:mt-0 text-gray-400">
                    <!-- Trust Logos Placeholder -->
                    <span>VISA</span>
                    <span>Mastercard</span>
                    <span>PayPal</span>
                    <span>DHL</span>
                </div>
            </div>
        </div>
    </footer>
  </template>
  