import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthorStore = defineStore('author', () => {
  const scientist = ref(null)
  const analytics = ref(null)
  const citationSeries = ref([])
  const topicDistribution = ref([])
  const collaborators = ref([])
  const publications = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchAuthorProfile = async (authorId) => {
    if (!authorId) {
      error.value = 'ID автора не указан'
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`http://academic.khokhlovkirill.ru:8000/authors/${authorId}/profile`)

      if (!response.ok) {
        throw new Error('Не удалось загрузить данные автора')
      }

      const data = await response.json()
      scientist.value = data.scientist
      analytics.value = data.analytics
      citationSeries.value = data.citationSeries
      topicDistribution.value = data.topicDistribution
      collaborators.value = data.collaborators
      publications.value = data.publications
    } catch (err) {
      error.value = err.message || 'Произошла ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  const years = computed(() =>
    Array.from(new Set(publications.value.map((publication) => publication.year))).sort(
      (a, b) => b - a
    )
  )

  const sortPublications = (key = 'citations', year = 'all') => {
    let filtered = [...publications.value]

    if (year !== 'all') {
      filtered = filtered.filter((publication) => publication.year === Number(year))
    }

    return filtered.sort((a, b) => {
      if (key === 'title') {
        return a.title.localeCompare(b.title)
      }

      return b[key] - a[key]
    })
  }

  return {
    scientist,
    analytics,
    citationSeries,
    topicDistribution,
    collaborators,
    publications,
    loading,
    error,
    years,
    fetchAuthorProfile,
    sortPublications
  }
})




