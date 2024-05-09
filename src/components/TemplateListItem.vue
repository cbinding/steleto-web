<script setup>
import { computed } from 'vue'
import { useTemplateStore } from "@/stores/TemplateStore"

const store = useTemplateStore()
const item = computed(() => {
  return store.getItem(store.selectedID)
})
</script>

<template>
    <div>
        <div>(TemplateListItem)</div>
        <div>selected ID: '{{ store.selectedID }}'</div>

        <label for="created">Created:</label>
        <div id="created">{{ item?.meta?.created }}</div>

        <label for="updated">Updated:</label>
        <div id="updated">{{ item?.meta?.updated }}</div>

        <label for="creator">Creator:</label>
        <div id="creator">{{ item?.meta?.creator }}</div>

        <label for="title">Title:</label>
        <div id="title">{{ item?.meta?.title }}</div>

        <label for="description">Description:</label>
        <div id="description">{{ item?.meta?.description }}</div>

        <label for="content">Content:</label>
        <div id="content">{{ item?.data }}</div>
    </div>
</template>

<style scoped></style>