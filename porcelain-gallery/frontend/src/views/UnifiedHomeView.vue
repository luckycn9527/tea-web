<!-- 统一首页 - 替换所有混乱的首页代码 -->
<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <UnifiedImage
        :src="'/src/assets/tea_image/background.png'"
        alt="Porcelain Gallery Background"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-5xl md:text-7xl font-bold mb-6">
          {{ $t('home.hero.title') }}
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          {{ $t('home.hero.subtitle') }}
        </p>
        <button
          @click="goToProducts"
          class="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
        >
          {{ $t('home.hero.cta') }}
        </button>
      </div>
    </section>

    <!-- Best Sellers Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            {{ $t('home.bestSellers.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('home.bestSellers.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(product, index) in bestSellers"
            :key="index"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <!-- Main Image -->
            <div class="aspect-w-16 aspect-h-9">
              <UnifiedImage
                :src="product.mainImage"
                :alt="product.name"
                class="w-full h-48 object-cover"
              />
            </div>

            <!-- Product Info -->
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ product.name }}
              </h3>
              <p class="text-xl font-bold text-red-600 mb-3">
                {{ product.price }}
              </p>

              <!-- Thumbnails -->
              <div class="grid grid-cols-3 gap-2">
                <UnifiedImage
                  v-for="(thumbnail, thumbIndex) in product.thumbnails"
                  :key="thumbIndex"
                  :src="thumbnail"
                  :alt="`${product.name} thumbnail ${thumbIndex + 1}`"
                  class="w-full h-16 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Rare Dynasty Collection Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold text-gray-900 mb-6">
              {{ rareDynastyCollection.title }}
            </h2>
            <p class="text-xl text-gray-600 mb-8">
              {{ rareDynastyCollection.description }}
            </p>
            <button
              @click="goToProducts"
              class="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              {{ rareDynastyCollection.buttonText }}
            </button>
          </div>
          <div class="aspect-w-16 aspect-h-9">
            <UnifiedImage
              :src="rareDynastyCollection.image"
              :alt="rareDynastyCollection.title"
              class="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Explore by Dynasty Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            {{ $t('home.dynasties.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('home.dynasties.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div
            v-for="(image, index) in dynastyImages"
            :key="index"
            class="text-center"
          >
            <div class="aspect-w-16 aspect-h-9 mb-4">
              <UnifiedImage
                :src="image"
                :alt="`Dynasty ${index + 1}`"
                class="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                @click="goToProducts"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ getDynastyName(index) }}
            </h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Heritage Story Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="aspect-w-16 aspect-h-9">
            <UnifiedImage
              :src="heritageStory.image"
              :alt="heritageStory.title"
              class="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div>
            <h2 class="text-4xl font-bold text-gray-900 mb-6">
              {{ heritageStory.title }}
            </h2>
            <p class="text-xl text-gray-600 mb-6">
              {{ heritageStory.description1 }}
            </p>
            <p class="text-xl text-gray-600">
              {{ heritageStory.description2 }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            {{ $t('home.featured.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('home.featured.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            @click="goToProduct(product.id)"
          >
            <div class="aspect-w-16 aspect-h-9">
              <UnifiedImage
                :src="product.primary_image"
                :alt="product.name_en"
                class="w-full h-48 object-cover"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ locale === 'zh' ? product.name_cn : product.name_en }}
              </h3>
              <p class="text-gray-600 text-sm mb-2">
                {{ locale === 'zh' ? product.description_cn : product.description_en }}
              </p>
              <div class="flex justify-between items-center">
                <span class="text-lg font-bold text-red-600">${{ product.price }}</span>
                <span class="text-sm text-gray-500">{{ product.dynasty_name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUnifiedData } from '../config/data-manager'
import UnifiedImage from '../components/UnifiedImage.vue'

const router = useRouter()
const { locale } = useI18n()
const { 
  products, 
  featuredProducts, 
  bestSellers, 
  rareDynastyCollection, 
  heritageStory, 
  dynastyImages, 
  initialize 
} = useUnifiedData()

// 响应式数据
const loading = ref(true)

// 计算属性
const dynastyNames = ['Tang Dynasty', 'Song Dynasty', 'Yuan Dynasty', 'Ming Dynasty', 'Qing Dynasty']

const getDynastyName = (index: number) => {
  return dynastyNames[index] || `Dynasty ${index + 1}`
}

// 方法
const goToProducts = () => {
  router.push('/products')
}

const goToProduct = (productId: number) => {
  router.push(`/product/${productId}`)
}

// 生命周期
onMounted(async () => {
  try {
    await initialize()
    console.log('UnifiedHomeView initialized with', products.value.length, 'products')
    console.log('Best Sellers:', bestSellers.value.length)
    console.log('Featured Products:', featuredProducts.value.length)
  } catch (error) {
    console.error('Error initializing UnifiedHomeView:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-h-9 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
