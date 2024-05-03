<script setup>
defineProps({
  msg: {
    type: String,
    required: false
  }
})
</script>

<template>
  <div>(DataConversion component) "{{msg}}"</div>
</template>

<style scoped>

</style>
