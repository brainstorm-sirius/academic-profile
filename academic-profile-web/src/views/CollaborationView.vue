<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCollaborationStore } from '@/stores/collaboration'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import MobileMenu from '@/components/profile/MobileMenu.vue'
import CollaborationScientistCard from '@/components/collaboration/CollaborationScientistCard.vue'

const collaborationStore = useCollaborationStore()
const { recommendations, loading, error } = storeToRefs(collaborationStore)
const { fetchRecommendations } = collaborationStore

const count = ref('10')


const countOptions = ['5', '10', '15', '20', '25', '30', '100']

const handleRecommend = () => {
  fetchRecommendations({
    count: count.value
  })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface lg:flex-row">
    <MobileMenu />
    <ProfileSidebar />
    <main class="flex-1 px-4 py-8 lg:px-10">
      <header class="mb-8">
        <h1 class="mb-6 text-3xl font-bold text-primary-dark">Collaboration</h1>

        <div class="mb-6 rounded-2xl bg-white p-6 shadow-card">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-primary-dark">
                Count of authors
              </label>
              <select
                v-model="count"
                class="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option v-for="option in countOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>

            <div class="flex items-end">
              <button
                @click="handleRecommend"
                :disabled="loading"
                class="w-full rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Loading...' : 'Recommend' }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div v-if="loading" class="flex h-full items-center justify-center py-20">
        <p class="text-lg font-semibold text-primary-dark">Loading recommendations...</p>
      </div>

      <div v-else-if="error" class="flex h-full flex-col items-center justify-center gap-4 py-20">
        <p class="text-lg font-semibold text-primary-dark">Download error</p>
        <p class="text-sm text-muted">{{ error }}</p>
        <button
          class="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark"
          @click="handleRecommend"
        >
          Try again
        </button>
      </div>

      <div v-else-if="recommendations.length > 0" class="grid gap-4 md:grid-cols-2">
        <CollaborationScientistCard
          v-for="scientist in recommendations"
          :key="scientist.author_id"
          :scientist="scientist"
        />
      </div>

      <div
        v-else-if="!loading && recommendations.length === 0"
        class="flex h-full items-center justify-center py-20"
      >
        <p class="text-lg font-semibold text-primary-dark">
          Push "Recommend" to get your recommended authors
        </p>
      </div>
    </main>
  </div>
</template>

