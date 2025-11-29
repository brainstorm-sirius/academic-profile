<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCollaborationStore } from '@/stores/collaboration'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import MobileMenu from '@/components/profile/MobileMenu.vue'
import AuthorSearchCard from '@/components/profile/AuthorSearchCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const collaborationStore = useCollaborationStore()
const { searchResults, searchLoading, searchError } = storeToRefs(collaborationStore)
const { searchUsers } = collaborationStore

const searchQuery = ref('')
const searchLimit = ref('10')
const countOptions = ['5', '10', '15', '20', '25', '30', '100']

const handleSearch = () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    return
  }
  searchUsers(searchQuery.value, parseInt(searchLimit.value, 10))
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface lg:flex-row">
    <MobileMenu />
    <ProfileSidebar />
    <main class="flex-1 px-4 py-8 lg:px-10">
      <header class="mb-8">
        <h1 class="mb-6 text-3xl font-bold text-primary-dark">Search Authors</h1>
      </header>

      <!-- Search Section -->
      <div class="mb-8 rounded-2xl bg-white p-6 shadow-card">
        <h2 class="mb-4 text-lg font-semibold text-primary-dark">Search Unregistered Authors</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="md:col-span-2">
            <BaseInput
              v-model="searchQuery"
              label="Author name"
              placeholder="Enter author name"
              :required="true"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-primary-dark">
              Limit
            </label>
            <select
              v-model="searchLimit"
              class="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option v-for="option in countOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>
        <button
          @click="handleSearch"
          :disabled="searchLoading || !searchQuery || searchQuery.length < 2"
          class="mt-4 w-full rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ searchLoading ? 'Searching...' : 'Search' }}
        </button>

        <!-- Search Results -->
        <div v-if="searchLoading" class="mt-6 flex items-center justify-center py-8">
          <p class="text-lg font-semibold text-primary-dark">Searching...</p>
        </div>

        <div v-else-if="searchError" class="mt-6 flex flex-col items-center justify-center gap-4 py-8">
          <p class="text-lg font-semibold text-primary-dark">Search error</p>
          <p class="text-sm text-muted">{{ searchError }}</p>
          <button
            class="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark"
            @click="handleSearch"
          >
            Try again
          </button>
        </div>

        <div v-else-if="searchResults.length > 0" class="mt-6 space-y-3">
          <h3 class="text-md font-semibold text-primary-dark">Search Results</h3>
          <AuthorSearchCard
            v-for="author in searchResults"
            :key="author.author_id || author.id"
            :author="author"
          />
        </div>

        <div
          v-else-if="!searchLoading && searchQuery && searchQuery.length >= 2 && searchResults.length === 0"
          class="mt-6 flex items-center justify-center py-8"
        >
          <p class="text-sm text-muted">No results found. Try a different query.</p>
        </div>
      </div>
    </main>
  </div>
</template>

