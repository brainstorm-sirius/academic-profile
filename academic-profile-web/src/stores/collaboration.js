import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useProfileStore } from './profile'
const profileStore = useProfileStore()

export const useCollaborationStore = defineStore('collaboration', () => {
  const recommendations = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchResults = ref([])
  const searchLoading = ref(false)
  const searchError = ref(null)

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

  const searchUsers = async (name, limit = 10) => {
    searchLoading.value = true
    searchError.value = null

    try {
      if (!name || name.length < 2) {
        searchResults.value = []
        return
      }

      const queryParams = new URLSearchParams({
        name: name,
        limit: limit.toString()
      })

      const response = await fetch(`http://academic.khokhlovkirill.ru:8000/search/authors?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Error occurred during the search.')
      }

      const data = await response.json()
      // API может возвращать массив напрямую или объект с массивом
      let authors = []
      if (Array.isArray(data)) {
        authors = data
      } else if (data.results && Array.isArray(data.results)) {
        authors = data.results
      } else if (data.authors && Array.isArray(data.authors)) {
        authors = data.authors
      } else if (data.users && Array.isArray(data.users)) {
        authors = data.users
      }
      
      // Преобразуем данные в формат, совместимый с компонентами отображения
      searchResults.value = authors.map(author => {
        // Определяем полное имя автора
        let fullName = 'Unknown Author'
        if (author.author_name) {
          fullName = author.author_name
        } else if (author.name) {
          fullName = author.name
        } else if (author.first_name || author.last_name) {
          const firstName = author.first_name || ''
          const lastName = author.last_name || ''
          fullName = `${firstName} ${lastName}`.trim() || 'Unknown Author'
        }
        
        // Возвращаем данные в унифицированном формате
        return {
          author_id: author.author_id || author.id || null,
          id: author.id || author.author_id || null,
          author_name: fullName,
          name: fullName,
          first_name: author.first_name || null,
          last_name: author.last_name || null,
          main_interest: author.main_interest || author.interest || null,
          interest: author.interest || author.main_interest || null,
          total_score: author.total_score || null,
          similarity_score: author.similarity_score || null,
          productivity_score: author.productivity_score || null,
          diversity_score: author.diversity_score || null,
          articles_count: author.articles_count || author.publications_count || null,
          interests_count: author.interests_count || null,
          // Сохраняем оригинальные данные для совместимости
          ...author
        }
      })
    } catch (err) {
      searchError.value = err.message || 'Search error'
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }

  return {
    recommendations,
    loading,
    error,
    searchResults,
    searchLoading,
    searchError,
    fetchRecommendations,
    searchUsers
  }
})

