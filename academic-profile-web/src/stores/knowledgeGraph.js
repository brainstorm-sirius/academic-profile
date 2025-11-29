import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useProfileStore } from './profile'

export const useKnowledgeGraphStore = defineStore('knowledgeGraph', () => {
  const profileStore = useProfileStore()
  
  const graphData = ref({
    nodes: [],
    edges: []
  })
  const loading = ref(false)
  const error = ref(null)

  const fetchGraphData = async () => {
    loading.value = true
    error.value = null

    try {
      // Предполагаем, что backend предоставляет endpoint /knowledge-graph
      // который возвращает данные в формате:
      // {
      //   interests: [{ id, name, scientist_count }],
      //   scientists: [{ id, name, interests: [interest_id] }]
      // }
      
      const token = profileStore.token
      const headers = {
        'Content-Type': 'application/json'
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // Добавляем таймаут для fetch
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 999999) // 5 секунд таймаут

      let response
      try {
        response = await fetch('http://academic.khokhlovkirill.ru:8000/knowledge-graph', {
          method: 'GET',
          headers: headers,
          signal: controller.signal
        })
        clearTimeout(timeoutId)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        // Если это ошибка сети, CORS или таймаут, генерируем тестовые данные
        if (fetchError.name === 'AbortError') {
          throw new Error('Превышено время ожидания ответа от сервера')
        }
        throw new Error('Не удалось подключиться к серверу. Используются тестовые данные.')
      }

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`)
      }

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        throw new Error('Неверный формат данных от сервера')
      }
      
      // Преобразуем данные в формат для vis-network
      const nodes = []
      const edges = []
      
      // Добавляем узлы для областей интересов (крупные вершины)
      if (data.interests && Array.isArray(data.interests)) {
        data.interests.forEach(interest => {
          nodes.push({
            id: `interest_${interest.id}`,
            label: interest.name,
            group: 'interest',
            size: 30 + (interest.scientist_count || 0) * 2, // Размер зависит от количества ученых
            color: {
              background: '#5BC0F8',
              border: '#142850',
              highlight: {
                background: '#F2A541',
                border: '#142850'
              }
            },
            font: {
              size: 16,
              color: '#142850',
              face: 'Arial'
            },
            shape: 'box',
            value: interest.scientist_count || 0
          })
        })
      }
      
      // Добавляем узлы для ученых (мелкие вершины)
      if (data.scientists && Array.isArray(data.scientists)) {
        data.scientists.forEach(scientist => {
          nodes.push({
            id: `scientist_${scientist.id}`,
            label: scientist.name || scientist.username || `Scientist ${scientist.id}`,
            group: 'scientist',
            size: 15,
            color: {
              background: '#7C3AED',
              border: '#5BC0F8',
              highlight: {
                background: '#F2A541',
                border: '#142850'
              }
            },
            font: {
              size: 12,
              color: '#142850',
              face: 'Arial'
            },
            shape: 'dot',
            title: scientist.name || scientist.username || `Scientist ${scientist.id}`
          })
          
          // Добавляем ребра от ученого к его областям интересов
          if (scientist.interests && Array.isArray(scientist.interests)) {
            scientist.interests.forEach(interestId => {
              edges.push({
                from: `scientist_${scientist.id}`,
                to: `interest_${interestId}`,
                color: {
                  color: '#A5B4FC',
                  highlight: '#F2A541'
                },
                width: 2,
                smooth: {
                  type: 'continuous',
                  roundness: 0.5
                }
              })
            })
          }
        })
      }
      
      // Проверяем, что данные не пустые
      if (nodes.length === 0 && edges.length === 0) {
        throw new Error('Сервер вернул пустые данные')
      }
      
      graphData.value = { nodes, edges }
      error.value = null // Очищаем ошибку при успешной загрузке
    } catch (err) {
      const errorMessage = err.message || 'Произошла ошибка загрузки графа знаний'
      error.value = errorMessage
      console.warn('Error fetching knowledge graph, using mock data:', err)
      
      // В случае любой ошибки создаем тестовые данные для демонстрации
      try {
        const mockData = generateMockData()
        console.log('Generated mock data:', mockData)
        
        // Убеждаемся, что тестовые данные действительно сгенерированы
        if (mockData && mockData.nodes && mockData.nodes.length > 0) {
          graphData.value = mockData
          console.log('Mock data set successfully, nodes:', mockData.nodes.length, 'edges:', mockData.edges.length)
        } else {
          console.error('Failed to generate mock data - empty result')
          error.value = 'Не удалось загрузить данные и сгенерировать тестовые данные'
          // Устанавливаем пустые данные, чтобы избежать ошибок
          graphData.value = { nodes: [], edges: [] }
        }
      } catch (mockError) {
        console.error('Error generating mock data:', mockError)
        error.value = 'Критическая ошибка: не удалось сгенерировать тестовые данные'
        graphData.value = { nodes: [], edges: [] }
      }
    } finally {
      loading.value = false
    }
  }

  // Функция для генерации тестовых данных (если API недоступен)
  const generateMockData = () => {
    const interests = [
      { id: 1, name: 'Machine Learning', scientist_count: 15 },
      { id: 2, name: 'Bioinformatics', scientist_count: 12 },
      { id: 3, name: 'Climate Science', scientist_count: 10 },
      { id: 4, name: 'Quantum Computing', scientist_count: 8 },
      { id: 5, name: 'Neuroscience', scientist_count: 9 }
    ]
    
    const scientists = [
      { id: 1, name: 'Egor Petryaev', interests: [1, 2] },
      { id: 2, name: 'Anna Krylova', interests: [1, 3] },
      { id: 3, name: 'Sergey Efimov', interests: [2, 3] },
      { id: 4, name: 'Mark Panov', interests: [1, 4] },
      { id: 5, name: 'Victoria Li', interests: [4, 5] },
      { id: 6, name: 'Irina Plotnikova', interests: [2, 5] },
      { id: 7, name: 'Alex Ivanov', interests: [1, 2, 3] },
      { id: 8, name: 'Maria Petrova', interests: [3, 4] }
    ]
    
    const nodes = []
    const edges = []
    
    interests.forEach(interest => {
      nodes.push({
        id: `interest_${interest.id}`,
        label: interest.name,
        group: 'interest',
        size: 30 + interest.scientist_count * 2,
        color: {
          background: '#5BC0F8',
          border: '#142850',
          highlight: {
            background: '#F2A541',
            border: '#142850'
          }
        },
        font: {
          size: 16,
          color: '#142850',
          face: 'Arial'
        },
        shape: 'box',
        value: interest.scientist_count
      })
    })
    
    scientists.forEach(scientist => {
      nodes.push({
        id: `scientist_${scientist.id}`,
        label: scientist.name,
        group: 'scientist',
        size: 15,
        color: {
          background: '#7C3AED',
          border: '#5BC0F8',
          highlight: {
            background: '#F2A541',
            border: '#142850'
          }
        },
        font: {
          size: 12,
          color: '#142850',
          face: 'Arial'
        },
        shape: 'dot',
        title: scientist.name
      })
      
      scientist.interests.forEach(interestId => {
        edges.push({
          from: `scientist_${scientist.id}`,
          to: `interest_${interestId}`,
          color: {
            color: '#A5B4FC',
            highlight: '#F2A541'
          },
          width: 2,
          smooth: {
            type: 'continuous',
            roundness: 0.5
          }
        })
      })
    })
    
    return { nodes, edges }
  }

  return {
    graphData,
    loading,
    error,
    fetchGraphData
  }
})

