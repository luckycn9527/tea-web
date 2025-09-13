<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path === '/admin')
</script>

<template>
  <div id="app" class="bg-black min-h-screen" style="background-color: black !important;">
    <NavigationBar v-if="!isAdminRoute" />
    <main class="min-h-screen bg-black" style="background-color: black !important;">
      <RouterView />
    </main>
    
    <!-- Footer -->
    <footer v-if="!isAdminRoute" class="bg-black text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">Support</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Returns & Resizes</a></li>
              <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">Legal</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">#PorcelainGallery</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition-colors">Our Heritage</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Master Artisans</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Authentication</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">Stay Connected!</h3>
            <p class="text-gray-300 mb-4">Discover new porcelain masterpieces and exclusive dynasty collections!</p>
            <form class="flex gap-2">
              <input 
                type="email" 
                placeholder="E-mail"
                class="flex-1 px-3 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-white"
              />
              <button 
                type="submit"
                class="bg-white text-black px-4 py-2 font-semibold hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 - Porcelain Gallery</p>
          <div class="mt-4 flex justify-center space-x-4 text-sm">
            <span>American Express</span>
            <span>Apple Pay</span>
            <span>Bancontact</span>
            <span>Google Pay</span>
            <span>iDEAL</span>
            <span>Maestro</span>
            <span>Mastercard</span>
            <span>PayPal</span>
            <span>Shop Pay</span>
            <span>Union Pay</span>
            <span>Visa</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

footer {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .md\:grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  footer {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
</style>