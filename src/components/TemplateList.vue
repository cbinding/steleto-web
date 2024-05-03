<script setup>
import { useTemplateStore } from "@/stores/templateStore";
import { storeToRefs } from "pinia";

const store = useTemplateStore();
const { templateItems } = storeToRefs(store);

const newItem = () => {
  const item = store.newItem()
  console.log(item)  
  store.addItem(item)
}
const delItem = (id) => { 
  store.delItem(id)
}
</script>

<template>
  <div>(TemplateList component)</div>
  <div>{{ store.counter }} items</div>
  <button @click="newItem()">Create new item</button>
  <ul>
    <li v-for="item in templateItems" :key="item.id">
      <span>{{ item.item.meta.title }}</span><!--TODO: fix item.item!-->
      <span title="delete" style="cursor: pointer" @click="delItem(item.id)">&#10060;</span>
    </li>
  </ul>
</template>

<style scoped>
    

</style>