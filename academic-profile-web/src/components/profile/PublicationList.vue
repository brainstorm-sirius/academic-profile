<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useProfileStore } from '@/stores/profile'

const props = defineProps({
  publications: {
    type: Array,
    default: () => []
  },
  years: {
    type: Array,
    default: () => []
  },
  sorter: {
    type: Function,
    required: true
  }
})

const profileStore = useProfileStore()

const sortKey = ref('citations')
const yearFilter = ref('all')
const menuOpenId = ref(null)
const deletingId = ref(null)

const items = computed(() => props.sorter(sortKey.value, yearFilter.value))

const toggleMenu = (publicationId) => {
  menuOpenId.value = menuOpenId.value === publicationId ? null : publicationId
}

const handleDelete = async (publicationId) => {
  if (!publicationId || deletingId.value) {
    return
  }

  if (!confirm('Delete this publication?')) {
    menuOpenId.value = null
    return
  }

  deletingId.value = publicationId
  const success = await profileStore.deleteUserPublication(publicationId)
  deletingId.value = null
  menuOpenId.value = null

  if (!success) {
    alert('Failed to delete publication. Please try again.')
  }
}

const sortLabels = {
  citations: 'By citations',
  year: 'By year',
  title: 'By name'
}
</script>

<template>
  <section id="publications" class="rounded-2xl bg-white p-6 shadow-card">
    <header class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-2xl font-bold text-primary-dark">All publications</h3>
      </div>
      <div class="flex flex-wrap gap-3">
        <select
          v-model="sortKey"
          class="rounded-2xl border border-border bg-surface px-4 py-2 text-sm font-medium text-primary-dark"
        >
          <option v-for="(label, key) in sortLabels" :key="key" :value="key">
            {{ label }}
          </option>
        </select>
        <select
          v-model="yearFilter"
          class="rounded-2xl border border-border bg-surface px-4 py-2 text-sm font-medium text-primary-dark"
        >
          <option value="all">All years</option>
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </header>

    <div class="space-y-4 overflow-hidden rounded-2xl bg-surface/60 p-4">
      <template v-if="items.length">
        <article
          v-for="publication in items"
          :key="publication.id"
          class="rounded-2xl bg-white px-5 py-4 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
        >
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div class="flex-1">
              <h4 class="text-xl font-semibold text-primary-dark">{{ publication.title }}</h4>
              <p class="text-sm text-muted">
                {{ publication.journal }} · {{ publication.year }}
              </p>
              <p class="mt-2 text-sm text-slate-600">
                {{ publication.summary }}
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="text-right">
                <p class="text-3xl font-bold text-primary-dark">{{ publication.citations }}</p>
                <p class="text-sm text-muted">citations</p>
              </div>
              <div class="relative">
                <button
                  type="button"
                  class="rounded-full bg-surface px-3 py-1 text-lg font-semibold text-primary-dark transition hover:bg-surface/80"
                  @click.stop="toggleMenu(publication.id)"
                >
                  &hellip;
                </button>
                <div
                  v-if="menuOpenId === publication.id"
                  class="absolute right-0 top-10 w-44 rounded-2xl border border-border bg-white p-3 text-left shadow-card"
                >
                  <button
                    type="button"
                    class="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="deletingId === publication.id"
                    @click.stop="handleDelete(publication.id)"
                  >
                    {{ deletingId === publication.id ? 'Deleting…' : 'Delete publication' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </template>
      <div
        v-else
        class="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white px-6 py-10 text-center text-primary-dark shadow-sm"
      >
        <p class="text-lg font-semibold">You haven't any publications yet</p>
        <p class="text-sm text-muted">
          Add your first publications to start getting recommendations
        </p>
        <RouterLink
          to="/new-article"
          class="rounded-2xl bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Add new publication
        </RouterLink>
      </div>
    </div>
  </section>
</template>

