import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// TODO: individual field edits are not getting saved to local storage
export const useTemplateStore = defineStore('templateStore', () => {
  const LOCALSTORAGEKEY = 'steletoweb.templates'
  const items = ref(JSON.parse(localStorage.getItem(LOCALSTORAGEKEY) || "[]"))  
  const selectedID = ref(localStorage.getItem("selectedID") || "")  
  const templates = computed(() => items.value)
  const count = computed(() => items.value.length)

  const newItem = () => { 
    const timestamp = new Date().toISOString()
    return {
      id: timestamp,
      meta: {
        created: timestamp,
        updated: timestamp,
        creator: "steleto-web",
        title: `new template (${timestamp})`,
        description: ""
      },
      content: ""
    }
  }

  const exists = (id) => items.value.some((item) => item.id === id)
  
  const getItem = (id) => items.value.find((item) => item.id === id)    
 
  const addItem = (item) => {
    delItem(item?.id)
    items.value.push(item) 
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(items.value))
  }

  const delItem = (id) => {
    if (exists(id)) {      
      items.value = items.value.filter((item) => { return item.id !== id })
      localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(items.value))
      if (selectedID.value == id) {
        selectedID.value = ""
        localStorage.setItem("selectedID", "")
      }      
    }
  }  

  const selItem = (id) => {
    if (exists(id)) {
      selectedID.value = id
      localStorage.setItem('selectedID', selectedID.value)
    }
  }
  
  return {
    templates,
    count,
    exists,
    newItem,
    getItem,
    addItem,
    delItem,
    selItem,
    selectedID
  }
})
