import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useProfileStore } from './profile'

export const useInterestsStore = defineStore('interests', () => {
  const predefinedInterests = ref([
    'Molecular Biology',
    'Genetics',
    'Genomics',
    'Proteomics',
    'Bioinformatics',
    'Cell Biology',
    'Stem Cells',
    'Cancer Research',
    'Immunology',
    'Virology',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Surgery',
    'Radiology',
    'Biochemistry',
    'Biophysics',
    'Structural Biology',
    'Developmental Biology',
    'Evolutionary Biology',
    'Machine Learning',
    'Data Science',
    'Statistical Analysis',
    'Computational Biology',
    'Public Health',
    'Epidemiology',
    'Global Health',
    'Pharmacology',
    'Drug Discovery',
    'Toxicology',
    'Clinical Research',
    'Basic Research',
    'Translational Research',
    'Interdisciplinary Studies'
  ])

  const profileStore = useProfileStore()

  const selectedInterests = ref([])

  const addInterest = (interest) => {
    if (!selectedInterests.value.includes(interest) && selectedInterests.value.length < 10) {
      selectedInterests.value.push(interest)
    }
  }

  const removeInterest = (interest) => {
    const index = selectedInterests.value.indexOf(interest)
    if (index > -1) {
      selectedInterests.value.splice(index, 1)
    }
  }

  const toggleInterest = (interest) => {
    if (selectedInterests.value.includes(interest)) {
      removeInterest(interest)
    } else {
      addInterest(interest)
    }
  }

  const saveInterests = () => {
    // Here you would typically save to backend
    // For now, we'll just keep it in the store
    // topicDistribution in profileStore will automatically update via computed
    console.log('Saving interests:', selectedInterests.value)
    fetch('http://academic.khokhlovkirill.ru:8000/users/interests', {  
      method: 'PUT',  
      headers: {  
          'Content-Type': 'application/json',  
      },  
      body: JSON.stringify({  
          login: profileStore.scientist.username,  
          interests_list: selectedInterests.value
      })  
  })  
  }

  return {
    predefinedInterests,
    selectedInterests,
    addInterest,
    removeInterest,
    toggleInterest,
    saveInterests
  }
})

