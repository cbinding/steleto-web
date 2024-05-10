<script setup>
import { useTemplateStore } from "@/stores/TemplateStore";
//import { storeToRefs } from "pinia";

const store = useTemplateStore();
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
  if (item) {
    if (confirm(`Delete "${item?.meta?.title}" - sure?`) == true) {
      store.delItem(id)
    }
  }
}
</script>

<template>
  <br>
  <div class="template-list-outer">
    <h3>Template List</h3>
    <button alt="create new template item" title="create new template item" @click="newItem()">&#10133; Create new</button><br>
    <ul class="template-list">
      <li v-for="item in store.templates" :key="item.id" @click="selItem(item.id)" :class="item.id == store.selectedID ? 'selected': ''">
        <span>{{ item.meta?.title }}</span>
        <button class="delete-item" alt="delete" title="delete" @click="delItem(item.id)">&#10060;</button>
      </li>
    </ul>
    <div>({{ store.count }} items)</div>    
  </div>
</template>

<style scoped>
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