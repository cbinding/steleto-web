<script setup>
// use of custom composable - reusable code module
import { defineProps, computed, unref } from "vue"
import { useCycle } from '@/composables/useCycle.js'

const props = defineProps({
  list: { type: Array, required: true },
  index: { type: Number, required: false, default: 0 }
})

const { currentValue, next } = useCycle(props.list, props.index)

const displayValue = computed(() => {
  const item = unref(currentValue)
  return (item.value || item || "").toString()
})

const displayTitle = computed(() => {
  const item = unref(currentValue)  
  return (item.title || item.value || item || "").toString()  
})
</script>

<template>
  <button 
    type="button"
    role="button"     
    class="btn btn-outline-secondary btn-sm" 
    :disabled=false
    :aria-disabled=false
    @click="next" 
    :title="displayTitle" 
    :alt="displayTitle">{{ displayValue }}</button>
</template>

<style scoped>
</style>
