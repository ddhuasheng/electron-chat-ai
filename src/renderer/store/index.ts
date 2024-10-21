import { createPinia } from 'pinia'
import { LongPinia } from '@/plugins'

const pinia = createPinia()
pinia.use(LongPinia({
  storage: localStorage,
}))

export default pinia
export * from './modules'