<script setup>
import { ref, onMounted, computed } from 'vue'
import { Tag, ArrowRight, Search, Layers } from 'lucide-vue-next'

const tags = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const filteredTags = computed(() => {
  const allList = tags.value.length ? ['all', ...tags.value] : []
  if (!searchQuery.value) return allList
  const query = searchQuery.value.toLowerCase()
  return allList.filter(tag => {
    if (tag === 'all') {
      return 'show all'.includes(query) || 'all'.includes(query) || 'semua'.includes(query)
    }
    return tag.toLowerCase().includes(query)
  })
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
    
    rows.forEach(r => {
      if (r[2]) {
        const appTags = r[2].split(',').map(t => t.trim()).filter(t => t)
        appTags.forEach(tag => tagSet.add(tag))
      }
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
          placeholder="Cari kategori solusi IT..."
        />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="error" class="text-center text-red-500 font-medium py-10 glass-panel rounded-2xl">
      {{ error }}
    </div>

    <div v-else class="space-y-6 animate-fade-in">
      <div v-if="filteredTags.length === 0" class="text-center text-slate-500 py-10 glass-panel rounded-2xl font-medium">
        Tidak ada kategori yang sesuai dengan "{{ searchQuery }}".
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
  </div>
</template>
