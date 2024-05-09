<script setup>
import { useTemplateStore } from "@/stores/TemplateStore";
//import { storeToRefs } from "pinia";

const store = useTemplateStore();
//const { templates } = storeToRefs(store);

const newItem = () => {
  const item = store.newItem()
  //console.log(`creating ${item.id}`)
  store.addItem(item)
}

const selItem = (id) => {  
  store.selItem(id)
}

const delItem = (id) => { 
  const item = store.getItem(id)
  if (item) {
    if (confirm(`Delete "${item?.meta?.title}" - sure?`) == true) {
      //console.log(`deleting ${id}`)
      store.delItem(id)
    }
  }
}
</script>

<template>
  <br>
  <div>
    <div>(TemplateList)</div>
    <button @click="newItem()">Create new item</button>
    <ul class="template-list">
      <li v-for="item in store.templates" :key="item.id" @click="selItem(item.id)">
        <span>{{ item.meta?.title }}</span>
        <button class="delete-item" alt="delete" title="delete" @click="delItem(item.id)">&#x2718;</button>
      </li>
    </ul>
    <div>{{ store.count }} items</div>    
  </div>
</template>

<style scoped>
    .template-list {
      margin:5px;
      padding: 5px;
      list-style-type: none;
      border: 1px solid lightgray;
      overflow-y: scroll;
      width: 30em;
      height: 10em;
    }
    .template-list li {
      cursor: pointer;
      padding: 2px;
    }
    .template-list li:hover {
      background-color: lightgray;
    }
    .delete-item {
      cursor: pointer;
      border: 1px solid gray;
      float: right;      
    }
    .delete-item:hover {
      background-color: lightgray;
    }
</style>