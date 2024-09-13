<script setup>
// use of custom composable - reusable code module
import { defineProps, computed, unref } from "vue"
import { useI18n } from "vue-i18n"
import { useCycle } from '@/composables/useCycle.js'

const { locale }  = useI18n()

const props = defineProps({
  list: { type: Array, required: true },
  index: { type: Number, required: false, default: 0 },
  disabled: { type: Boolean, required: false, default: false }
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
    class="cycle-button btn btn-sm btn-outline-secondary" 
    :lang="locale"
    :disabled="props.disabled"
    :aria-disabled="props.disabled"
    @click.stop.prevent="next" 
    :title="displayTitle" 
    :value="displayValue"
    :alt="displayTitle">{{ displayValue }}</button>
</template>

<style scoped>
.cycle-button {
  max-width: 80px;
}
</style>
