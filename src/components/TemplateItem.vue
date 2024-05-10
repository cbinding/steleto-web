<script setup>
import { computed } from 'vue'
import { useTemplateStore } from "@/stores/TemplateStore"

const store = useTemplateStore()
const selectedItem = computed(() => store.getItem(store.selectedID))
const updated = () => selectedItem.value.meta.updated = new Date().toISOString()
</script>

<template>
    <div class="template-item">
        <h3>Template Item</h3>
        <label for="created">Created:</label><br>
        <input disabled
          id="created"  
          v-model="((selectedItem || {}).meta || {}).created" 
          placeholder="(created timestamp)"/>
        <br>
        <label for="updated">Updated:</label><br>
        <input disabled
          id="updated"  
          v-model="((selectedItem || {}).meta || {}).updated" 
          placeholder="(updated timestamp)"/>
        <br>
        <label for="creator">Creator:</label><br>
        <input 
          :disabled="store.selectedID == ''"
          id="creator" 
          v-model="((selectedItem || {}).meta || {}).creator" 
          @input="updated" 
          placeholder="(template creator)"/>
        <br>
        <label for="title">Title:</label><br>
        <input 
          :disabled="store.selectedID == ''"
          id="title" 
          v-model="((selectedItem || {}).meta || {}).title" 
          @input="updated" 
          placeholder="(template title)"/>
        <br>
        <label for="description">Description:</label><br>
        <textarea 
          :disabled="store.selectedID == ''"
          id="description" 
          v-model="((selectedItem || {}).meta || {}).description" 
          @input="updated" 
          placeholder="(template description)"></textarea>
        <br>
        <label for="content">Content:</label><br>
        <textarea 
          :disabled="store.selectedID == ''"
          id="content" 
          v-model="(selectedItem || {}).content" 
          @input="updated" 
          placeholder="(template content)"></textarea>       
    </div>
</template>

<style scoped>
.template-item {
  border: 1px solid lightgray;
  width: 60%;
  padding: 10px;
  margin: 2px;
}
input, textarea {
  width: 100%;
}
input:hover, textarea:hover {
  background-color: ghostwhite;
}
textarea { 
  height: 6em;
}
</style>