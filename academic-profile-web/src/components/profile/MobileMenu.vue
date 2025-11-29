<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProfileStore } from '../../stores/profile'

const profileStore = useProfileStore()
const router = useRouter()
const route = useRoute()

const isMenuOpen = ref(false)

const navItems = [
  { label: 'Dashboard', path: '/profile' },
  { label: 'Collaboration', path: '/collaboration' },
  { label: 'Edit interests', path: '/edit-interests' },
  { label: 'Knowledge Graph', path: '/knowledge-graph' }
]

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function handleNavigation(path) {
  router.push(path)
  closeMenu()
}

function logout() {
  profileStore.setAuthToken(null)
  closeMenu()
  router.push('/login')
}
</script>

<template>
  <!-- Mobile Menu Button (visible only on mobile) -->
  <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <img 
          src="@/assets/img/sirius_university_logo_color.svg" 
          alt="Sirius University" 
          class="h-8"
        >
      </div>
      <button
        @click="toggleMenu"
        class="p-2 rounded-lg text-primary hover:bg-secondary/20 transition"
        aria-label="Toggle menu"
      >
        <svg
          v-if="!isMenuOpen"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Menu Overlay -->
  <div
    v-if="isMenuOpen"
    class="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
    @click="closeMenu"
  ></div>

  <!-- Mobile Menu Sidebar -->
  <aside
    :class="[
      'lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto',
      isMenuOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="flex flex-col justify-between h-full px-6 py-10">
      <div>
        <div class="mb-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img 
              src="@/assets/img/sirius_university_logo_color.svg" 
              alt="Sirius University" 
              class="h-8"
            >
          </div>
          <button
            @click="closeMenu"
            class="p-2 rounded-lg text-primary hover:bg-secondary/20 transition"
            aria-label="Close menu"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav class="space-y-2">
          <button
            v-for="item in navItems"
            :key="item.label"
            @click="handleNavigation(item.path)"
            :class="[
              'w-full text-left block rounded-xl px-4 py-3 text-base font-medium transition',
              route.path === item.path
                ? 'bg-secondary/20 text-primary'
                : 'text-primary-dark hover:bg-secondary/20 hover:text-primary'
            ]"
          >
            {{ item.label }}
          </button>
        </nav>
      </div>

      <div 
        class="logout cursor-pointer flex gap-3 items-center mt-8 p-4 rounded-xl hover:bg-secondary/20 transition"
        @click="logout"
      >
        <img src="@/assets/img/log_out_icon.svg" alt="Log out" class="w-5 h-5">
        <p class="logout-text text-base font-medium text-primary-dark">Log out</p>
      </div>
    </div>
  </aside>

  <!-- Spacer to prevent content from being hidden under fixed header -->
  <div class="lg:hidden h-16"></div>
</template>

