<script setup>
import { ref, onMounted } from 'vue'
import { Sun, Moon, Menu, X, Zap, Check, ExternalLink } from 'lucide-vue-next'

const baseUrl = import.meta.env.BASE_URL

// Theme Management
const isDark = ref(false)
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Mobile Menu State
const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

onMounted(() => {
  // Initialize dark mode
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <div class="relative min-h-screen transition-colors duration-300">
    
    <!-- BACKGROUND BLOB GRADIENTS (Glassmorphism Behind-the-Scenes Glow) -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <!-- Sky Blue Blob -->
      <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 dark:bg-primary-dark/15 filter blur-[120px] animate-float-slow"></div>
      <!-- Tosca / Teal Blob -->
      <div class="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-secondary/20 dark:bg-secondary-dark/15 filter blur-[150px] animate-float-reverse"></div>
      <!-- Extra Soft Blob -->
      <div class="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full bg-sky-200/20 dark:bg-teal-900/10 filter blur-[100px] animate-float-slow"></div>
    </div>

    <!-- MAIN GRID CONTAINER -->
    <div class="relative z-10 flex flex-col min-h-screen">
      
      <!-- STICKY GLASS NAVIGATION BAR -->
      <header class="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/10 dark:border-slate-800/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 sm:h-20">
            <!-- Logo -->
            <router-link to="/" class="flex items-center space-x-2 group">
              <span class="p-2 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-lg shadow-sky-500/20">
                <Zap class="w-5 h-5" />
              </span>
              <span class="text-xl font-bold font-sans tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                Awanusa <span class="text-primary-hover dark:text-primary">Solutions</span>
              </span>
            </router-link>

            <!-- Desktop Menu -->
            <nav class="hidden md:flex items-center space-x-8">
              <router-link to="/" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Home</router-link>
              <a :href="baseUrl + '#services'" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Services</a>
              <a :href="baseUrl + '#solutions'" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Portfolio</a>
              <router-link to="/tech" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Technologies</router-link>
            </nav>

            <!-- Actions (Theme Toggle & CTA) -->
            <div class="hidden md:flex items-center space-x-4">
              <!-- Glass Theme Switcher -->
              <button 
                @click="toggleDarkMode" 
                class="p-2 rounded-xl glass-card text-slate-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer"
                aria-label="Toggle Theme"
              >
                <Sun v-if="isDark" class="w-5 h-5 text-amber-400" />
                <Moon v-else class="w-5 h-5" />
              </button>

              <a 
                :href="baseUrl + '#contact'" 
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-slate-900 dark:text-slate-900 font-semibold text-sm hover:shadow-lg hover:shadow-sky-500/20 active:scale-98 transition-all duration-300 hover:opacity-90"
              >
                Contact Us
              </a>
            </div>

            <!-- Mobile Menu Toggle Button -->
            <div class="flex items-center space-x-3 md:hidden">
              <button 
                @click="toggleDarkMode" 
                class="p-2 rounded-lg glass-card text-slate-600 dark:text-slate-300"
              >
                <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
                <Moon v-else class="w-4 h-4" />
              </button>
              <button 
                @click="toggleMobileMenu" 
                class="p-2 rounded-lg glass-card text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <X v-if="isMobileMenuOpen" class="w-5 h-5" />
                <Menu v-else class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Slider -->
        <div 
          v-if="isMobileMenuOpen" 
          class="md:hidden border-t border-slate-200/10 dark:border-slate-800/10 px-4 py-4 space-y-3 glass-panel animate-fade-in"
        >
          <router-link @click="isMobileMenuOpen = false" to="/" class="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">Home</router-link>
          <a @click="isMobileMenuOpen = false" :href="baseUrl + '#services'" class="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">Services</a>
          <a @click="isMobileMenuOpen = false" :href="baseUrl + '#solutions'" class="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">Portfolio</a>
          <router-link @click="isMobileMenuOpen = false" to="/tech" class="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">Technologies</router-link>
          <a 
            @click="isMobileMenuOpen = false"
            :href="baseUrl + '#contact'" 
            class="block text-center w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-slate-900 font-semibold text-sm"
          >
            Contact Us
          </a>
        </div>
      </header>

      <!-- ROUTER VIEW (Dynamic Content) -->
      <main class="flex-grow flex flex-col">
        <router-view />
      </main>

      <!-- FOOTER -->
      <footer class="mt-auto border-t border-slate-200/10 dark:border-slate-800/10 glass-panel">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
            
            <div class="space-y-4">
              <span class="text-lg font-bold font-sans tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Awanusa <span class="text-primary-hover">Solutions</span>
              </span>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                Premium systems engineering, cloud configuration architectures, and zero-trust deployments.
              </p>
            </div>

            <div>
              <h4 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Layanan</h4>
              <ul class="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li><a :href="baseUrl + '#services'" class="hover:text-primary transition-colors">Arsitektur Cloud</a></li>
                <li><a :href="baseUrl + '#services'" class="hover:text-primary transition-colors">Keamanan Siber</a></li>
                <li><a :href="baseUrl + '#services'" class="hover:text-primary transition-colors">Rekayasa Perangkat Lunak</a></li>
                <li><a :href="baseUrl + '#services'" class="hover:text-primary transition-colors">IT Consulting</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Perusahaan</h4>
              <ul class="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li><a href="#" class="hover:text-primary transition-colors">About Us</a></li>
                <li><a :href="baseUrl + '#solutions'" class="hover:text-primary transition-colors">Case Studies</a></li>
                <li><a href="#" class="hover:text-primary transition-colors">Partnership</a></li>
                <li><a :href="baseUrl + '#contact'" class="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 font-mono">Newsletter</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 font-light">
                Get weekly update about DevSecOps, Cloud Optimization, Security Trends, and many more.
              </p>
              <div class="flex gap-2">
                <input 
                  type="email" 
                  class="glass-input px-3.5 py-2 rounded-xl text-xs flex-grow focus:outline-none text-slate-800 dark:text-white"
                  placeholder="name@email.com"
                />
                <button class="p-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-slate-900 font-bold hover:shadow-md transition-all cursor-pointer">
                  <Check class="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          <div class="pt-6 border-t border-slate-200/10 dark:border-slate-800/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>&copy; 2026 Awanusa Solutions. All rights reserved.</p>
            <div class="flex space-x-6">
              <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" class="hover:text-primary transition-colors">Terms of Service</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors flex items-center">
                <span>GitHub</span>
                <ExternalLink class="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  </div>
</template>

<style>
/* Local CSS Animations */
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
