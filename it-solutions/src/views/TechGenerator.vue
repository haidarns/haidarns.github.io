<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Globe, Github, ArrowLeft, Layers, Tag, Search } from 'lucide-vue-next'

const route = useRoute()
const currentTag = computed(() => route.params.tag)

const apps = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}solution-generator-master.csv`)
    if (!response.ok) throw new Error('Failed to fetch dataset')
    
    const text = await response.text()
    
    const rows = []
    let row = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        row.push(current)
        current = ''
      } else if (char === '\n' && !inQuotes) {
        row.push(current)
        if (row.length > 1) rows.push(row)
        row = []
        current = ''
      } else if (char !== '\r') {
        current += char
      }
    }
    if (current || row.length > 0) {
      row.push(current)
      if (row.length > 1) rows.push(row)
    }

    const headers = rows.shift()
    apps.value = rows.map(r => ({
      name: r[0] || '',
      category: r[1] || '',
      tags: r[2] ? r[2].split(',').map(t => t.trim()).filter(t => t) : [],
      url: r[3] || '',
      github: r[4] || '',
      description: r[5] || ''
    }))
  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data solusi IT.'
  } finally {
    loading.value = false
  }
})

// Compute all tags for the sidebar
const allTags = computed(() => {
  if (!apps.value.length) return []
  const tagSet = new Set()
  apps.value.forEach(app => {
    if (app.tags) app.tags.forEach(t => tagSet.add(t))
  })
  return ['all', ...Array.from(tagSet).sort()]
})

const matchApp = (app, query) => {
  if (!query) return true
  return (
    (app.name && app.name.toLowerCase().includes(query)) ||
    (app.category && app.category.toLowerCase().includes(query)) ||
    (app.tags && app.tags.some(t => t.toLowerCase().includes(query))) ||
    (app.url && app.url.toLowerCase().includes(query)) ||
    (app.github && app.github.toLowerCase().includes(query)) ||
    (app.description && app.description.toLowerCase().includes(query))
  )
}

// Filter and group apps
const groupedApps = computed(() => {
  if (!apps.value.length) return {}
  
  const query = searchQuery.value.trim().toLowerCase()
  
  const filtered = apps.value.filter(app => {
    const matchesTag = currentTag.value === 'all' || (app.tags && app.tags.includes(currentTag.value))
    if (!matchesTag) return false
    return matchApp(app, query)
  })
  
  const grouped = {}
  filtered.forEach(app => {
    const cat = app.category || 'Uncategorized'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(app)
  })
  
  return grouped
})

const formatName = (str) => {
  if (!str) return ''
  if (str === 'all') return 'Show All'
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow flex flex-col md:flex-row gap-8 items-start">
    
    <!-- LEFT SIDEBAR -->
    <aside class="w-full md:w-64 lg:w-72 shrink-0 glass-panel p-6 rounded-3xl sticky top-24 z-10 hidden md:block">
      <div class="mb-6 pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <router-link to="/tech" class="inline-flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors group">
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Index</span>
        </router-link>
      </div>
      
      <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Semua Kategori</h3>
      
      <nav class="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <template v-for="tag in allTags" :key="tag">
          <router-link 
            :to="`/tech/${tag}`"
            class="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            :class="tag === currentTag ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'"
          >
            <span class="capitalize flex-grow">{{ formatName(tag) }}</span>
            <div v-if="tag === currentTag" class="w-1.5 h-1.5 rounded-full bg-primary"></div>
          </router-link>
          
          <!-- Child Tree for Active Tag -->
          <div v-if="tag === currentTag && Object.keys(groupedApps).length > 0" class="pl-4 py-1 mb-1 mt-1 space-y-1 border-l-2 border-primary/20 dark:border-primary/30 ml-4 animate-fade-in">
            <a 
              v-for="(apps, category) in groupedApps" 
              :key="category"
              :href="`#cat-${category}`"
              class="block px-3 py-1.5 text-[11px] font-bold tracking-wide text-slate-500 hover:text-primary transition-colors capitalize rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              {{ formatName(category) }}
            </a>
          </div>
        </template>
      </nav>
    </aside>

    <!-- Mobile Back Button (Visible only on small screens) -->
    <div class="md:hidden w-full mb-4">
      <router-link to="/tech" class="inline-flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors group glass-panel px-4 py-2 rounded-xl">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Kembali ke Index Kategori</span>
      </router-link>
    </div>

    <!-- RIGHT PANEL (CONTENT) -->
    <main class="flex-grow min-w-0 w-full relative px-2 sm:px-4 lg:px-8 flex flex-col h-[75vh]">
      <!-- Static Header -->
      <div class="shrink-0 pb-6 mb-8 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans text-slate-800 dark:text-white capitalize">
          {{ formatName(currentTag) }}
        </h1>

        <!-- Search Input -->
        <div class="w-full sm:w-80 relative group">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <Search class="w-4 h-4" />
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
            placeholder="Cari solusi, repo, metadata..."
          />
        </div>
      </div>

      <!-- Scrollable Apps List -->
      <div class="flex-grow overflow-y-auto pr-4 custom-scrollbar scroll-smooth">
        <!-- Loading / Error States -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        </div>
        <div v-else-if="error" class="text-center text-red-500 font-medium py-10 glass-panel rounded-2xl">
          {{ error }}
        </div>
        <div v-else-if="Object.keys(groupedApps).length === 0" class="text-center text-slate-500 py-10 glass-panel rounded-2xl font-medium">
          Tidak ada aplikasi yang ditemukan {{ searchQuery ? `untuk pencarian "${searchQuery}"` : 'untuk kategori ini' }}.
        </div>

        <!-- Grouped Apps List -->
        <div v-else class="space-y-12 pb-10">
          <div v-for="(categoryApps, category) in groupedApps" :key="category" :id="`cat-${category}`" class="animate-fade-in relative scroll-mt-6">
          
          <!-- Category Header -->
          <div class="mb-6 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 capitalize">
              {{ formatName(category) }}
            </h2>
          </div>

          <!-- Apps Grid -->
          <div class="grid grid-cols-1 gap-5">
            <div 
              v-for="app in categoryApps" 
              :key="app.name"
              class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-700/40 hover:shadow-lg hover:border-sky-500/20 transition-all duration-300"
            >
              <div class="space-y-4">
                <!-- Header: Name & Links -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 class="text-lg font-bold text-slate-800 dark:text-white">
                    {{ app.name }}
                  </h3>
                  <div class="flex items-center space-x-2">
                    <a v-if="app.url" :href="app.url.startsWith('http') ? app.url : `https://${app.url}`" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:text-primary hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all text-xs font-semibold" title="Website">
                      <Globe class="w-3.5 h-3.5" />
                      <span>Website</span>
                    </a>
                    <a v-if="app.github" :href="`https://github.com/${app.github}`" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-semibold" title="GitHub">
                      <Github class="w-3.5 h-3.5" />
                      <span>Repo</span>
                    </a>
                  </div>
                </div>
                <!-- Description -->
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                  {{ app.description }}
                </p>
                <!-- Tags -->
                <div v-if="app.tags && app.tags.length" class="flex flex-wrap gap-1.5 pt-1">
                  <span v-for="t in app.tags" :key="t" class="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    #{{ t }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      </div> <!-- End Scrollable Apps List -->
    </main>
  </div>
</template>

<style scoped>
/* Custom Scrollbar for Sidebar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.2);
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(71, 85, 105, 0.4);
}
</style>
