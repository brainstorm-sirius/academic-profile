<script setup>
import { ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import BaseInput from '@/components/base/BaseInput.vue'

const props = defineProps({
  scientist: {
    type: Object,
    required: true
  },
  isAuthor: {
    type: Boolean,
    required: false,
    default: false
  }
})

const profileStore = useProfileStore()
const showEditModal = ref(false)
const hIndexValue = ref('')
const orcidValue = ref('')
const error = ref('')
const orcidError = ref('')

const openEditModal = () => {
  const hIndexMetric = props.scientist.metrics.find(m => m.label === 'H-Index')
  hIndexValue.value = hIndexMetric ? hIndexMetric.value : ''
  orcidValue.value = props.scientist.orcid || ''
  error.value = ''
  orcidError.value = ''
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  hIndexValue.value = ''
  orcidValue.value = ''
  error.value = ''
  orcidError.value = ''
}

const validateORCID = (orcid) => {
  // ORCID format: XXXX-XXXX-XXXX-XXXX (16 digits with hyphens)
  const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/
  return orcidRegex.test(orcid)
}

const handleSave = () => {
  // Validate H-Index
  const hIndex = parseInt(hIndexValue.value)
  if (isNaN(hIndex) || hIndex < 0) {
    error.value = 'Please enter a valid positive number'
    return
  }

  // Validate ORCID
  const trimmedORCID = orcidValue.value.trim()
  if (!trimmedORCID) {
    orcidError.value = 'ORCID is required'
    return
  }

  if (!validateORCID(trimmedORCID)) {
    orcidError.value = 'Please enter a valid ORCID format (XXXX-XXXX-XXXX-XXXX)'
    return
  }

  // Clear errors if validation passes
  error.value = ''
  orcidError.value = ''

  // Update both values
  profileStore.updateHIndex(hIndex.toString())
  profileStore.updateORCID(trimmedORCID)
  closeEditModal()
}

const handleModalClick = (e) => {
  if (e.target === e.currentTarget) {
    closeEditModal()
  }
}
</script>

<template>
  <section class="relative rounded-2xl bg-white p-6 shadow-card">
    <!-- Edit button - only show if not viewing another author's profile -->
    <button
      v-if="!isAuthor"
      @click="openEditModal"
      class="absolute right-4 top-4 rounded-lg bg-primary/10 p-2 text-primary transition hover:bg-primary/20"
      title="Edit H-Index & ORCID"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </button>

    <div class="flex flex-col items-center text-center">
      <img
        src="/src/assets/img/avatar.png"
        alt="avatar"
        class="mb-4 h-28 w-28 rounded-full object-cover shadow-md"
      />
      <p class="text-xs uppercase tracking-[0.4em] text-secondary">ORCID</p>
      <p class="mb-1 text-sm font-semibold text-primary-dark">{{ scientist.orcid }}</p>
      <h2 class="mb-1 text-2xl font-bold text-primary-dark">{{ scientist.name }}</h2>
      <p class="text-sm text-black" v-if="!isAuthor">{{ scientist.username }}</p>
    </div>

    <div class="mt-6 grid grid-cols-3 gap-3">
      <div
        v-for="metric in scientist.metrics"
        :key="metric.label"
        class="rounded-2xl bg-surface p-4 text-center"
      >
        <p class="uppercase tracking-wide text-muted" style="font-size: 8px;">{{ metric.label }}</p>
        <p class="text-2xl font-bold text-primary-dark" style="font-size: 20px;">{{ metric.value }}</p>
      </div>
    </div>

    <!-- Edit H-Index Modal -->
    <div
      v-if="showEditModal"
      @click="handleModalClick"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        @click.stop
        class="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
      >
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-bold text-primary-dark">Edit H-Index & ORCID</h3>
          <button
            @click="closeEditModal"
            class="rounded-lg p-1 text-muted transition hover:bg-surface"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        <div class="mb-4">
          <BaseInput
            v-model="hIndexValue"
            label="H-Index"
            type="number"
            placeholder="Enter H-Index value"
            :error="error"
            required
          />
        </div>

        <div class="mb-6">
          <BaseInput
            v-model="orcidValue"
            label="ORCID"
            type="text"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            :error="orcidError"
            required
          />
        </div>

        <div class="flex gap-3">
          <button
            @click="closeEditModal"
            class="flex-1 rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-surface"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            class="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

