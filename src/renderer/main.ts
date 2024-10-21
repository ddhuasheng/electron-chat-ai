import { createApp } from 'vue'
import App from './App.vue'
import pinia from '@/store'
import '@/assets/style/tailwind.less'
import '@/assets/style/theme.less'

const app = createApp(App)

app.use(pinia)

app.mount('#app')
