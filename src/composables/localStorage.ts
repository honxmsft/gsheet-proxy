import { onMounted, ref, watch, Ref } from 'vue'
export function useLocalStorage<T>(name: string, defaultFac: () => T, serialize: (data: T) => string, deserialize: (s: string) => T) {
    const data: Ref<T> = ref(defaultFac() as any)

    onMounted(() => {
        const val = localStorage.getItem(name)
        if (val) {
            try {
                data.value = deserialize(val)
            } catch (e) {
                data.value = defaultFac()
            }
        } else {
            data.value = defaultFac()
        }
    })

    watch(data, (newVal) => {
        localStorage.setItem(name, serialize(newVal))
    })

    return data
}