import { ref } from 'vue'

export function useRefreshable(func: () => Promise<void>) {
    const refreshing = ref(false)
    const refresh = () => {
        if (!refreshing.value) {
            refreshing.value = true
            return func().finally(() => {
                refreshing.value = false
            })
        }
    }
    return {
        refresh, refreshing
    }
}