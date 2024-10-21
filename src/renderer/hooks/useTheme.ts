import { ref } from 'vue'

export const useTheme = () => {
 

    const isDark = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    const system = () => {
        window.darkMode.system()
        setTheme()
    }

    const toggle = () => {
        window.darkMode.toggle()
        setTheme()
    }

    const getTheme = () => {
        return isDark() ? 'dark' : 'light'
    }

    const setTheme = () => {
        theme.value = getTheme()
    }

    const theme = ref(getTheme())

    return {
        theme,
        system,
        toggle
    }
}