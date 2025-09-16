<template>
  <div class="min-h-screen bg-black">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img 
          :src="getImageUrl('zhizuo.png')" 
          alt="瓷器制作工艺"
          class="w-full h-full object-cover opacity-20"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-light text-white mb-6 tracking-wide">
            About Us
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Preserving Millennia of Craftsmanship, Creating Porcelain Legends
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <!-- Company History Section -->
      <div class="mb-24">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Text Content -->
          <div class="space-y-8">
            <div class="space-y-4">
              <h2 class="text-4xl font-light text-white mb-6">
                Millennia of Heritage
              </h2>
              <p class="text-lg text-gray-300 leading-relaxed">
                Our porcelain enterprise traces its origins to the Tang Dynasty, having weathered centuries of change while maintaining the artisan spirit of "pursuing excellence and preserving classics." From humble workshops to modern enterprises, we have witnessed the glorious journey of Chinese porcelain culture.
              </p>
            </div>
            
            <div class="space-y-4">
              <h3 class="text-2xl font-light text-white">
                Craftsmanship Legacy
              </h3>
              <p class="text-gray-300 leading-relaxed">
                Each piece of porcelain carries the dedication and wisdom of master craftsmen. We adhere to traditional handcrafting techniques while incorporating modern technology, ensuring every creation meets the highest artistic standards. From material selection to firing, every step is meticulously controlled to achieve perfection.
              </p>
            </div>
          </div>
          
          <!-- Image -->
          <div class="relative group">
            <div class="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img 
                :src="getImageUrl('zhizuo.png')" 
                alt="Porcelain Craftsmanship"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>

      <!-- Timeline Section -->
      <div class="mb-24">
        <h2 class="text-4xl font-light text-white text-center mb-16">
          Historical Timeline
        </h2>
        
        <div class="relative">
          <!-- Timeline Line -->
          <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-full"></div>
          
          <!-- Timeline Items -->
          <div class="space-y-16">
            <!-- Tang Dynasty -->
            <div class="relative flex items-center">
              <div class="w-1/2 pr-8 text-right">
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div class="text-amber-400 text-sm font-medium mb-2">618-907 AD</div>
                  <h3 class="text-2xl font-light text-white mb-4">Tang Dynasty Origins</h3>
                  <p class="text-gray-300 leading-relaxed">
                    Our porcelain tradition began in the Tang Dynasty, renowned for celadon and white porcelain. Master craftsmen developed sophisticated ceramic techniques, laying a solid foundation for future generations.
                  </p>
                </div>
              </div>
              
              <div class="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-amber-400 rounded-full border-4 border-black shadow-lg"></div>
              
              <div class="w-1/2 pl-8"></div>
            </div>

            <!-- Song Dynasty -->
            <div class="relative flex items-center">
              <div class="w-1/2 pr-8"></div>
              
              <div class="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-amber-400 rounded-full border-4 border-black shadow-lg"></div>
              
              <div class="w-1/2 pl-8">
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div class="text-amber-400 text-sm font-medium mb-2">960-1279 AD</div>
                  <h3 class="text-2xl font-light text-white mb-4">Song Dynasty Golden Age</h3>
                  <p class="text-gray-300 leading-relaxed">
                    The Song Dynasty marked the golden age of porcelain development. We mastered more refined techniques, creating renowned celadon, white, and black porcelain, reaching unprecedented levels of craftsmanship.
                  </p>
                </div>
              </div>
            </div>

            <!-- Ming Dynasty -->
            <div class="relative flex items-center">
              <div class="w-1/2 pr-8 text-right">
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div class="text-amber-400 text-sm font-medium mb-2">1368-1644 AD</div>
                  <h3 class="text-2xl font-light text-white mb-4">Ming Dynasty Innovation</h3>
                  <p class="text-gray-300 leading-relaxed">
                    During the Ming Dynasty, we introduced blue-and-white porcelain techniques, creating distinctive decorative styles. Our products were exported worldwide, becoming an important symbol of Chinese culture.
                  </p>
                </div>
              </div>
              
              <div class="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-amber-400 rounded-full border-4 border-black shadow-lg"></div>
              
              <div class="w-1/2 pl-8"></div>
            </div>

            <!-- Modern Era -->
            <div class="relative flex items-center">
              <div class="w-1/2 pr-8"></div>
              
              <div class="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-amber-400 rounded-full border-4 border-black shadow-lg"></div>
              
              <div class="w-1/2 pl-8">
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div class="text-amber-400 text-sm font-medium mb-2">Modern Era</div>
                  <h3 class="text-2xl font-light text-white mb-4">Modern Renaissance</h3>
                  <p class="text-gray-300 leading-relaxed">
                    In modern times, we combine traditional craftsmanship with contemporary technology, continuously innovating product designs. We breathe new life into ancient porcelain art while preserving the cultural heritage of millennia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Values Section -->
      <div class="mb-24">
        <h2 class="text-4xl font-light text-white text-center mb-16">
          Our Values
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Craftsmanship -->
          <div class="text-center group">
            <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-light text-white mb-4">Exquisite Craftsmanship</h3>
            <p class="text-gray-300 leading-relaxed">
              We adhere to traditional handcrafting methods, with each piece carefully crafted to ensure the highest artistic quality and craftsmanship standards.
            </p>
          </div>

          <!-- Innovation -->
          <div class="text-center group">
            <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h3 class="text-2xl font-light text-white mb-4">Continuous Innovation</h3>
            <p class="text-gray-300 leading-relaxed">
              Building upon traditional foundations, we continuously explore new design concepts and manufacturing techniques, keeping ancient porcelain art relevant in modern times.
            </p>
          </div>

          <!-- Heritage -->
          <div class="text-center group">
            <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h3 class="text-2xl font-light text-white mb-4">Cultural Heritage</h3>
            <p class="text-gray-300 leading-relaxed">
              We are committed to preserving and passing on Chinese porcelain culture, helping more people understand and appreciate the unique charm of this millennia-old artistic treasure.
            </p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center">
        <div class="bg-gradient-to-r from-amber-400/10 to-amber-600/10 backdrop-blur-sm rounded-3xl p-12 border border-amber-400/20">
          <h2 class="text-3xl font-light text-white mb-6">
            Explore Our Porcelain World
          </h2>
          <p class="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Each piece of porcelain carries the cultural heritage of millennia and the wisdom of master craftsmen. We welcome you to explore our products and experience the infinite charm of Chinese porcelain art.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              to="/products" 
              class="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-medium rounded-full hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105"
            >
              Browse Products
            </router-link>
            <router-link 
              to="/" 
              class="px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Return Home
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 获取图片URL的函数
function getImageUrl(filename: string): string {
  return new URL(`../assets/tea_image/${filename}`, import.meta.url).href
}

// 页面加载动画
onMounted(() => {
  // 简化动画实现，避免DOM操作错误
  console.log('AboutView mounted successfully')
})
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #f59e0b, #d97706);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #d97706, #b45309);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 页面加载动画 */
.space-y-8 > div,
.space-y-16 > div {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.6s ease-out forwards;
}

.space-y-8 > div:nth-child(1) { animation-delay: 0.1s; }
.space-y-8 > div:nth-child(2) { animation-delay: 0.2s; }
.space-y-8 > div:nth-child(3) { animation-delay: 0.3s; }
.space-y-8 > div:nth-child(4) { animation-delay: 0.4s; }

.space-y-16 > div:nth-child(1) { animation-delay: 0.1s; }
.space-y-16 > div:nth-child(2) { animation-delay: 0.3s; }
.space-y-16 > div:nth-child(3) { animation-delay: 0.5s; }
.space-y-16 > div:nth-child(4) { animation-delay: 0.7s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式字体 */
@media (max-width: 768px) {
  .text-5xl {
    font-size: 3rem;
  }
  
  .text-7xl {
    font-size: 4rem;
  }
}

/* 渐变文字效果 */
.gradient-text {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 悬停效果 */
.hover-lift {
  transition: transform 0.3s ease-out;
}

.hover-lift:hover {
  transform: translateY(-5px);
}

/* 玻璃态效果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>