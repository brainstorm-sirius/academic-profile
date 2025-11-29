<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import MobileMenu from '@/components/profile/MobileMenu.vue'
import ScientistCard from '@/components/profile/ScientistCard.vue'
import AnalyticsPanel from '@/components/profile/AnalyticsPanel.vue'
import CitationTrendChart from '@/components/charts/CitationTrendChart.vue'
import TopicDistributionChart from '@/components/charts/TopicDistributionChart.vue'
import CollaborationGraph from '@/components/charts/CollaborationGraph.vue'
import PublicationList from '@/components/profile/PublicationList.vue'

const router = useRouter()
const profileStore = useProfileStore()
const {
  scientist,
  analytics,
  citationSeries,
  topicDistribution,
  collaborators,
  publications,
  years
} = storeToRefs(profileStore)

const { sortPublications, fetchUserData, fetchUserPublications } = profileStore

// Загружаем данные пользователя при открытии профиля
onMounted(async () => {
  const loaded = await fetchUserData()
  if (loaded) {
    await fetchUserPublications()
  }
})

const handleAddNew = () => {
  router.push('/new-article')
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface lg:flex-row">
    <MobileMenu />
    <ProfileSidebar />
    <main class="flex-1 px-4 py-8 lg:px-10">
      <header class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-primary-dark">Welcome, {{ scientist.name }}</h1>
        </div>
        <button
          @click="handleAddNew"
          class="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark"
        >
          Add new
        </button>
      </header>

      <div class="grid gap-6 lg:grid-cols-[340px,1fr]">
        <ScientistCard :scientist="scientist" />
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
    </main>
  </div>
</template>

