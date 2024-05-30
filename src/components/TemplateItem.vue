<script setup>
import { computed } from 'vue'
import { useTemplateStore } from "@/stores/TemplateStore"
import { useI18n } from "vue-i18n";
//import { storeToRefs } from "pinia";

const { t }  = useI18n()

const store = useTemplateStore()
const selectedItem = computed(() => store.getItem(store.selectedID))
const updateTimestamp = () => selectedItem.value.meta.updated = new Date().toISOString()
</script>

<template>
    <div class="template-item">
        <h3 class="capitalized">{{ $t('template') }}</h3>
        <label for="created" class="capitalized">{{ $t('created') }}:</label><br>
        <input disabled
          id="created"  
          v-model="((selectedItem || {}).meta || {}).created"/>
        <br>
        <label for="updated"  class="capitalized">{{ $t('updated') }}:</label><br>
        <input disabled
          id="updated"  
          v-model="((selectedItem || {}).meta || {}).updated"/>
        <br>
        <label for="creator"  class="capitalized">{{ $t('creator') }}:</label><br>
        <input 
          :disabled="!selectedItem"
          id="creator" 
          v-model="((selectedItem || {}).meta || {}).creator" 
          @input="updateTimestamp" 
          :placeholder='`(${ t("creator") })`'/>
        <br>
        <label for="title"  class="capitalized">{{ $t('title') }}:</label><br>
        <input 
          :disabled="!selectedItem"
          id="title" 
          v-model="((selectedItem || {}).meta || {}).title" 
          @input="updateTimestamp" 
          :placeholder='`(${ t("title") })`'/>
        <br>
        <label for="description"  class="capitalized">{{ $t('description') }}:</label><br>
        <textarea 
          :disabled="!selectedItem"
          id="description" 
          v-model="((selectedItem || {}).meta || {}).description" 
          @input="updateTimestamp" 
          :placeholder='`(${ t("description") })`'></textarea>    
        <br>
        <label for="content"  class="capitalized">{{ $t('content') }}:</label><br>
        <textarea 
          :disabled="!selectedItem"
          id="content" 
          v-model="(selectedItem || {}).content" 
          @input="updateTimestamp" 
          :placeholder='`(${ t("content") })`'></textarea>      
    </div>
</template>

<style scoped>
.capitalized {text-transform: capitalize; }
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