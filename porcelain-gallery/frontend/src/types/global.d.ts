// Global type declarations for auth modal
declare global {
  interface Window {
    showAuthModal: (mode: 'login' | 'register', redirectPath?: string) => void
    hideAuthModal: () => void
  }
}

export {}
