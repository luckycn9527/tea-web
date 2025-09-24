<template>
  <Transition name="dialog">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <!-- Background overlay with blur -->
      <div class="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
      
      <!-- Dialog content -->
      <div class="relative bg-gray-900 border border-gray-600 rounded-xl shadow-2xl px-8 py-6 max-w-md mx-4 pointer-events-auto transform">
        <!-- Icon -->
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <!-- Title -->
        <h3 class="text-lg font-semibold text-white text-center mb-2">
          {{ title }}
        </h3>
        
        <!-- Message -->
        <p class="text-gray-300 text-center mb-6">
          {{ message }}
        </p>
        
        <!-- Buttons -->
        <div class="flex space-x-3">
          <button 
            @click="handleCancel"
            class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {{ cancelText }}
          </button>
          <button 
            @click="handleConfirm"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.dialog-enter-active {
  transition: all 0.3s ease-out;
}

.dialog-leave-active {
  transition: all 0.2s ease-in;
}

.dialog-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.dialog-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Background overlay animation */
.dialog-enter-active .absolute {
  transition: opacity 0.3s ease-out;
}

.dialog-leave-active .absolute {
  transition: opacity 0.2s ease-in;
}

.dialog-enter-from .absolute {
  opacity: 0;
}

.dialog-leave-to .absolute {
  opacity: 0;
}

/* Icon animation */
@keyframes warning-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.dialog-enter-active .w-12 {
  animation: warning-pulse 0.6s ease-out;
}
</style>

