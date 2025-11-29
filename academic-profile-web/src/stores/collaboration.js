import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useProfileStore } from './profile'
const profileStore = useProfileStore()

export const useCollaborationStore = defineStore('collaboration', () => {
  const recommendations = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchRecommendations = async (params) => {
    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams({
        count: params.count || '10',
        filter: params.filter || 'interests',
        ...(params.filterValue && { filterValue: params.filterValue })
      })

      const interestsFull = profileStore.topicDistribution
      const interests = []
      for (const item of interestsFull) {
        interests.push(item.label)
      }

      const publicationsFull = profileStore.publications
      const publications = []
      for (const item of publicationsFull) {
        publications.push(item.title)
      }

      const response = await fetch(`http://academic.khokhlovkirill.ru:8000/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          interests: interests,
          publications: publications,
          num_recommendations: params.count || '10'
      })})

      if (!response.ok) {
        throw new Error('Error occured during the loading.')
      }

      const data = await response.json()
      const allRecommendations = data.recommendations || []
      const count = parseInt(params.count || '10', 10)
      recommendations.value = allRecommendations.slice(0, count)
    } catch (err) {
      error.value = err.message || 'Download error'
      recommendations.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations
  }
})

