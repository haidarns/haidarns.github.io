<script setup>
import { ref, onMounted, computed } from 'vue'
import { Tag, ArrowRight, Search, Layers, Globe, Github } from 'lucide-vue-next'

const apps = ref([])
const tags = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const matchApp = (app, query) => {
  return (
    app.name.toLowerCase().includes(query) ||
    app.category.toLowerCase().includes(query) ||
    app.tags.some(t => t.toLowerCase().includes(query)) ||
    app.url.toLowerCase().includes(query) ||
    app.github.toLowerCase().includes(query) ||
    app.description.toLowerCase().includes(query)
  )
}

const filteredTags = computed(() => {
  const allList = tags.value.length ? ['all', ...tags.value] : []
  if (!searchQuery.value.trim()) return allList
  const query = searchQuery.value.trim().toLowerCase()
  
  return allList.filter(tag => {
    if (tag === 'all') {
      return 'show all'.includes(query) || 'all'.includes(query) || 'semua'.includes(query) || apps.value.some(app => matchApp(app, query))
    }
    if (tag.toLowerCase().includes(query) || tag.replace(/-/g, ' ').toLowerCase().includes(query)) {
      return true
    }
    return apps.value.some(app => app.tags.includes(tag) && matchApp(app, query))
  })
})

const matchingApps = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.trim().toLowerCase()
  return apps.value.filter(app => matchApp(app, query))
})

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
    const tagSet = new Set()
    
    apps.value = rows.map(r => ({
      name: r[0] || '',
      category: r[1] || '',
      tags: r[2] ? r[2].split(',').map(t => t.trim()).filter(t => t) : [],
      url: r[3] || '',
      github: r[4] || '',
      description: r[5] || ''
    }))

    apps.value.forEach(app => {
      app.tags.forEach(t => tagSet.add(t))
    })
    
    tags.value = Array.from(tagSet).sort()
  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data solusi IT.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
    <div class="mb-12 text-center">
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans text-slate-800 dark:text-white">Solusi IT</h1>
      <p class="mt-4 mb-8 text-slate-500 dark:text-slate-400 font-light max-w-2xl mx-auto">
        Jelajahi berbagai solusi IT berdasarkan kategori teknologi.
      </p>
      
      <!-- Search Input -->
      <div class="max-w-md mx-auto relative group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
          <Search class="w-5 h-5" />
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="w-full glass-input pl-12 pr-4 py-3.5 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
          placeholder="Cari solusi, kategori, repo, atau metadata..."
        />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="error" class="text-center text-red-500 font-medium py-10 glass-panel rounded-2xl">
      {{ error }}
    </div>

    <div v-else class="space-y-10 animate-fade-in">
      <div v-if="filteredTags.length === 0 && matchingApps.length === 0" class="text-center text-slate-500 py-10 glass-panel rounded-2xl font-medium">
        Tidak ada kategori atau solusi yang sesuai dengan "{{ searchQuery }}".
      </div>

      <div v-else class="space-y-12">
        <!-- Categories Section -->
        <div v-if="filteredTags.length > 0">
          <h2 v-if="searchQuery" class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
            Kategori Terkait ({{ filteredTags.length }})
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <router-link 
              v-for="tag in filteredTags" 
              :key="tag" 
              :to="`/tech/${tag}`"
              class="glass-card p-6 rounded-2xl flex items-center justify-between group hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2.5 rounded-xl bg-sky-500/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Layers v-if="tag === 'all'" class="w-5 h-5" />
                  <Tag v-else class="w-5 h-5" />
                </div>
                <span class="font-semibold text-slate-700 dark:text-slate-200 capitalize">
                  {{ tag === 'all' ? 'Show All' : tag.replace(/-/g, ' ') }}
                </span>
              </div>
              <ArrowRight class="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </router-link>
          </div>
        </div>

        <!-- Direct Matching Apps Section when Searching -->
        <div v-if="searchQuery && matchingApps.length > 0" class="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Aplikasi & Solusi Cocok ({{ matchingApps.length }})
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div 
              v-for="app in matchingApps" 
              :key="app.name"
              class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-700/40 hover:shadow-lg hover:border-sky-500/20 transition-all duration-300"
            >
              <div class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="flex items-center space-x-2">
                    <h3 class="text-lg font-bold text-slate-800 dark:text-white">
                      {{ app.name }}
                    </h3>
                    <span class="text-xs px-2 py-0.5 rounded-md bg-sky-500/10 text-primary font-medium capitalize">
                      {{ app.category }}
                    </span>
                  </div>
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
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                  {{ app.description }}
                </p>
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
    </div>
  </div>
</template>

