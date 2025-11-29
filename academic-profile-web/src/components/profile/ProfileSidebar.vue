<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useProfileStore } from '../../stores/profile'

const profileStore = useProfileStore()

const router = useRouter()
const route = useRoute()

const navItems = [
  { label: 'Dashboard', path: '/profile' },
  { label: 'Collaboration', path: '/collaboration' },
  { label: 'Edit interests', path: '/edit-interests' },
  { label: 'Knowledge Graph', path: '/knowledge-graph' }
]

function logout() {
  profileStore.setAuthToken(null)
  router.push('/login')
}
</script>

<template>
  <aside
    class="hidden min-h-screen w-72 flex-shrink-0 justify-between bg-white/90 px-6 py-10 shadow-card lg:flex h-screen sticky top-0"
  >
    <div class="flex flex-col justify-between">
      <div>
      <div class="mb-10 flex items-center gap-3">
        <div>
            <img src="@/assets/img/sirius_university_logo_color.svg" alt="Sirius University" class="w-100">
        </div>
      </div>

      <nav class="space-y-2">
        <router-link
          v-for="item in navItems"
          :key="item.label"
          :to="item.path"
          :class="[
            'block rounded-xl px-4 py-3 text-base font-medium transition',
            route.path === item.path
              ? 'bg-secondary/20 text-primary'
              : 'hover:bg-secondary/20 hover:text-primary'
          ]"
        >
          {{ item.label }}
        </router-link>
      </nav>
      </div>
      <div class="logout cursor-pointer flex gap-3" @click="logout">
        <img src="@/assets/img/log_out_icon.svg">
        <p class="logout-text">Log out</p>
      </div>
    </div>
  </aside>
</template>

