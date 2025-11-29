import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'
import './style.css'
import { useProfileStore } from './stores/profile'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Проверяем авторизацию при загрузке приложения
const profileStore = useProfileStore()
profileStore.checkAuth()

app.mount('#app')
