import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export const useTemplateStore = defineStore('templateStore', () => {
  const LOCALSTORAGEKEY = 'steletoweb.templates'
  const items = ref(JSON.parse(localStorage.getItem(LOCALSTORAGEKEY) || "[]"))  
  const selectedID = ref("")  
  const templates = computed(() => items.value)
  const count = computed(() => templates.value.length)

  function newItem() { 
    const timestamp = new Date().toISOString()
    return {
      id: timestamp,
      meta: {
        created: timestamp,
        updated: timestamp,
        creator: "(steleto)",
        title: `(new item) ${timestamp}`,
        description: "(description)"
      },
      data: "(data)"
    }
  }

  function getItem(id) {
    return items.value.find((item) => item.id === id)    
  }

  function addItem(item) {
    // TODO: check if it exists first
    items.value.push(item) 
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(items.value))
  }

  function delItem(id) {
    items.value = items.value.filter((item) => { return item.id !== id })
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(items.value))
  }  

  function selItem(id) {
    selectedID.value = id
    //console.log(`selected '${selectedID.value}'`)    
  }
  
  return { templates, count, newItem, getItem, addItem, delItem, selItem, selectedID }
})
