<template>
  <div class="homepage-content-management">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">首页内容管理</h2>
      <p class="text-gray-600">管理首页各个内容区域的文字、图片和配置</p>
    </div>

    <!-- Hero Section 配置 -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Hero Section 配置</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 主标题 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">主标题</label>
          <input
            v-model="heroConfig.mainTitle"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Express Your Unique Style"
          />
        </div>

        <!-- 副标题 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">副标题</label>
          <input
            v-model="heroConfig.subtitle"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="MOST TRUSTED SOURCE FOR AUTHENTIC CHINESE PORCELAIN MASTERPIECES"
          />
        </div>

        <!-- 背景图片 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">背景图片</label>
          <div class="flex items-center space-x-4">
            <img 
              :src="getImageSrc(heroConfig.backgroundImage)" 
              alt="Background Preview"
              class="w-32 h-20 object-cover rounded border"
            />
            <button
              @click="showImageSelector('heroBackground')"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              选择图片
            </button>
          </div>
        </div>

        <!-- 特性列表 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">特性列表</label>
          <div class="space-y-3">
            <div v-for="(feature, index) in heroConfig.features" :key="index" class="flex items-center space-x-3">
              <input
                v-model="heroConfig.features[index]"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="`特性 ${index + 1}`"
              />
              <button
                @click="removeFeature(index)"
                class="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                删除
              </button>
            </div>
            <button
              @click="addFeature"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              添加特性
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="saveHeroConfig"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          保存 Hero Section
        </button>
      </div>
    </div>

    <!-- Rare Dynasty Collection 配置 -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Rare Dynasty Collection 配置</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 标题 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">标题</label>
          <input
            v-model="rareDynastyConfig.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rare Dynasty Collection"
          />
        </div>

        <!-- 按钮文字 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">按钮文字</label>
          <input
            v-model="rareDynastyConfig.buttonText"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="EXPLORE COLLECTION"
          />
        </div>

        <!-- 描述 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">描述</label>
          <textarea
            v-model="rareDynastyConfig.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Crafted in small batches with rare find stones, each piece is made to stand out, just as unique as the person who wears it."
          ></textarea>
        </div>

        <!-- 图片 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">图片</label>
          <div class="flex items-center space-x-4">
            <img 
              :src="getImageSrc(rareDynastyConfig.image)" 
              alt="Rare Dynasty Collection Preview"
              class="w-32 h-20 object-cover rounded border"
            />
            <button
              @click="showImageSelector('rareDynastyImage')"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              选择图片
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="saveRareDynastyConfig"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          保存 Rare Dynasty Collection
        </button>
      </div>
    </div>

    <!-- Heritage Story 配置 -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Heritage Story 配置</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 标题 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">标题</label>
          <input
            v-model="heritageStoryConfig.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Forget mass-produced"
          />
        </div>

        <!-- 按钮文字 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">按钮文字</label>
          <input
            v-model="heritageStoryConfig.buttonText"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="DISCOVER OUR STORY"
          />
        </div>

        <!-- 描述1 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">描述1</label>
          <textarea
            v-model="heritageStoryConfig.description1"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="From our hands to yours. In China, the birthplace of porcelain, our family-owned business creates each piece with meticulous care, using only the finest materials and traditional techniques."
          ></textarea>
        </div>

        <!-- 描述2 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">描述2</label>
          <textarea
            v-model="heritageStoryConfig.description2"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Every piece tells a story of centuries-old craftsmanship, passed down through generations of master artisans who have dedicated their lives to perfecting this ancient art."
          ></textarea>
        </div>

        <!-- 图片 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">图片</label>
          <div class="flex items-center space-x-4">
            <img 
              :src="getImageSrc(heritageStoryConfig.image)" 
              alt="Heritage Story Preview"
              class="w-32 h-20 object-cover rounded border"
            />
            <button
              @click="showImageSelector('heritageStoryImage')"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              选择图片
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="saveHeritageStoryConfig"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          保存 Heritage Story
        </button>
      </div>
    </div>

    <!-- 图片选择器模态框 -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">选择图片</h3>
          <button @click="showImageModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <div 
            v-for="imageName in availableImages" 
            :key="imageName"
            :class="[
              'cursor-pointer border-2 rounded-lg overflow-hidden hover:opacity-80 transition-opacity',
              selectedImage === imageName ? 'border-blue-500' : 'border-gray-200'
            ]"
            @click="selectImage(imageName)"
          >
            <img 
              :src="getImageSrc(`/src/assets/tea_image/${imageName}`)" 
              :alt="imageName"
              class="w-full h-20 object-cover"
            />
            <div class="p-2 text-xs text-center truncate">{{ imageName }}</div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="showImageModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="confirmImageSelection"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            确认选择
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

// 响应式数据
const showImageModal = ref(false)
const currentImageType = ref('')
const selectedImage = ref('')

// 配置数据
const heroConfig = ref({
  mainTitle: 'Express Your Unique Style',
  subtitle: 'MOST TRUSTED SOURCE FOR AUTHENTIC CHINESE PORCELAIN MASTERPIECES',
  backgroundImage: '/src/assets/tea_image/background.png',
  features: [
    'Hand-crafted by Master Artisans',
    'Authenticity Guaranteed',
    'Centuries of Heritage'
  ]
})

const rareDynastyConfig = ref({
  title: 'Rare Dynasty Collection',
  description: 'Crafted in small batches with rare find stones, each piece is made to stand out, just as unique as the person who wears it.',
  buttonText: 'EXPLORE COLLECTION',
  image: '/src/assets/tea_image/best.png'
})

const heritageStoryConfig = ref({
  title: 'Forget mass-produced',
  description1: 'From our hands to yours. In China, the birthplace of porcelain, our family-owned business creates each piece with meticulous care, using only the finest materials and traditional techniques.',
  description2: 'Every piece tells a story of centuries-old craftsmanship, passed down through generations of master artisans who have dedicated their lives to perfecting this ancient art.',
  buttonText: 'DISCOVER OUR STORY',
  image: '/src/assets/tea_image/zhizuo.png'
})

// 可用图片列表
const availableImages = ref([
  '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png',
  '9.png', '10.png', '11.png', '12.png', '13.png', '14.png', '15.png', '16.png',
  '17.png', '18.png', '19.png', '20.png', '21.png', '22.png', '23.png',
  'tang.png', 'song.png', 'yuan.png', 'ming.png', 'qing.png', 'zhizuo.png', 'best.png', 'background.png'
])

// 方法
function getImageSrc(imagePath: string) {
  if (imagePath.startsWith('/src/assets/')) {
    return new URL(`../assets/tea_image/${imagePath.split('/').pop()}`, import.meta.url).href
  }
  return imagePath
}

function showImageSelector(imageType: string) {
  currentImageType.value = imageType
  showImageModal.value = true
}

function selectImage(imageName: string) {
  selectedImage.value = imageName
}

function confirmImageSelection() {
  const imagePath = `/src/assets/tea_image/${selectedImage.value}`
  
  switch (currentImageType.value) {
    case 'heroBackground':
      heroConfig.value.backgroundImage = imagePath
      break
    case 'rareDynastyImage':
      rareDynastyConfig.value.image = imagePath
      break
    case 'heritageStoryImage':
      heritageStoryConfig.value.image = imagePath
      break
  }
  
  showImageModal.value = false
  selectedImage.value = ''
}

function addFeature() {
  heroConfig.value.features.push('')
}

function removeFeature(index: number) {
  heroConfig.value.features.splice(index, 1)
}

function saveHeroConfig() {
  // 保存到adminStore和localStorage
  adminStore.updateHeroTitle(heroConfig.value.mainTitle)
  adminStore.updateHeroSubtitle(heroConfig.value.subtitle)
  adminStore.updateHeroBackgroundImage(heroConfig.value.backgroundImage)
  adminStore.updateHeroFeatures(heroConfig.value.features)
  
  alert('Hero Section 配置已保存')
}

function saveRareDynastyConfig() {
  // 保存到adminStore和localStorage
  adminStore.updateRareDynastyTitle(rareDynastyConfig.value.title)
  adminStore.updateRareDynastyDescription(rareDynastyConfig.value.description)
  adminStore.updateRareDynastyButtonText(rareDynastyConfig.value.buttonText)
  adminStore.updateRareDynastyImage(rareDynastyConfig.value.image)
  
  alert('Rare Dynasty Collection 配置已保存')
}

function saveHeritageStoryConfig() {
  // 保存到adminStore和localStorage
  adminStore.updateHeritageStoryTitle(heritageStoryConfig.value.title)
  adminStore.updateHeritageStoryDescription1(heritageStoryConfig.value.description1)
  adminStore.updateHeritageStoryDescription2(heritageStoryConfig.value.description2)
  adminStore.updateHeritageStoryButtonText(heritageStoryConfig.value.buttonText)
  adminStore.updateHeritageStoryImage(heritageStoryConfig.value.image)
  
  alert('Heritage Story 配置已保存')
}

// 生命周期
onMounted(() => {
  // 从adminStore加载当前配置
  heroConfig.value.mainTitle = adminStore.heroConfig.title
  heroConfig.value.subtitle = adminStore.heroConfig.subtitle
  heroConfig.value.backgroundImage = adminStore.heroConfig.backgroundImage
  heroConfig.value.features = [...adminStore.heroConfig.features]
  
  rareDynastyConfig.value.title = adminStore.rareDynastyCollection.title
  rareDynastyConfig.value.description = adminStore.rareDynastyCollection.description
  rareDynastyConfig.value.buttonText = adminStore.rareDynastyCollection.buttonText
  rareDynastyConfig.value.image = adminStore.rareDynastyCollection.image
  
  heritageStoryConfig.value.title = adminStore.heritageStory.title
  heritageStoryConfig.value.description1 = adminStore.heritageStory.description1
  heritageStoryConfig.value.description2 = adminStore.heritageStory.description2
  heritageStoryConfig.value.buttonText = adminStore.heritageStory.buttonText
  heritageStoryConfig.value.image = adminStore.heritageStory.image
})
</script>

<style scoped>
.homepage-content-management {
  padding: 24px;
}
</style>


