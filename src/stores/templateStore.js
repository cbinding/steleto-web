import { ref, computed } from 'vue'
import { createPinia, defineStore } from 'pinia'
//import { createPersistPlugin } from 'pinia-plugin-persist' 
// https://www.sciredev.com/blog/how-to-use-pinia-with-vue-3-a-step-by-step-guide
const pinia = createPinia()
//pinia.use(createPersistPlugin())
pinia.use()

export const useTemplateStore = defineStore('templateStore', () => {
  const items = ref([])
  const templateItems = computed(() => items.value)
  const counter = computed(() => items.value.length)

  function newItem() { 
    const timestamp = new Date().toISOString()
    return {
      meta: {
        created: timestamp,
        updated: timestamp,
        creator: "(creator)",
        title: `(title) ${timestamp}`,
        description: "(description)"
      },
      content: "(content)"
    }
  }

  function getItem(id) {
    const item = items.value.find((obj) => obj.id === id)
    return item
  }

  function addItem(item) {
    // TODO: check if it exists first
    items.value.push({ item, id: new Date().toISOString() })    
  }

  function delItem(id) {
    items.value = items.value.filter((object) => {
      return object.id !== id
    })
  }

  return { templateItems, counter, newItem, getItem, addItem, delItem }
})
