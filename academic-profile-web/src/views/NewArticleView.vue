<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import MobileMenu from '@/components/profile/MobileMenu.vue'

const router = useRouter()
const profileStore = useProfileStore()

const selectedFile = ref(null)
const isUploading = ref(false)
const uploadError = ref(null)
const uploadSuccess = ref(false)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv'
    ]
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (validTypes.includes(file.type) || validExtensions.includes(fileExtension)) {
      selectedFile.value = file
      uploadError.value = null
    } else {
      uploadError.value = 'Please select a valid CSV or XLSX file'
      selectedFile.value = null
    }
  }
}

const downloadTemplate = () => {
  const link = document.createElement('a')
  link.href = '/template.xlsx'
  link.download = 'article-template.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleSubmit = async () => {
  if (!selectedFile.value) {
    uploadError.value = 'Please select a file to upload'
    return
  }

  isUploading.value = true
  uploadError.value = null
  uploadSuccess.value = false

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const token = profileStore.token || localStorage.getItem('auth_token')
    
    const response = await fetch(`http://academic.khokhlovkirill.ru:8000/users/${profileStore.scientist.id}/publications/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }))
      throw new Error(errorData.detail || `Upload failed with status ${response.status}`)
    }

    uploadSuccess.value = true
    selectedFile.value = null
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) {
      fileInput.value = ''
    }

    // Redirect to profile after 2 seconds
    setTimeout(() => {
      router.push('/profile')
    }, 2000)
  } catch (err) {
    uploadError.value = err.message || 'An error occurred while uploading the file'
    uploadSuccess.value = false
  } finally {
    isUploading.value = false
  }
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
        <h1 class="text-3xl font-bold text-primary-dark">Add new article</h1>
      </header>

      <div class="max-w-2xl space-y-6">
        <!-- Template Download Section -->
        <div class="rounded-2xl bg-white p-6 shadow-card">
          <h2 class="mb-4 text-lg font-semibold text-primary-dark">Download template</h2>
          <p class="mb-4 text-sm text-muted">
            Before uploading your article data, please download the XLSX template file to ensure your data is formatted correctly.
          </p>
          <button
            @click="downloadTemplate"
            class="rounded-xl bg-secondary px-6 py-2 text-sm font-semibold text-primary transition hover:bg-secondary/80"
          >
            Download XLSX Template
          </button>
        </div>

        <!-- File Upload Form -->
        <div class="rounded-2xl bg-white p-6 shadow-card">
          <h2 class="mb-4 text-lg font-semibold text-primary-dark">Upload article data</h2>
          <p class="mb-4 text-sm text-muted">
            Select a CSV or XLSX file containing your article data to upload.
          </p>

          <div class="space-y-4">
            <div>
              <label
                for="file-input"
                class="mb-2 block text-sm font-medium text-primary-dark"
              >
                Select File
              </label>
              <input
                id="file-input"
                type="file"
                accept=".csv,.xlsx,.xls"
                @change="handleFileSelect"
                class="block w-full text-sm text-muted file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-dark"
              />
            </div>

            <div v-if="selectedFile" class="rounded-xl bg-surface p-4">
              <p class="text-sm font-medium text-primary-dark">
                Selected file: <span class="font-semibold">{{ selectedFile.name }}</span>
              </p>
              <p class="mt-1 text-xs text-muted">
                Size: {{ (selectedFile.size / 1024).toFixed(2) }} KB
              </p>
            </div>

            <div v-if="uploadError" class="rounded-xl bg-red-50 p-4">
              <p class="text-sm font-medium text-red-600">Error: {{ uploadError }}</p>
            </div>

            <div v-if="uploadSuccess" class="rounded-xl bg-green-50 p-4">
              <p class="text-sm font-medium text-green-600">
                Article uploaded successfully! Redirecting to dashboard...
              </p>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                @click="handleSubmit"
                :disabled="!selectedFile || isUploading"
                class="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isUploading ? 'Uploading...' : 'Upload Article' }}
              </button>
              <button
                @click="handleCancel"
                :disabled="isUploading"
                class="rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-primary-dark transition hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

