<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { 
  Cloud, Shield, Code2, Cpu, 
  ArrowRight, Check, Send, CheckCircle2, ChevronRight,
  TrendingUp, Activity, Terminal, Mail, Phone, MapPin,
  Lock
} from 'lucide-vue-next'

// Live Simulated Dashboard Data
const cpuLoad = ref(42)
const memoryUsage = ref(68)
const cloudNodes = ref(12)
const securityStatus = ref('Normal')
const currentLogs = ref([
  { id: 1, text: 'System initialized on host-node-8', type: 'info' },
  { id: 2, text: 'Establishing secure mesh gateway...', type: 'info' },
  { id: 3, text: 'Zero-trust auth verified [SHA-256]', type: 'success' },
])

// Timer for simulated live updates
let updateInterval = null
const logMessages = [
  'Checking integrity of cloud assets...',
  'Syncing global load balancer...',
  'Optimized container cache (12.4ms)',
  'DDoS monitoring: 0 threats detected',
  'Scaling node cluster auto-group-3',
  'Automated backup cycle completed',
  'TLS handshake verification success'
]

const updateDashboard = () => {
  // Fluctuate CPU
  cpuLoad.value = Math.max(15, Math.min(95, cpuLoad.value + Math.floor(Math.random() * 11) - 5))
  // Fluctuate Memory
  memoryUsage.value = Math.max(40, Math.min(90, memoryUsage.value + Math.floor(Math.random() * 7) - 3))
  // Sometimes toggle node count
  if (Math.random() > 0.7) {
    cloudNodes.value = Math.max(8, Math.min(20, cloudNodes.value + (Math.random() > 0.5 ? 1 : -1)))
  }
  // Add new logs
  if (Math.random() > 0.6) {
    const randomMsg = logMessages[Math.floor(Math.random() * logMessages.length)]
    const now = new Date()
    const timeStr = now.toTimeString().split(' ')[0]
    currentLogs.value.unshift({
      id: Date.now(),
      text: `[${timeStr}] ${randomMsg}`,
      type: randomMsg.includes('threat') || randomMsg.includes('backup') ? 'success' : 'info'
    })
    // Limit to 5 logs
    if (currentLogs.value.length > 5) {
      currentLogs.value.pop()
    }
  }
}

// Services List
const services = [
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    desc: 'Architecting highly scalable, multi-cloud platforms using Terraform, Kubernetes, and automated CI/CD pipelines.',
    colorClass: 'text-sky-500 bg-sky-500/10'
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    desc: 'Zero-trust architectures, end-to-end pen testing, automated threat detection, and localized data encryption.',
    colorClass: 'text-teal-500 bg-teal-500/10'
  },
  {
    icon: Code2,
    title: 'Custom Software',
    desc: 'Bespoke high-performance web systems and robust microservices written in modern backend ecosystems.',
    colorClass: 'text-sky-500 bg-sky-500/10'
  },
  {
    icon: Cpu,
    title: 'IT Consulting',
    desc: 'Strategic systems audit, legacy modernization strategies, and seamless integration plans tailored for scale.',
    colorClass: 'text-teal-500 bg-teal-500/10'
  }
]

// Solutions (Filterable Portfolio)
const activeFilter = ref('All')
const filters = ['All', 'Cloud', 'Cybersecurity', 'Software']

const solutions = [
  {
    title: 'CloudScale Infrastructure Migration',
    category: 'Cloud',
    description: 'Transitioned a high-traffic e-commerce portal to AWS multi-region auto-scaling, reducing infrastructure costs by 34% and database latency by 45%.',
    tech: ['AWS', 'Kubernetes', 'Terraform'],
    stats: '99.99% Uptime'
  },
  {
    title: 'ShieldGuard Zero-Trust Gateway',
    category: 'Cybersecurity',
    description: 'Implemented a localized perimeter-less API authentication layer serving over 50M requests daily, blocking 99.8% of malicious bot traffic.',
    tech: ['Rust', 'eBPF', 'WireGuard'],
    stats: 'Zero Breaches'
  },
  {
    title: 'ApexCore Enterprise ERP Platform',
    category: 'Software',
    description: 'Built a customized dashboard suite coordinating supply chain metrics, integrating directly with existing legacy inventory software.',
    tech: ['Vue 3', 'Node.js', 'PostgreSQL'],
    stats: '+150% Velocity'
  },
  {
    title: 'SyncFlow Real-time API Hub',
    category: 'Software',
    description: 'Designed a high-throughput events-driven messaging architecture handling multi-client transactions with sub-millisecond responses.',
    tech: ['Go', 'gRPC', 'Redis'],
    stats: '0.8ms Latency'
  },
  {
    title: 'Sentinel Threat Intelligence',
    category: 'Cybersecurity',
    description: 'Decomposed monolithic detection logic into distributed micro-audits to dynamically flag anomalous activities in enterprise servers.',
    tech: ['Python', 'Docker', 'Elastic'],
    stats: 'Instant Alerting'
  }
]

const filteredSolutions = computed(() => {
  if (activeFilter.value === 'All') return solutions
  return solutions.filter(s => s.category === activeFilter.value)
})

// Contact Form State & Validation
const form = ref({
  name: '',
  email: '',
  service: '',
  message: ''
})
const errors = ref({
  name: '',
  email: '',
  service: ''
})
const isSubmitting = ref(false)
const submitStep = ref('idle') // idle, loading, success
const ticketId = ref('')

const validateForm = () => {
  let isValid = true
  errors.value = { name: '', email: '', service: '' }

  if (!form.value.name.trim()) {
    errors.value.name = 'Nama lengkap wajib diisi'
    isValid = false
  }
  if (!form.value.email.trim()) {
    errors.value.email = 'Email wajib diisi'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Format email tidak valid'
    isValid = false
  }
  if (!form.value.service) {
    errors.value.service = 'Silakan pilih layanan IT'
    isValid = false
  }

  return isValid
}

const handleContactSubmit = () => {
  if (!validateForm()) return

  isSubmitting.value = true
  submitStep.value = 'loading'

  // Simulate network request
  setTimeout(() => {
    isSubmitting.value = false
    submitStep.value = 'success'
    ticketId.value = 'APX-' + Math.floor(100000 + Math.random() * 900000)
  }, 2000)
}

const resetForm = () => {
  form.value = { name: '', email: '', service: '', message: '' }
  errors.value = { name: '', email: '', service: '' }
  submitStep.value = 'idle'
}

onMounted(() => {
  // Launch simulated real-time telemetry updates
  updateInterval = setInterval(updateDashboard, 3000)
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
})
</script>

<template>
  <div>
    <!-- HERO SECTION -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 w-full flex-grow">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        <!-- Hero Text -->
        <div class="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border-sky-400/20 text-xs font-semibold text-primary-dark dark:text-primary tracking-wide">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Available for Global IT Consulting</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans leading-[1.1]">
            Architecting <br class="hidden sm:inline" />
            <span class="bg-gradient-to-r from-primary via-primary-hover to-secondary bg-clip-text text-transparent">
              Secure & Scalable
            </span> <br />
            IT Ecosystems
          </h1>
          
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl font-light leading-relaxed">
            We design and implement zero-trust cloud infrastructure, customized microservices, and reliable cyber security protocols for scaling enterprises. Beautifully simple, robustly engineered.
          </p>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a 
              href="#contact" 
              class="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-slate-900 font-bold hover:shadow-lg hover:shadow-sky-500/20 hover:scale-[1.02] active:scale-98 transition-all text-center flex items-center justify-center space-x-2 group"
            >
              <span>Launch Project</span>
              <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#services" 
              class="px-8 py-4 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-200/20 dark:hover:bg-slate-800/20 hover:scale-[1.02] active:scale-98 transition-all text-center font-semibold text-slate-700 dark:text-slate-200"
            >
              Explore Services
            </a>
          </div>

          <!-- Client Logos Banner -->
          <div class="pt-6 border-t border-slate-200/10 dark:border-slate-800/10">
            <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">TRUSTED BY INNOVATORS</p>
            <div class="flex flex-wrap gap-6 text-slate-500 dark:text-slate-400 opacity-60">
              <span class="font-bold tracking-wider hover:opacity-100 transition-opacity">AETHER LABS</span>
              <span class="font-bold tracking-wider hover:opacity-100 transition-opacity">NEXUS CLOUD</span>
              <span class="font-bold tracking-wider hover:opacity-100 transition-opacity">SENTINEL CO</span>
            </div>
          </div>
        </div>

        <!-- Interactive iOS-style Glass Dashboard -->
        <div class="lg:col-span-5 w-full flex justify-center">
          <div class="w-full max-w-md glass-panel p-6 rounded-3xl relative overflow-hidden group">
            <!-- Glow effect on hover -->
            <div class="absolute -right-20 -bottom-20 w-40 h-40 bg-secondary/15 rounded-full filter blur-[40px] group-hover:scale-125 transition-transform duration-500"></div>
            
            <!-- Header -->
            <div class="flex items-center justify-between pb-4 border-b border-slate-200/10 dark:border-slate-800/10 mb-4">
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-full bg-red-400"></span>
                <span class="w-3 h-3 rounded-full bg-amber-400"></span>
                <span class="w-3 h-3 rounded-full bg-green-400"></span>
                <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono ml-2">apex-ops-dash</span>
              </div>
              <div class="flex items-center space-x-1 text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full font-semibold">
                <Activity class="w-3.5 h-3.5 animate-pulse mr-1" />
                <span>SIM LIVE</span>
              </div>
            </div>

            <!-- Stats Cards Grid -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="glass-card p-4 rounded-2xl relative overflow-hidden">
                <p class="text-xs text-slate-400 dark:text-slate-500 font-medium">CPU Load</p>
                <p class="text-2xl font-bold font-sans mt-1 text-slate-800 dark:text-white">{{ cpuLoad }}%</p>
                <div class="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700" :style="{ width: cpuLoad + '%' }"></div>
                </div>
              </div>
              <div class="glass-card p-4 rounded-2xl">
                <p class="text-xs text-slate-400 dark:text-slate-500 font-medium">RAM Allocation</p>
                <p class="text-2xl font-bold font-sans mt-1 text-slate-800 dark:text-white">{{ memoryUsage }}%</p>
                <div class="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-700" :style="{ width: memoryUsage + '%' }"></div>
                </div>
              </div>
              <div class="glass-card p-4 rounded-2xl">
                <p class="text-xs text-slate-400 dark:text-slate-500 font-medium">Cloud Clusters</p>
                <p class="text-2xl font-bold font-sans mt-1 text-slate-800 dark:text-white">{{ cloudNodes }}</p>
                <p class="text-[10px] text-green-500 font-semibold mt-2 flex items-center">
                  <Check class="w-3.5 h-3.5 mr-0.5" /> All systems online
                </p>
              </div>
              <div class="glass-card p-4 rounded-2xl">
                <p class="text-xs text-slate-400 dark:text-slate-500 font-medium">Security Status</p>
                <p class="text-2xl font-bold font-sans mt-1 text-teal-400 dark:text-teal-400">{{ securityStatus }}</p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-2 flex items-center">
                  <Lock class="w-3.5 h-3.5 mr-0.5" /> Zero-Trust Active
                </p>
              </div>
            </div>

            <!-- Simulator logs terminal -->
            <div class="glass-card bg-slate-900/90 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-950/20">
              <div class="flex items-center space-x-1.5 text-slate-400 text-xs font-mono mb-2">
                <Terminal class="w-3.5 h-3.5 text-primary" />
                <span>Real-time Log Telemetry</span>
              </div>
              <div class="space-y-1.5 font-mono text-[11px] h-24 overflow-y-auto leading-relaxed text-slate-300 text-left">
                <div v-for="log in currentLogs" :key="log.id" class="transition-opacity duration-300">
                  <span :class="log.type === 'success' ? 'text-teal-400' : 'text-sky-300'">› </span>
                  <span>{{ log.text }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- SERVICES SECTION -->
    <section id="services" class="py-20 sm:py-28 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Section title -->
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-xs font-bold text-primary dark:text-primary uppercase tracking-widest">Our Competencies</h2>
          <p class="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans mt-2">
            High-Performance IT Engineering
          </p>
          <div class="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-4"></div>
          <p class="text-slate-500 dark:text-slate-400 mt-4 font-light text-sm sm:text-base leading-relaxed">
            We focus on building reliable, fast, and secure products that align with contemporary architecture standards.
          </p>
        </div>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(service, index) in services" 
            :key="index"
            class="glass-card p-6 rounded-3xl text-left flex flex-col justify-between hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/5 group"
          >
            <div>
              <!-- Icon container -->
              <div class="p-3 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-300" :class="service.colorClass">
                <component :is="service.icon" class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-bold font-sans mt-6 text-slate-800 dark:text-white">{{ service.title }}</h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm font-light leading-relaxed mt-2.5">
                {{ service.desc }}
              </p>
            </div>
            <a href="#contact" class="flex items-center space-x-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors mt-6 group/link">
              <span>Request details</span>
              <ChevronRight class="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- PORTFOLIO SECTION -->
    <section id="solutions" class="py-20 sm:py-28 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div class="text-left max-w-lg">
            <h2 class="text-xs font-bold text-primary dark:text-primary uppercase tracking-widest">Selected Works</h2>
            <p class="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans mt-2">Proven Solutions Deployments</p>
            <div class="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full mt-4"></div>
          </div>
          
          <!-- Filters -->
          <div class="flex flex-wrap gap-2 glass-panel p-1.5 rounded-2xl w-fit">
            <button 
              v-for="filter in filters" 
              :key="filter"
              @click="activeFilter = filter"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer"
              :class="activeFilter === filter ? 'bg-gradient-to-r from-primary to-secondary text-slate-900 shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/20 dark:hover:bg-slate-800/20'"
            >
              {{ filter }}
            </button>
          </div>
        </div>

        <!-- Solutions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(solution, index) in filteredSolutions" 
            :key="index"
            class="glass-panel p-6 rounded-3xl flex flex-col justify-between hover:scale-[1.01] hover:shadow-lg transition-all duration-300 text-left border border-slate-200/10 dark:border-slate-800/10 relative overflow-hidden"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="px-3 py-1 rounded-full glass-card border-sky-400/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                  {{ solution.category }}
                </span>
                <span class="text-xs font-mono font-bold text-teal-500 dark:text-teal-400 flex items-center">
                  <TrendingUp class="w-3.5 h-3.5 mr-1" />
                  {{ solution.stats }}
                </span>
              </div>
              <h3 class="text-lg font-bold font-sans text-slate-800 dark:text-white mb-3">{{ solution.title }}</h3>
              <p class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-light leading-relaxed mb-6">
                {{ solution.description }}
              </p>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-4 border-t border-slate-200/10 dark:border-slate-800/10">
              <span 
                v-for="t in solution.tech" 
                :key="t"
                class="px-2.5 py-0.5 rounded-lg bg-slate-200/40 dark:bg-slate-800/40 text-[10px] font-mono text-slate-600 dark:text-slate-400"
              >
                #{{ t }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact" class="py-20 sm:py-28 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          <!-- Context Info -->
          <div class="lg:col-span-5 text-left space-y-6 sm:space-y-8">
            <div>
              <h2 class="text-xs font-bold text-primary dark:text-primary uppercase tracking-widest">Connect With Us</h2>
              <p class="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans mt-2">Start Your Journey</p>
              <div class="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full mt-4"></div>
            </div>
            
            <p class="text-slate-500 dark:text-slate-400 font-light text-sm sm:text-base leading-relaxed">
              Need a specific deployment configuration, zero-trust cybersecurity assessment, or custom application build? Let us know, and we will formulate a precise layout of operations.
            </p>

            <!-- Local Details -->
            <div class="space-y-4 font-sans text-sm">
              <div class="flex items-center space-x-3.5 text-slate-600 dark:text-slate-300">
                <span class="p-2 rounded-xl glass-card text-primary"><Mail class="w-4 h-4" /></span>
                <span>inquiries@apexsolutions.io</span>
              </div>
              <div class="flex items-center space-x-3.5 text-slate-600 dark:text-slate-300">
                <span class="p-2 rounded-xl glass-card text-primary"><Phone class="w-4 h-4" /></span>
                <span>+62 (812) 3456-7890</span>
              </div>
              <div class="flex items-center space-x-3.5 text-slate-600 dark:text-slate-300">
                <span class="p-2 rounded-xl glass-card text-primary"><MapPin class="w-4 h-4" /></span>
                <span>Jakarta, Indonesia (GMT+7)</span>
              </div>
            </div>
          </div>

          <!-- Glass Interactive Form Container -->
          <div class="lg:col-span-7">
            <div class="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden text-left">
              
              <!-- SUCCESS VIEW -->
              <div v-if="submitStep === 'success'" class="py-12 text-center space-y-6 animate-fade-in">
                <div class="w-16 h-16 bg-gradient-to-tr from-primary to-secondary text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20">
                  <CheckCircle2 class="w-8 h-8" />
                </div>
                <h3 class="text-2xl font-bold font-sans text-slate-800 dark:text-white">Permintaan Terkirim!</h3>
                <div class="max-w-md mx-auto p-4 rounded-2xl glass-card text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 font-mono border border-slate-200/20">
                  <div class="flex justify-between"><span class="text-slate-400">Kode Tiket:</span> <span class="font-bold text-primary">{{ ticketId }}</span></div>
                  <div class="flex justify-between"><span class="text-slate-400">Nama:</span> <span>{{ form.name }}</span></div>
                  <div class="flex justify-between"><span class="text-slate-400">Service:</span> <span>{{ form.service }}</span></div>
                </div>
                <p class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm mx-auto font-light leading-relaxed">
                  Kami telah mengamankan tiket konsultasi Anda. Tim engineering kami akan menghubungi Anda dalam waktu 24 jam.
                </p>
                <button 
                  @click="resetForm" 
                  class="px-6 py-2.5 rounded-xl glass-card text-xs font-semibold hover:bg-slate-200/20 dark:hover:bg-slate-800/20 transition-all cursor-pointer"
                >
                  Kirim Form Baru
                </button>
              </div>

              <!-- LOADING VIEW -->
              <div v-else-if="submitStep === 'loading'" class="py-20 text-center space-y-4 animate-fade-in">
                <div class="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto"></div>
                <p class="text-sm font-medium text-slate-600 dark:text-slate-300 font-mono">Mengamankan enkripsi form...</p>
                <p class="text-xs text-slate-400 dark:text-slate-500 font-mono">Membuat tiket Apex IT Ops...</p>
              </div>

              <!-- FORM VIEW -->
              <form v-else @submit.prevent="handleContactSubmit" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Name -->
                  <div>
                    <label for="name" class="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input 
                      id="name"
                      type="text" 
                      v-model="form.name"
                      class="w-full glass-input px-4 py-3 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white"
                      placeholder="John Doe"
                    />
                    <span v-if="errors.name" class="text-xs text-red-500 mt-1 block font-medium">{{ errors.name }}</span>
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Business Email</label>
                    <input 
                      id="email"
                      type="email" 
                      v-model="form.email"
                      class="w-full glass-input px-4 py-3 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white"
                      placeholder="john@firm.com"
                    />
                    <span v-if="errors.email" class="text-xs text-red-500 mt-1 block font-medium">{{ errors.email }}</span>
                  </div>
                </div>

                <!-- Service Select -->
                <div>
                  <label for="service" class="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Pilih Kebutuhan Layanan</label>
                  <select 
                    id="service"
                    v-model="form.service"
                    class="w-full glass-input px-4 py-3 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white cursor-pointer"
                  >
                    <option value="" disabled selected>Pilih Layanan IT...</option>
                    <option value="Cloud Migration">Migrasi Cloud & DevOps</option>
                    <option value="Cybersecurity Audit">Audit Keamanan Siber & Pen-Testing</option>
                    <option value="Software Development">Pembuatan Aplikasi Kustom</option>
                    <option value="Systems Consulting">Konsultasi IT & Sistem Integrasi</option>
                  </select>
                  <span v-if="errors.service" class="text-xs text-red-500 mt-1 block font-medium">{{ errors.service }}</span>
                </div>

                <!-- Message -->
                <div>
                  <label for="message" class="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Deskripsi Kebutuhan Projek (Opsional)</label>
                  <textarea 
                    id="message"
                    rows="4" 
                    v-model="form.message"
                    class="w-full glass-input px-4 py-3 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white"
                    placeholder="Jelaskan kebutuhan performa sistem atau arsitektur teknologi Anda..."
                  ></textarea>
                </div>

                <!-- Submit button -->
                <button 
                  type="submit" 
                  class="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-slate-900 font-bold hover:shadow-lg hover:shadow-sky-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Kirim Pengajuan</span>
                  <Send class="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>
