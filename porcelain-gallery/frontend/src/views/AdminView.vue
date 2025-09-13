<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 px-4 bg-gray-900">
          <h1 class="text-xl font-bold text-white">Admin Panel</h1>
          </div>
        
        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <div
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                activeTab === tab.id
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
            <span class="text-lg">{{ tab.icon() }}</span>
            <span class="font-medium">{{ tab.name }}</span>
              </div>
          </nav>
        
        <!-- Footer -->
        <div class="p-4 border-t">
          <button 
            @click="logout"
            class="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
        </div>

        <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Header -->
      <div class="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
              <div>
          <h2 class="text-2xl font-semibold text-gray-900">{{ getCurrentTabName() }}</h2>
          <p class="text-sm text-gray-600">{{ getCurrentTabDescription() }}</p>
              </div>
                <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-500">
            Last updated: {{ new Date().toLocaleString() }}
          </div>
                </div>
              </div>

      <!-- Content Area -->
      <div class="p-6">
        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <!-- Storage Management -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Storage Management</h3>
            <div class="flex space-x-4">
              <button 
                @click="clearLocalStorage" 
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Clear LocalStorage
              </button>
              <button 
                @click="debugProducts" 
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Debug Products
              </button>
              <div class="text-sm text-gray-500 flex items-center">
                Use this to clear cached image data and fix storage issues
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <span class="text-2xl">📦</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Total Products</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ products.length }}</p>
                </div>
                </div>
              </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg">
                  <span class="text-2xl">🏛️</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Dynasties</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ dynasties.length }}</p>
                </div>
              </div>
              </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-2 bg-yellow-100 rounded-lg">
                  <span class="text-2xl">⭐</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Best Sellers</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ bestSellers.length }}</p>
                </div>
              </div>
              </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-2 bg-purple-100 rounded-lg">
                  <span class="text-2xl">🖼️</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Media Files</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ mediaLibrary.length }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
              <div class="space-y-3">
                <div v-for="product in products.slice(0, 5)" :key="product.id" class="flex items-center space-x-3">
                  <img :src="getImageSrc(product.primary_image)" :alt="product.name_en" class="w-12 h-12 rounded-lg object-cover">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ product.name_en }}</p>
                    <p class="text-sm text-gray-600">{{ product.dynasty_name }}</p>
                  </div>
                  <div class="text-sm text-gray-500">${{ product.price }}</div>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Database Connection</span>
                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Media Storage</span>
                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Healthy</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Cache Status</span>
                  <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Warming</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Site Settings Tab -->
        <div v-if="activeTab === 'site-settings'" class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Site Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                <input v-model="siteSettings.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <input v-model="siteSettings.description" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input v-model="siteSettings.phone" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input v-model="siteSettings.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea v-model="siteSettings.address" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button @click="saveSiteSettings" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>

        <!-- Product Management Tab -->
        <div v-if="activeTab === 'products'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Product Management</h3>
            <button @click="showAddProductModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Product
              </button>
            </div>

          <div class="bg-white rounded-lg shadow overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dynasty</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="product in products" :key="product.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                    <img :src="getImageSrc(product.primary_image)" :alt="product.name_en" class="w-12 h-12 rounded-lg object-cover">
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">{{ product.name_en }}</div>
                          <div class="text-sm text-gray-500">{{ product.name_cn }}</div>
                    </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.dynasty_name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ product.price }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="product.is_available ? 'px-2 py-1 bg-green-100 text-green-800' : 'px-2 py-1 bg-red-100 text-red-800'" class="text-xs rounded-full">
                      {{ product.is_available ? 'Available' : 'Unavailable' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="editProduct(product)" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        <!-- Dynasty Management Tab -->
        <div v-if="activeTab === 'dynasties'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Dynasty Management</h3>
            <button @click="showAddDynastyModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Dynasty
            </button>
              </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="dynasty in dynasties" :key="dynasty.id" class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center space-x-4 mb-4">
                <img :src="getImageSrc(dynasty.image)" :alt="dynasty.name" class="w-16 h-16 rounded-lg object-cover">
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ dynasty.name }}</h4>
                  <p class="text-sm text-gray-600">{{ dynasty.period }}</p>
              </div>
              </div>
              <p class="text-sm text-gray-700 mb-4">{{ dynasty.description }}</p>
              <div class="flex items-center justify-between">
                <span :class="dynasty.is_enabled ? 'px-2 py-1 bg-green-100 text-green-800' : 'px-2 py-1 bg-red-100 text-red-800'" class="text-xs rounded-full">
                  {{ dynasty.is_enabled ? 'Enabled' : 'Disabled' }}
                </span>
                <div class="flex space-x-2">
                  <button @click="editDynasty(dynasty)" class="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                  <button @click="deleteDynasty(dynasty.id)" class="text-red-600 hover:text-red-900 text-sm">Delete</button>
              </div>
              </div>
              </div>
            </div>
          </div>

        <!-- Shape Management Tab -->
        <div v-if="activeTab === 'shapes'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Shape Management</h3>
            <button @click="showAddShapeModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Shape
                      </button>
                    </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="shape in shapes" :key="shape.id" class="bg-white rounded-lg shadow p-6">
              <h4 class="font-semibold text-gray-900 mb-2">{{ shape.name }}</h4>
              <p class="text-sm text-gray-700 mb-4">{{ shape.description }}</p>
              <div class="flex items-center justify-between">
                <span :class="shape.is_enabled ? 'px-2 py-1 bg-green-100 text-green-800' : 'px-2 py-1 bg-red-100 text-red-800'" class="text-xs rounded-full">
                  {{ shape.is_enabled ? 'Enabled' : 'Disabled' }}
                </span>
                <div class="flex space-x-2">
                  <button @click="editShape(shape)" class="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                  <button @click="deleteShape(shape.id)" class="text-red-600 hover:text-red-900 text-sm">Delete</button>
                  </div>
                </div>
                  </div>
                </div>
              </div>

        <!-- Media Library Tab -->
        <div v-if="activeTab === 'media'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Media Library</h3>
            <button @click="openImageUpload" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Upload Media
                      </button>
                    </div>
          
          <!-- Search and Filter -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex flex-wrap gap-4">
              <div class="flex-1 min-w-64">
                <input v-model="mediaSearchQuery" type="text" placeholder="Search media files..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <select v-model="mediaFilterType" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                </select>
              </div>
              <div>
                <select v-model="mediaSortBy" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="name">Sort by Name</option>
                  <option value="date">Sort by Date</option>
                  <option value="size">Sort by Size</option>
                </select>
              </div>
                  </div>
                </div>

          <!-- Media Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="media in filteredMediaLibrary" :key="media.id" class="bg-white rounded-lg shadow overflow-hidden">
              <div class="aspect-w-16 aspect-h-9">
                <img v-if="media.type === 'image'" :src="getImageSrc(media.url)" :alt="media.name" class="w-full h-48 object-cover">
                <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span class="text-4xl">🎥</span>
                </div>
              </div>
              <div class="p-4">
                <h4 class="font-medium text-gray-900 truncate">{{ media.name }}</h4>
                <p class="text-sm text-gray-600">{{ (media.size / (1024 * 1024)).toFixed(1) }} MB</p>
                <p class="text-sm text-gray-500">{{ formatDate(media.uploadDate) }}</p>
                <div class="mt-3 flex justify-end">
                  <button @click="deleteMediaFile(media.id)" class="text-red-600 hover:text-red-900 text-sm">Delete</button>
                </div>
              </div>
                  </div>
                </div>
              </div>

        <!-- Best Sellers Tab -->
        <div v-if="activeTab === 'best-sellers'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900">Best Sellers Management</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="(product, index) in bestSellers" :key="index" class="bg-white rounded-lg shadow p-6">
              <!-- Main Image Section -->
              <div class="mb-4">
                <div class="aspect-w-16 aspect-h-9 mb-2">
                  <img :src="getImageSrc(product.mainImage)" :alt="product.name" class="w-full h-48 object-cover rounded-lg">
                </div>
                <button @click="openImageUploadForMainImage(index)" class="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                  Edit Main Image
                </button>
              </div>
              
              <!-- Thumbnails Section -->
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Thumbnails</h4>
                <div class="grid grid-cols-3 gap-2">
                  <div v-for="(thumbnail, thumbIndex) in product.thumbnails" :key="thumbIndex" class="relative">
                    <img :src="getImageSrc(thumbnail)" :alt="`Thumbnail ${thumbIndex + 1}`" class="w-full h-16 object-cover rounded">
                    <button @click="openImageUploadForThumbnail(index, thumbIndex)" class="absolute inset-0 bg-black bg-opacity-50 text-white text-xs flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

              <!-- Product Info Section -->
                <div class="space-y-3">
                <input v-model="product.name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <input v-model="product.price" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div class="flex space-x-2">
                  <button @click="saveBestSeller({...product, index})" class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Save
                  </button>
                  <button @click="removeBestSeller(index)" class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                    Remove
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <!-- Collections Tab -->
        <div v-if="activeTab === 'collections'" class="space-y-6">
          <!-- Rare Dynasty Collection -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Rare Dynasty Collection</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input v-model="rareDynastyCollection.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea v-model="rareDynastyCollection.description" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input v-model="rareDynastyCollection.buttonText" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div class="aspect-w-16 aspect-h-9 mb-4">
                  <img :src="getImageSrc(rareDynastyCollection.image)" :alt="rareDynastyCollection.title" class="w-full h-64 object-cover rounded-lg">
            </div>
                <button @click="openImageUpload" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Change Image
                </button>
                </div>
                    </div>
            <div class="mt-6 flex justify-end">
              <button @click="saveRareDynastyCollection" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Collection
              </button>
                  </div>
                </div>

          <!-- Heritage Story -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Heritage Story</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                  <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input v-model="heritageStory.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
                  <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description 1</label>
                  <textarea v-model="heritageStory.description1" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description 2</label>
                  <textarea v-model="heritageStory.description2" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div class="aspect-w-16 aspect-h-9 mb-4">
                  <img :src="getImageSrc(heritageStory.image)" :alt="heritageStory.title" class="w-full h-64 object-cover rounded-lg">
            </div>
                <button @click="openImageUpload" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Change Image
                </button>
          </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button @click="saveHeritageStory" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Story
                </button>
            </div>
              </div>
            </div>

        <!-- Content Management Tab -->
        <div v-if="activeTab === 'content'" class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Content Settings</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Best Sellers Title</label>
                <input v-model="contentSettings.bestSellersTitle" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rare Dynasty Title</label>
                <input v-model="contentSettings.rareDynastyTitle" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Rare Dynasty Description</label>
                <textarea v-model="contentSettings.rareDynastyDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Explore Dynasty Title</label>
                <input v-model="contentSettings.exploreDynastyTitle" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button @click="saveContentSettings" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Content Settings
                    </button>
            </div>
                  </div>
                </div>
              </div>
            </div>

    <!-- Image Upload Modal -->
    <div v-if="showImageUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Upload Image</h3>
        <input 
          ref="fileInputRef"
          type="file" 
          accept="image/*" 
          @change="handleFileSelect"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
        <div class="flex justify-end space-x-3">
          <button @click="closeImageUploadModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Best Seller Image Edit Modal -->
    <div v-if="showBestSellerImageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ currentEditingContext?.type === 'mainImage' ? 'Edit Main Image' : 'Edit Thumbnail' }}
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          Select a new image file from your computer
        </p>
        <input 
          ref="fileInputRef"
          type="file" 
          accept="image/*" 
          @change="handleBestSellerImageSelect"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
        <div class="flex justify-end space-x-3">
          <button @click="closeBestSellerImageModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div v-if="showAddProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Product</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">English Name</label>
            <input v-model="newProduct.name_en" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Chinese Name</label>
            <input v-model="newProduct.name_cn" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input v-model="newProduct.price" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Dynasty</label>
            <select v-model="newProduct.dynasty_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="dynasty in dynasties" :key="dynasty.id" :value="dynasty.id">{{ dynasty.name }}</option>
            </select>
              </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Shape</label>
            <select v-model="newProduct.shape_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="shape in shapes" :key="shape.id" :value="shape.id">{{ shape.name }}</option>
            </select>
            </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Primary Image</label>
            <div class="flex items-center space-x-4">
              <div v-if="newProduct.primary_image" class="w-20 h-20 border-2 border-gray-300 rounded-lg overflow-hidden">
                <img :src="getImageSrc(newProduct.primary_image)" alt="Primary image" class="w-full h-full object-cover">
              </div>
              <div class="flex-1">
                <input 
                  id="primaryImageInput"
                  ref="primaryImageInput"
                  type="file" 
                  accept="image/*" 
                  @change="handlePrimaryImageUpload"
                  class="hidden"
                >
                <button 
                  @click="openPrimaryImageUpload"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {{ newProduct.primary_image ? 'Change Primary Image' : 'Upload Primary Image' }}
                </button>
                <p class="text-xs text-gray-500 mt-1">Required: Main product image</p>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Additional Images (Optional)</label>
            <div class="space-y-2">
              <div v-for="(image, index) in newProduct.images" :key="index" class="flex items-center space-x-2">
                <div class="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden">
                  <img :src="getImageSrc(image.image_path)" alt="Additional image" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                  <input 
                    :id="`additionalImageInput${index}`"
                    :ref="`additionalImageInput${index}`"
                    type="file" 
                    accept="image/*" 
                    @change="(e) => handleAdditionalImageUpload(e, index)"
                    class="hidden"
                  >
                  <button 
                    @click="() => openAdditionalImageUpload(index)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left text-sm"
                  >
                    Change Image {{ index + 1 }}
                  </button>
                </div>
                <button 
                  @click="removeAdditionalImage(index)"
                  class="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
              <button 
                @click="addAdditionalImage"
                class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-gray-600"
              >
                + Add Another Image
              </button>
              <p class="text-xs text-gray-500">Optional: Additional product images</p>
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">English Description</label>
            <textarea v-model="newProduct.description_en" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Chinese Description</label>
            <textarea v-model="newProduct.description_cn" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="showAddProductModal = false" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
            Cancel
          </button>
          <button @click="addProduct" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Product
          </button>
        </div>
      </div>
    </div>

    <!-- Add Dynasty Modal -->
    <div v-if="showAddDynastyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Dynasty</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input v-model="newDynasty.name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Period</label>
            <input v-model="newDynasty.period" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea v-model="newDynasty.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <input v-model="newDynasty.image" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
            <input v-model="newDynasty.sort_order" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="showAddDynastyModal = false" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
            Cancel
          </button>
          <button @click="addDynasty" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Dynasty
          </button>
        </div>
          </div>
        </div>
        
    <!-- Add Shape Modal -->
    <div v-if="showAddShapeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Shape</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input v-model="newShape.name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea v-model="newShape.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
            <input v-model="newShape.sort_order" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="showAddShapeModal = false" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
            Cancel
          </button>
          <button @click="addShape" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Shape
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { useProductsStore } from '@/stores/products'
import type { Product, Dynasty, Shape } from '@/stores/admin'
import API_CONFIG from '@/config/api'

const router = useRouter()
const adminStore = useAdminStore()
const productsStore = useProductsStore()

// Active tab state
const activeTab = ref('dashboard')

// Modal states
const showImageUploadModal = ref(false)
const showAddProductModal = ref(false)
const showAddDynastyModal = ref(false)
const showAddShapeModal = ref(false)
const showBulkUploadModal = ref(false)
const showBestSellerImageModal = ref(false)

// File input ref
const fileInputRef = ref<HTMLInputElement | null>(null)

// Current editing context
const currentEditingContext = ref<{
  type: 'mainImage' | 'thumbnail'
  productIndex: number
  thumbnailIndex?: number
} | null>(null)

// Media library search and filter
const mediaSearchQuery = ref('')
const mediaFilterType = ref<'all' | 'image' | 'video'>('all')
const mediaSortBy = ref<'name' | 'date' | 'size'>('date')

// Form data for modals
const newProduct = ref<Partial<Product>>({
  name_en: '',
  name_cn: '',
  description_en: '',
  description_cn: '',
  craftsmanship_en: '',
  craftsmanship_cn: '',
  history_en: '',
  history_cn: '',
  price: 0,
  dimensions: '',
  weight: '',
  age: '',
  dynasty_id: 1,
  shape_id: 1,
  dynasty_name: '',
  shape_name: '',
  primary_image: '',
  images: [],
  videos: [],
  is_featured: false,
  is_available: true
})

const newDynasty = ref<Partial<Dynasty>>({
  name: '',
  period: '',
  description: '',
  image: '',
  sort_order: 1,
  is_enabled: true
})

const newShape = ref<Partial<Shape>>({
  name: '',
  description: '',
  sort_order: 1,
  is_enabled: true
})

// Navigation tabs
const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: () => '📊' },
  { id: 'site-settings', name: 'Site Settings', icon: () => '⚙️' },
  { id: 'products', name: 'Products', icon: () => '📦' },
  { id: 'dynasties', name: 'Dynasties', icon: () => '🏛️' },
  { id: 'shapes', name: 'Shapes', icon: () => '🔷' },
  { id: 'media', name: 'Media Library', icon: () => '🖼️' },
  { id: 'best-sellers', name: 'Best Sellers', icon: () => '⭐' },
  { id: 'collections', name: 'Collections', icon: () => '🎨' },
  { id: 'content', name: 'Content Management', icon: () => '📝' }
]

// Computed properties for admin store data
const siteSettings = computed(() => adminStore.siteSettings)
const contentSettings = computed(() => adminStore.contentSettings)
const rareDynastyCollection = computed(() => adminStore.rareDynastyCollection)
const heritageStory = computed(() => adminStore.heritageStory)
const bestSellers = computed(() => adminStore.bestSellersProducts)
const dynastyImages = computed(() => adminStore.dynastyImages)
const products = computed(() => adminStore.products)
const dynasties = computed(() => adminStore.dynasties)
const shapes = computed(() => adminStore.shapes)
const mediaLibrary = computed(() => adminStore.mediaLibrary)

// Computed property for filtered media library
const filteredMediaLibrary = computed(() => {
  let filtered = mediaLibrary.value

  // Filter by search query
  if (mediaSearchQuery.value) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(mediaSearchQuery.value.toLowerCase())
    )
  }

  // Filter by type
  if (mediaFilterType.value !== 'all') {
    filtered = filtered.filter(item => item.type === mediaFilterType.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (mediaSortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      case 'size':
        return b.size - a.size
      default:
        return 0
    }
  })

  return filtered
})

// Helper functions
function getCurrentTabName() {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab ? tab.name : 'Dashboard'
}

function getCurrentTabDescription() {
  const descriptions: Record<string, string> = {
    'dashboard': 'Overview of your porcelain gallery management system',
    'site-settings': 'Configure site information and contact details',
    'products': 'Manage your porcelain product catalog',
    'dynasties': 'Organize products by historical dynasties',
    'shapes': 'Categorize products by shape and form',
    'media': 'Upload and organize media files',
    'best-sellers': 'Manage featured best-selling products',
    'collections': 'Configure special collections and stories',
    'content': 'Manage page content and text'
  }
  return descriptions[activeTab.value] || ''
}

function logout() {
  localStorage.removeItem('isAdmin')
  router.push('/')
}

// Helper function to get image source
function getImageSrc(imagePath: string) {
  console.log('AdminView getImageSrc called with:', imagePath)
  
  // Use API config to handle all image URL logic
  const processedUrl = API_CONFIG.getImageUrl(imagePath)
  
  // If it's a local static asset path, convert to proper Vite asset import
  if (imagePath && (imagePath.startsWith('/src/assets/') || imagePath.includes('tea_image'))) {
    const fileName = imagePath.split('/').pop()
    return new URL(`../assets/tea_image/${fileName}`, import.meta.url).href
  }
  
  // If API config returned the original path (for local assets), convert it
  if (processedUrl === imagePath && imagePath.includes('tea_image')) {
    const fileName = imagePath.split('/').pop()
    return new URL(`../assets/tea_image/${fileName}`, import.meta.url).href
  }
  
  // For media path identifiers, use fallback image
  if (imagePath && imagePath.startsWith('/media/')) {
    console.warn('Unexpected media path in admin preview:', imagePath)
    return new URL(`../assets/tea_image/1.png`, import.meta.url).href
  }
  
  // Use the processed URL from API config
  console.log('Using processed URL:', processedUrl)
  return processedUrl
}

// Image upload handling
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    adminStore.addMediaFile(file).then(() => {
      alert('File uploaded successfully!')
      closeImageUploadModal()
    }).catch(error => {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    })
  }
}

function closeImageUploadModal() {
  showImageUploadModal.value = false
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function openImageUpload() {
  showImageUploadModal.value = true
}

// Best Sellers image upload functions
function openImageUploadForMainImage(productIndex: number) {
  currentEditingContext.value = {
    type: 'mainImage',
    productIndex: productIndex
  }
  showBestSellerImageModal.value = true
}

function openImageUploadForThumbnail(productIndex: number, thumbnailIndex: number) {
  currentEditingContext.value = {
    type: 'thumbnail',
    productIndex: productIndex,
    thumbnailIndex: thumbnailIndex
  }
  showBestSellerImageModal.value = true
}

function handleBestSellerImageSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && currentEditingContext.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const context = currentEditingContext.value!
      
      if (context.type === 'mainImage') {
        adminStore.updateBestSellerMainImage(context.productIndex, result)
        console.log('Updated main image for product', context.productIndex)
      } else if (context.type === 'thumbnail' && context.thumbnailIndex !== undefined) {
        adminStore.updateBestSellerThumbnail(context.productIndex, context.thumbnailIndex, result)
        console.log('Updated thumbnail', context.thumbnailIndex, 'for product', context.productIndex)
        console.log('Updated product thumbnails:', adminStore.bestSellersProducts[context.productIndex].thumbnails)
      }
      
      alert('Image updated successfully!')
      closeBestSellerImageModal()
    }
    reader.readAsDataURL(file)
  }
}

function closeBestSellerImageModal() {
  showBestSellerImageModal.value = false
  currentEditingContext.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// Site settings functions
function saveSiteSettings() {
  adminStore.saveSiteSettings(siteSettings.value)
  alert('Site settings saved successfully!')
}

// Image upload functions
function openPrimaryImageUpload() {
  console.log('openPrimaryImageUpload called')
  const input = document.getElementById('primaryImageInput') as HTMLInputElement
  console.log('Found input:', input)
  if (input) {
    console.log('Clicking input')
    input.click()
  } else {
    console.error('Primary image input not found')
  }
}

function openAdditionalImageUpload(index: number) {
  const input = document.getElementById(`additionalImageInput${index}`) as HTMLInputElement
  if (input) {
    input.click()
  } else {
    console.error(`Additional image input ${index} not found`)
  }
}

async function handlePrimaryImageUpload(event: Event) {
  console.log('handlePrimaryImageUpload called', event)
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  console.log('Selected file:', file)
  if (file) {
    try {
      // 使用File API直接处理图片
      const imageUrl = URL.createObjectURL(file)
      console.log('Created object URL for primary image:', imageUrl)
      
      // 存储文件对象和URL用于预览
      newProduct.value.primary_image = imageUrl
      ;(newProduct.value as any).primary_image_file = file // 存储文件对象
      
      console.log('Primary image set:', {
        url: imageUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })
      
    } catch (error: any) {
      console.error('Error processing primary image:', error)
      alert(`Error processing image: ${error.message}`)
    }
  } else {
    console.log('No file selected')
  }
}

async function handleAdditionalImageUpload(event: Event, index: number) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    try {
      // 使用File API直接处理图片
      const imageUrl = URL.createObjectURL(file)
      console.log(`Created object URL for additional image ${index}:`, imageUrl)
      
      // 存储文件对象和URL用于预览
      if (newProduct.value.images) {
        newProduct.value.images[index].image_path = imageUrl
        ;(newProduct.value.images[index] as any).image_file = file // 存储文件对象
      }
      
      console.log(`Additional image ${index} set:`, {
        url: imageUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })
      
    } catch (error: any) {
      console.error('Error processing additional image:', error)
      alert(`Error processing image: ${error.message}`)
    }
  }
}

function addAdditionalImage() {
  if (!newProduct.value.images) {
    newProduct.value.images = []
  }
  const newImageId = Math.max(...newProduct.value.images.map(img => img.id), 0) + 1
  newProduct.value.images.push({
    id: newImageId,
    image_path: '',
    is_primary: false,
    sort_order: newProduct.value.images.length + 1
  })
  
  // Automatically trigger file selection for the new image
  setTimeout(() => {
    const newIndex = newProduct.value.images!.length - 1
    openAdditionalImageUpload(newIndex)
  }, 100)
}

function removeAdditionalImage(index: number) {
  if (newProduct.value.images) {
    newProduct.value.images.splice(index, 1)
  }
}


// Product management functions
async function addProduct() {
  if (newProduct.value.name_en && newProduct.value.name_cn && newProduct.value.primary_image) {
    // Set dynasty and shape names
    const dynasty = dynasties.value.find(d => d.id === newProduct.value.dynasty_id)
    const shape = shapes.value.find(s => s.id === newProduct.value.shape_id)
    
    if (dynasty && shape) {
      newProduct.value.dynasty_name = dynasty.name
      newProduct.value.shape_name = shape.name
    }
    
    // Ensure images array exists and filter out empty images
    if (newProduct.value.images) {
      newProduct.value.images = newProduct.value.images.filter(img => img.image_path)
    }
    
    // 询问用户是否要保存图片到localStorage
    const saveImages = confirm(
      'Do you want to save images to localStorage?\n\n' +
      'Yes: Images will be compressed and saved (may consume storage space)\n' +
      'No: Only product info will be saved, images will use default placeholders'
    )
    
    if (saveImages) {
      // Show processing message
      const processingMessage = document.createElement('div')
      processingMessage.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #333; color: white; padding: 20px; border-radius: 8px;
        z-index: 10000; font-size: 16px; text-align: center;
      `
      processingMessage.textContent = 'Processing images and saving product...'
      document.body.appendChild(processingMessage)
      
      try {
        await adminStore.addProduct(newProduct.value as Omit<Product, 'id'>)
        document.body.removeChild(processingMessage)
        alert('Product added successfully with images!')
        showAddProductModal.value = false
        resetNewProduct()
      } catch (error: any) {
        document.body.removeChild(processingMessage)
        console.error('Error adding product:', error)
        alert(`Error adding product: ${error.message}`)
      }
    } else {
      // 只保存产品信息，不保存图片
      const productWithoutImages = { ...newProduct.value }
      productWithoutImages.primary_image = '/src/assets/tea_image/1.png' // 使用默认图片
      
      // 清空images数组，只使用primary_image
      productWithoutImages.images = []
      
      try {
        await adminStore.addProductWithoutImages(productWithoutImages as Omit<Product, 'id'>)
        alert('Product added successfully without images!')
        showAddProductModal.value = false
        resetNewProduct()
      } catch (error: any) {
        console.error('Error adding product:', error)
        alert(`Error adding product: ${error.message}`)
      }
    }
  } else {
    alert('Please fill in all required fields including primary image')
  }
}

function clearLocalStorage() {
  if (confirm('Are you sure you want to clear all localStorage data? This will remove all cached images and may require re-uploading.')) {
    adminStore.clearLocalStorage()
    alert('LocalStorage cleared successfully! Please refresh the page.')
    window.location.reload()
  }
}

function debugProducts() {
  console.log('=== DEBUG PRODUCTS ===')
  console.log('Admin Store Products:', adminStore.products)
  console.log('Admin Store Media Library:', adminStore.mediaLibrary)
  console.log('Products Store Products:', productsStore.products)
  
  // Check localStorage
  const savedProducts = localStorage.getItem('products')
  const savedMediaLibrary = localStorage.getItem('mediaLibrary')
  
  console.log('LocalStorage Products:', savedProducts ? JSON.parse(savedProducts) : null)
  console.log('LocalStorage Media Library:', savedMediaLibrary ? JSON.parse(savedMediaLibrary) : null)
  
  // Check each product's image paths
  adminStore.products.forEach((product, index) => {
    console.log(`Product ${index + 1} (ID: ${product.id}):`, {
      name: product.name_en,
      primary_image: product.primary_image,
      images: product.images?.map(img => img.image_path)
    })
  })
  
  alert('Debug information logged to console. Check the browser console for details.')
}

function editProduct(product: Product) {
  console.log('Edit product:', product)
  // Implement edit functionality
}

function deleteProduct(productId: number) {
  if (confirm('Are you sure you want to delete this product?')) {
    adminStore.deleteProduct(productId)
    alert('Product deleted successfully!')
  }
}

function resetNewProduct() {
  newProduct.value = {
    name_en: '',
    name_cn: '',
    description_en: '',
    description_cn: '',
    craftsmanship_en: '',
    craftsmanship_cn: '',
    history_en: '',
    history_cn: '',
    price: 0,
    dimensions: '',
    weight: '',
    age: '',
    dynasty_id: 1,
    shape_id: 1,
    dynasty_name: '',
    shape_name: '',
    primary_image: '',
    images: [],
    videos: [],
    is_featured: false,
    is_available: true
  }
}

// Dynasty management functions
function addDynasty() {
  if (newDynasty.value.name) {
    adminStore.addDynasty(newDynasty.value as Omit<Dynasty, 'id'>)
    alert('Dynasty added successfully!')
    showAddDynastyModal.value = false
    resetNewDynasty()
  } else {
    alert('Please fill in the dynasty name')
  }
}

function editDynasty(dynasty: Dynasty) {
  console.log('Edit dynasty:', dynasty)
  // Implement edit functionality
}

function deleteDynasty(dynastyId: number) {
  if (confirm('Are you sure you want to delete this dynasty?')) {
    adminStore.deleteDynasty(dynastyId)
    alert('Dynasty deleted successfully!')
  }
}

function resetNewDynasty() {
  newDynasty.value = {
    name: '',
    period: '',
    description: '',
    image: '',
    sort_order: 1,
    is_enabled: true
  }
}

// Shape management functions
function addShape() {
  if (newShape.value.name) {
    adminStore.addShape(newShape.value as Omit<Shape, 'id'>)
    alert('Shape added successfully!')
    showAddShapeModal.value = false
    resetNewShape()
  } else {
    alert('Please fill in the shape name')
  }
}

function editShape(shape: Shape) {
  console.log('Edit shape:', shape)
  // Implement edit functionality
}

function deleteShape(shapeId: number) {
  if (confirm('Are you sure you want to delete this shape?')) {
    adminStore.deleteShape(shapeId)
    alert('Shape deleted successfully!')
  }
}

function resetNewShape() {
  newShape.value = {
    name: '',
    description: '',
    sort_order: 1,
    is_enabled: true
  }
}

// Media library functions
function deleteMediaFile(mediaId: number) {
  if (confirm('Are you sure you want to delete this media file?')) {
    adminStore.deleteMediaFile(mediaId)
    alert('Media file deleted successfully!')
  }
}

function getTotalMediaSize() {
  return (mediaLibrary.value.reduce((total, item) => total + item.size, 0) / (1024 * 1024)).toFixed(1) + ' MB'
}

function getMediaTypeCount(type: 'image' | 'video') {
  return mediaLibrary.value.filter(item => item.type === type).length
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

// Best sellers functions
function saveBestSeller(product: any) {
  adminStore.updateBestSellerName(product.index, product.name)
  adminStore.updateBestSellerPrice(product.index, product.price)
  alert('Best seller updated successfully!')
}

function removeBestSeller(index: number) {
  if (confirm('Are you sure you want to remove this best seller?')) {
    // Implement remove functionality
    console.log('Remove best seller at index:', index)
  }
}

// Collections functions
function saveRareDynastyCollection() {
  adminStore.updateRareDynastyTitle(rareDynastyCollection.value.title)
  adminStore.updateRareDynastyDescription(rareDynastyCollection.value.description)
  adminStore.updateRareDynastyButtonText(rareDynastyCollection.value.buttonText)
  adminStore.updateRareDynastyImage(rareDynastyCollection.value.image)
  alert('Rare Dynasty Collection saved successfully!')
}

function saveHeritageStory() {
  adminStore.updateHeritageStoryTitle(heritageStory.value.title)
  adminStore.updateHeritageStoryDescription1(heritageStory.value.description1)
  adminStore.updateHeritageStoryDescription2(heritageStory.value.description2)
  adminStore.updateHeritageStoryImage(heritageStory.value.image)
  alert('Heritage Story saved successfully!')
}

function saveContentSettings() {
  adminStore.saveContentSettings(contentSettings.value)
  alert('Content settings saved successfully!')
}

onMounted(() => {
  adminStore.loadAllData()
  
  // Debug: Check best sellers data
  console.log('AdminView - Best Sellers Products:', adminStore.bestSellersProducts)
  console.log('AdminView - Best Sellers computed:', bestSellers.value)
})
</script>
