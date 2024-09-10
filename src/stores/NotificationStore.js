import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notificationStore', () => {
  const notifications = ref([])
  //const enabled = ref(true)
  
  const items = computed(() => notifications.value)
  const count = computed(() => notifications.value.length)

  const add = (message) => {
    const item = {
      timestamp: new Date().toISOString(),
      message: message,
      // type: notificationType // todo (Enum)??
    }
    notifications.value.push(item)
  }

  // using .splice to ensure vue sees the change
  const clear = () => notifications.value.splice(0)
  
  return { items, count, add, clear }
})
