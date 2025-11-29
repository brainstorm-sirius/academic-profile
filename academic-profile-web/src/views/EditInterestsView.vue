<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useInterestsStore } from '@/stores/interests'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import MobileMenu from '@/components/profile/MobileMenu.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const router = useRouter()
const interestsStore = useInterestsStore()
const { predefinedInterests, selectedInterests } = storeToRefs(interestsStore)
const { toggleInterest, addInterest, removeInterest, saveInterests } = interestsStore

const customInterest = ref('')
const searchQuery = ref('')

const filteredInterests = computed(() => {
  if (!searchQuery.value) {
    return predefinedInterests.value
  }
  return predefinedInterests.value.filter(interest =>
    interest.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const canAddMore = computed(() => selectedInterests.value.length < 10)

const isSelected = (interest) => {
  return selectedInterests.value.includes(interest)
}

const handleAddCustom = () => {
  const trimmed = customInterest.value.trim()
  if (trimmed && !selectedInterests.value.includes(trimmed) && canAddMore.value) {
    addInterest(trimmed)
    customInterest.value = ''
  }
}

const handleSave = () => {
  saveInterests()
  router.push('/profile')
}

const handleCancel = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface lg:flex-row">
    <MobileMenu />
    <ProfileSidebar />
    <main class="flex-1 px-4 py-8 lg:px-10">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-primary-dark">Edit Interests</h1>
        <p class="mt-2 text-muted">
          Select up to 10 interests that best describe your research areas
        </p>
      </header>

      <div class="space-y-6">
        <!-- Selected Interests Display -->
        <div class="rounded-2xl bg-white p-6 shadow-card">
          <h2 class="mb-4 text-lg font-semibold text-primary-dark">
            Selected Interests
            <span class="ml-2 text-sm font-normal text-muted">
              ({{ selectedInterests.length }}/10)
            </span>
          </h2>
          <div v-if="selectedInterests.length === 0" class="text-muted">
            No interests selected yet
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <button
              v-for="interest in selectedInterests"
              :key="interest"
              @click="removeInterest(interest)"
              class="group flex items-center gap-2 rounded-xl bg-secondary/20 px-4 py-2 text-sm font-medium text-primary-dark transition hover:bg-secondary/30"
            >
              <span>{{ interest }}</span>
              <svg
                class="h-4 w-4 text-primary-dark transition group-hover:text-red-500"
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

        <!-- Add Custom Interest -->
        <div class="rounded-2xl bg-white p-6 shadow-card">
          <h2 class="mb-4 text-lg font-semibold text-primary-dark">Add Custom Interest</h2>
          <div class="flex gap-3">
            <div class="flex-1">
              <BaseInput
                v-model="customInterest"
                placeholder="Enter your custom interest"
                @keyup.enter="handleAddCustom"
              />
            </div>
            <button
              @click="handleAddCustom"
              :disabled="!canAddMore || !customInterest.trim()"
              class="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <p v-if="!canAddMore" class="mt-2 text-sm text-red-500">
            Maximum of 10 interests reached. Remove some to add more.
          </p>
        </div>

        <!-- Predefined Interests -->
        <div class="rounded-2xl bg-white p-6 shadow-card">
          <h2 class="mb-4 text-lg font-semibold text-primary-dark">Predefined Interests</h2>
          
          <!-- Search -->
          <div class="mb-4">
            <BaseInput
              v-model="searchQuery"
              placeholder="Search interests..."
              type="text"
            />
          </div>

          <!-- Interests Grid -->
          <div class="max-h-96 overflow-y-auto">
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <button
                v-for="interest in filteredInterests"
                :key="interest"
                @click="toggleInterest(interest)"
                :disabled="!isSelected(interest) && !canAddMore"
                :class="[
                  'rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition',
                  isSelected(interest)
                    ? 'border-secondary bg-secondary/20 text-primary-dark'
                    : 'border-border bg-surface text-primary-dark hover:border-secondary hover:bg-secondary/10',
                  !isSelected(interest) && !canAddMore
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span>{{ interest }}</span>
                  <svg
                    v-if="isSelected(interest)"
                    class="h-5 w-5 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4">
          <button
            @click="handleCancel"
            class="rounded-2xl border-2 border-border bg-white px-6 py-3 text-sm font-semibold text-primary-dark transition hover:bg-surface"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            class="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark"
          >
            Save Interests
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

