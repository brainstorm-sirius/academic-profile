<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useKnowledgeGraphStore } from '@/stores/knowledgeGraph'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import MobileMenu from '@/components/profile/MobileMenu.vue'
import KnowledgeGraph from '@/components/charts/KnowledgeGraph.vue'

const knowledgeGraphStore = useKnowledgeGraphStore()
const { graphData, loading, error } = storeToRefs(knowledgeGraphStore)
const { fetchGraphData } = knowledgeGraphStore

onMounted(() => {
  fetchGraphData()
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface lg:flex-row">
    <MobileMenu />
    <ProfileSidebar />
    <main class="flex-1 px-4 py-8 lg:px-10">
      <header class="mb-8">
        <h1 class="mb-2 text-3xl font-bold text-primary-dark">Knowledge graph</h1>
        <p class="text-muted">
          Visualization of connections between scientists and their fields of interest. The big peaks are areas of interest, the small ones are scientists.
        </p>
      </header>

      <div v-if="loading" class="flex h-full items-center justify-center py-20">
        <div class="text-center">
          <div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p class="text-lg font-semibold text-primary-dark">Loading...</p>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div v-if="error && graphData.nodes.length > 0" class="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 shadow-card">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-yellow-800">Mock data is used!</p>
              <p class="text-xs text-yellow-700 mt-1">{{ error }}</p>
              <p class="text-xs text-yellow-600 mt-1">
                Make sure that the backend provides an endpoint.
              </p>
            </div>
            <button
              class="rounded-xl bg-yellow-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-yellow-700"
              @click="fetchGraphData"
            >
              Обновить
            </button>
          </div>
        </div>

        <div v-if="error && graphData.nodes.length === 0" class="rounded-2xl bg-white p-6 shadow-card">
          <div class="flex flex-col items-center justify-center gap-4 py-10">
            <p class="text-lg font-semibold text-primary-dark">Error</p>
            <p class="text-sm text-muted">{{ error }}</p>
            <button
              class="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark"
              @click="fetchGraphData"
            >
              Try again
            </button>
          </div>
        </div>

        <div v-if="graphData.nodes.length > 0" class="space-y-6">
        <div class="rounded-2xl bg-white shadow-card overflow-hidden">
          <div class="p-6 pb-4 flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="h-4 w-4 rounded border-2 border-[#142850] bg-[#5BC0F8]"></div>
              <span class="text-sm font-medium text-primary-dark">Areas of interest</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-4 w-4 rounded-full bg-[#7C3AED] border-2 border-[#5BC0F8]"></div>
              <span class="text-sm font-medium text-primary-dark">Scientists</span>
            </div>
          </div>
          
          <div class="px-6 pb-6">
            <KnowledgeGraph :nodes="graphData.nodes" :edges="graphData.edges" />
          </div>
        </div>

        <div class="grid gap-4 rounded-2xl bg-white p-6 shadow-card md:grid-cols-2">
          <div>
            <p class="mb-2 text-sm font-semibold text-primary-dark">Graph statistics:</p>
            <div class="space-y-2 text-sm text-muted">
              <p>Areas of interest: {{ graphData.nodes.filter(n => n.group === 'interest').length }}</p>
              <p>Scientists: {{ graphData.nodes.filter(n => n.group === 'scientist').length }}</p>
              <p>Relations: {{ graphData.edges.length }}</p>
            </div>
          </div>
          <div>
            <p class="mb-2 text-sm font-semibold text-primary-dark">Instructions</p>
            <ul class="space-y-1 text-xs text-muted">
              <li>• Drag the nodes to change the location</li>
              <li>• Use the mouse wheel to zoom</li>
              <li>• Hover the cursor over the node to get information</li>
              <li>• Click on the node to highlight</li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </main>
  </div>
</template>

