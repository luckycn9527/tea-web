<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Frontend Test Page</h1>
      
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">API Connection Test</h2>
        <button @click="testAPI" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Test Backend API
        </button>
        <div v-if="apiResult" class="mt-4 p-4 bg-gray-100 rounded">
          <pre>{{ JSON.stringify(apiResult, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Store Test</h2>
        <button @click="testStore" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Test Admin Store
        </button>
        <div v-if="storeResult" class="mt-4 p-4 bg-gray-100 rounded">
          <pre>{{ JSON.stringify(storeResult, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '@/stores/admin-new'
import apiService from '@/services/api'

const adminStore = useAdminStore()
const apiResult = ref<any>(null)
const storeResult = ref<any>(null)

async function testAPI() {
  try {
    const result = await apiService.getDynasties()
    apiResult.value = result
  } catch (error: any) {
    apiResult.value = { error: error.message }
  }
}

async function testStore() {
  try {
    await adminStore.loadAllData()
    storeResult.value = {
      products: adminStore.products.length,
      dynasties: adminStore.dynasties?.length || 0,
      shapes: adminStore.shapes?.length || 0
    }
  } catch (error: any) {
    storeResult.value = { error: error.message }
  }
}
</script>

