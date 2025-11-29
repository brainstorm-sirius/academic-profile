<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthorStore } from '@/stores/author'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import MobileMenu from '@/components/profile/MobileMenu.vue'
import ScientistCard from '@/components/profile/ScientistCard.vue'
import AnalyticsPanel from '@/components/profile/AnalyticsPanel.vue'
import TopicDistributionChart from '@/components/charts/TopicDistributionChart.vue'
import PublicationList from '@/components/profile/PublicationList.vue'

const route = useRoute()
const authorStore = useAuthorStore()
const {
  scientist,
  analytics,
  topicDistribution,
  publications,
  years,
  loading,
  error
} = storeToRefs(authorStore)

const { fetchAuthorProfile, sortPublications } = authorStore

const loadAuthorData = () => {
  const authorId = route.query.id
  if (authorId) {
    fetchAuthorProfile(authorId)
  } else {
    authorStore.error = 'ID автора не указан'
  }
}

onMounted(() => {
  loadAuthorData()
})

watch(() => route.query.id, () => {
  loadAuthorData()
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface lg:flex-row">
    <MobileMenu />
    <ProfileSidebar />
    <main class="flex-1 px-4 py-8 lg:px-10">
      <div v-if="loading" class="flex h-full items-center justify-center py-20">
        <p class="text-lg font-semibold text-primary-dark">Loading author data…</p>
      </div>
      <div v-else-if="error" class="flex h-full flex-col items-center justify-center gap-4 py-20">
        <p class="text-lg font-semibold text-primary-dark">Some internet troubles</p>
        <p class="text-sm text-muted">{{ error }}</p>
        <button
          v-if="route.query.id"
          class="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark"
          @click="fetchAuthorProfile(route.query.id)"
        >
          Try again
        </button>
      </div>
      <template v-else>
        <div class="grid gap-6 lg:grid-cols-[340px,1fr]">
          <ScientistCard v-if="scientist" :scientist="scientist" :isAuthor="true" />
          <div class="space-y-6">
            <div class="grid gap-6 lg:grid-cols-1">
              <TopicDistributionChart :topics="topicDistribution" />
            </div>
          </div>
        </div>

        <div class="mt-8">
          <PublicationList
            :publications="publications"
            :years="years"
            :sorter="sortPublications"
          />
        </div>
      </template>
    </main>
  </div>
</template>




