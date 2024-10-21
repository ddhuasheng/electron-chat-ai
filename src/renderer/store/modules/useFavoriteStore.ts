import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFavoriteStore = defineStore('favorite', () => {
  const isActiveFavorite = ref(false)

  const setActiveFavorite = (value: boolean) => {
    isActiveFavorite.value = value
  }

  return {
    isActiveFavorite,
    setActiveFavorite
  }
}, {
  cache: false
})