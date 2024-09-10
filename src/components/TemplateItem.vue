<script setup>
import { computed } from 'vue'
import { useTemplateStore } from "@/stores/TemplateStore"
import { useI18n } from "vue-i18n"

const { t, locale, fallbackLocale }  = useI18n()
const store = useTemplateStore()
const selectedItem = computed(() => store.getItem(store.selectedID))
// TODO: when item is edited (timespan changes), save to local storage
const updateTimestamp = () => selectedItem.value.meta.updated = new Date().toISOString()
const ISODateTimeTolocaleDateTime = (isoDateTime) => { 
  const d = new Date(isoDateTime)
  //return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
  const options = {
    //dateStyle: 'full',
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    //timeZone: "America/Los_Angeles",
  }
  return new Intl.DateTimeFormat([locale.value, fallbackLocale.value], options).format(d)
}
const created = computed(() => ISODateTimeTolocaleDateTime(selectedItem.value.meta?.created))
const updated = computed(() => ISODateTimeTolocaleDateTime(selectedItem.value.meta?.updated))
</script>

<template>    
    <form class="template-item">
        <h3 class="capitalized">{{ $t('template') }}</h3>
        
        <div class="mb-3">
          <label for="title" class="form-label capitalized">{{ $t('title') }}</label>
          <input 
            class="form-control" 
            :disabled="!selectedItem"
            id="title" 
            v-model="((selectedItem || {}).meta || {}).title" 
            @input="updateTimestamp" 
            :placeholder='`(${ t("title") })`'/>
        </div>

        <div class="mb-3">
          <label for="description"  class="form-label capitalized">{{ $t('description') }}</label>
          <textarea 
            class="form-control" 
            :disabled="!selectedItem"
            id="description" 
            v-model="((selectedItem || {}).meta || {}).description" 
            @input="updateTimestamp" 
            :placeholder='`(${ t("description") })`'></textarea>    
        </div>

        <div class="mb-3">
          <label for="creator"  class="form-label capitalized">{{ $t('creator') }}</label><br>
          <input 
            class="form-control" 
            :disabled="!selectedItem"
            id="creator" 
            v-model="((selectedItem || {}).meta || {}).creator" 
            @input="updateTimestamp" 
            :placeholder='`(${ t("creator") })`'/>
        </div>

        <div class="mb-3">
          <label for="created" class="form-label capitalized">{{ $t('created') }}</label>
          <input 
            class="form-control" 
            disabled
            id="created" 
            :value="created"/>
        </div>

        <div class="mb-3">
          <label for="updated"  class="form-label capitalized">{{ $t('updated') }}</label><br>
          <input 
            class="form-control" 
            disabled
            id="updated" 
            :value="updated"/>
        </div>

        <div class="mb-3">
          <label for="content"  class="form-label capitalized">{{ $t('content') }}</label><br>
          <textarea 
            class="form-control" 
            :disabled="!selectedItem"
            id="content" 
            v-model="(selectedItem || {}).content" 
            @input="updateTimestamp" 
            :placeholder='`(${ t("content") })`'></textarea>
        </div>      
    </form>
</template>

<style scoped>
.capitalized {text-transform: capitalize; }
.template-item {
  border: 1px solid lightgray;
  width: 60%;
  padding: 10px;
}
input:hover:enabled, textarea:hover:enabled {
  background-color: ghostwhite;
}
</style>