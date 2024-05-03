<script setup>
import { ref, onMounted } from 'vue'
defineProps({})

const templateList = ref([])
const templateName = ref("")

onMounted(() => {
  getListFromLocalStorage()
})

const addToList = () => {
  const newValue = (templateName.value || "").trim()
  if (newValue !== "") {
    templateList.value.push(templateName.value)
    saveListToLocalStorage()
  } 
}
const removeFromList = () => {
  const index = templateList.value.indexOf(templateName.value);
  if (index > -1) { // only splice array when item is found
    templateList.value.splice(index, 1); // 2nd parameter means remove one item only 
    saveListToLocalStorage()   
  }
}

const saveListToLocalStorage = () => {
  localStorage.setItem("steleto.templates", JSON.stringify(templateList.value))
}

const getListFromLocalStorage = () => {
  //templateList.value = JSON.parse(localStorage.getItem("steleto.templates"))
}



</script>

<template>
  <div>(StoredTemplateList component)</div>
  <input v-model="templateName" placeholder="template name"/>
  <button @click="addToList">Add to list</button>
  <button @click="removeFromList">Remove from list</button>
  <ul><li v-for="(item, index) in templateList" :key="index">{{ item }}</li></ul>
</template>

<style scoped>
    

</style>