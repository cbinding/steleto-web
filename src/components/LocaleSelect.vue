<!--TODO: locale selection for locale-->
<script setup>
import { watch, computed, ref } from "vue"
import { useI18n } from "vue-i18n"
const { locale } = useI18n()
import languages from "@/i18n_languages.json"

const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  options: {
    type: String,
    required: false,
    default: "cy, en",
  }
})

const visible = ref(true)

// sorted subset of i18n_languages based on options (csv) property
const languageSubset = computed(() => {    
    const options = props.options
        .toLowerCase()
        .split(",")
        .map(s => s.trim())
        .filter(s => s) 

    const getValue = item => item.label || item.labelEN || item.id  
    
    return languages
        .filter(item => options.includes(item.id.toLowerCase()))
        .sort((a, b) => getValue(a).localeCompare(getValue(b)))
})

// save current locale selection for next time
watch(locale, () => {
  localStorage.setItem("locale", locale.value) 
})

// get flag for display (where supported)
const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char =>  127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}
</script>

<template>    
   <div class="float-end">
    <span class="input-group input-group-sm">
          
        <select 
            v-model="locale"
            id="localeSelector" 
            class='form-select form-select-sm shadow-sm'
            @change="changed"
            @blur="visible=false"
            @mouseleave="visible=false"
            v-show="visible"
            :disabled="props.disabled"
            :lang="locale">
            <option 
                v-for="item in languageSubset" 
                :key="item.id" 
                :value="item.id"
                :lang="locale"
                :title="item.label || item.labelEN || item.id"
                :alt="item.label || item.labelEN || item.id"
                :selected="item.id == locale">
                <span>{{ getFlagEmoji(item.id) }}</span>
                &nbsp;
                <span>{{ item.label || item.labelEN || item.id }}</span>
            </option>                 
        </select>
        <button 
            class="btn btn-outline-light shadow-sm" 
            for="localeSelector"
            :alt="$t('settings')"
            @click="visible = !visible"
            :title="$t('settings')">&#x2699;</button>          
    </span></div>
</template>

<style scoped>

</style>