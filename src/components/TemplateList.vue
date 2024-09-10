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
      class="btn btn-sm btn-outline-primary" 
      :alt="$t('new')" 
      :title="$t('new')" 
      @click="newItem()">&#10133; {{ $t('new') }}</button>
    <br>
    <ul class="list-group overflow-y-scroll template-list">
      <li v-for="item in store.templates" 
        :key="item.id" @click="selItem(item.id)" 
        class="list-group-item-action"
        :aria-current="item.id == store.selectedID"
        :disabled="item.id == store.selectedID">
        <span>{{ item.meta?.title }}</span>
        <button 
          class="btn btn-sm btn-outline-primary float-end" 
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
      border: 1px solid lightgray;
      overflow-y: scroll;      
      height: 10em;
    }
    .template-list li {
      cursor: pointer;      
    }
    .template-list1 li:hover {
      background-color: lightgray;
    }
    .template-list1 li.selected {
      background-color: lightsteelblue;
    }
    .delete-item {
      float: right;      
    }   
    
</style>