<script setup>
import { useTemplateStore } from "@/stores/TemplateStore";
import { useI18n } from "vue-i18n";
//import { storeToRefs } from "pinia";

const store = useTemplateStore();
const { t }  = useI18n();
//const { templates } = storeToRefs(store);

const newItem = () => {
  const item = store.newItem()
  store.addItem(item)
  store.selItem(item.id)
}

const selItem = (id) => {  
  store.selItem(id)
}

const delItem = (id) => { 
  const item = store.getItem(id)
  const msg = t("confirmDelete", { id: id })
  if (item) {
    if (confirm(`${ msg }`) == true) {
      store.delItem(id)
    }
  }
}
</script>

<template>
  <br>
  <div class="template-list-outer">
    <h3 class="capitalized">{{ $t('template', 2) }}</h3>
    <button 
      class="new-item" 
      :alt="$t('new')" 
      :title="$t('new')" 
      @click="newItem()">&#10133; {{ $t('new') }}</button>
    <br>
    <ul class="template-list">
      <li v-for="item in store.templates" 
        :key="item.id" @click="selItem(item.id)" 
        :class="item.id == store.selectedID ? 'selected': ''">
        <span>{{ item.meta?.title }}</span>
        <button 
          class="delete-item" 
          :alt="$t('delete')" 
          :title="$t('delete')" 
          @click="delItem(item.id)">&#10060;</button>
      </li>
    </ul>
    <div>({{ store.count }} {{ store.count ==  1 ?  $t('item') : $t('item', 2) }})</div>
  </div>
</template>

<style scoped>
    .capitalized {text-transform:capitalize; }
    .template-list-outer {
      border: 1px solid lightgray;
      width: 60%;
      padding: 5px;
      margin: 2px;
    }
    .template-list {
      margin:5px;
      padding: 5px;
      list-style-type: none;
      border: 1px solid lightgray;
      overflow-y: scroll;
      
      height: 10em;
    }
    .template-list li {
      cursor: pointer;
      padding: 2px;
    }
    .template-list li:hover {
      background-color: lightgray;
    }
    .template-list li.selected {
      background-color: lightsteelblue;
    }
    .delete-item {
      cursor: pointer;
      border: 1px solid gray;
      float: right;      
    }
    .delete-item:hover {
      background-color: lightgray;
    }
    button {
      border-radius: 5px;
      cursor: pointer;
    }
</style>