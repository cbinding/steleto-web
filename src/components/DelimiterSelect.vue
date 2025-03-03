<script setup>
import { ref } from "vue"
import { useI18n } from "vue-i18n"
const { locale } = useI18n()

const delimiter = ref("")

const delimiterOptions = [
  { value: ",", label: "comma" },
  { value: "\t", label: "tab" },
  { value: "|", label: "pipe" },
  { vale: "#", label: "hash"}
]

const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

</script>

<template> 
  <div class="col-form-label-sm text-capitalize fw-bold">{{ $t('delimiter') }}</div>   
   <span class="input-group input-group-sm">
      <select 
        v-model="delimiter"
        id="delimiterSelector" 
        class='form-select form-select-sm shadow-sm'
        @change="changed"
        :disabled="props.disabled"
        :lang="locale">
        <option v-for="item in delimiterOptions" 
          :key="item.label" 
          :value="item.value"
          :title="item.label"
          :alt="item.label"
          :selected="item.value == delimiter">{{ item.label }}</option>                 
      </select>        
    </span> 
</template>

<style scoped></style>