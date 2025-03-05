<script setup>
import { watch, computed, ref } from "vue"
import { useI18n } from "vue-i18n"
const { locale } = useI18n()
import languages from "@/i18n_languages.json"
import { LocaleDisplayOption } from "@/composables/Constants.js"


const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  display: {
    type: String,
    required: false,
    default: LocaleDisplayOption.LOCALE_ONLY,
    validator(value) {
      // must be a localeDisplayOption value 
      return Object.keys(LocaleDisplayOption).includes(value)
    }
  },
  options: {
    type: String,
    required: false,
    default: "cy, en",
  }
})

const visible = ref(false)

// sorted subset of i18n_languages based on options (csv) property
const languageSubset = computed(() => {    
  const options = props.options
    .toLowerCase()
    .split(",")
    .map(s => s.trim())
    .filter(s => s) 

  // label to be displayed for language option
  const getDisplayLabel = (item, display) => {
    let label = ""
    switch (display) {
      case LocaleDisplayOption.ENGLISH_ONLY: 
        label = item.labelEN ? item.labelEN : item.id; break;
      case LocaleDisplayOption.LOCALE_FIRST:
        label = item.label ? `${item.label} (${item.labelEN})` : item.labelEN; break;
      case LocaleDisplayOption.ENGLISH_FIRST:
        label = item.label ? `${item.labelEN} (${item.label})` : item.labelEN; break;
      default:
        // LOCALE_ONLY
        label = item.label || item.labelEN || item.id; break;
    }  
    return label
  }

  // return sorted subset of language options with appropriate display label
  return languages
    .filter(item => options.includes(item.id.toLowerCase()))
    .map(item => {
      return { id: item.id, label: getDisplayLabel(item, props.display) }
    }).sort((a, b) => (a.label).localeCompare(b.label))
    
        
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
                :title="item.label"
                :alt="item.label"
                :selected="item.id == locale">
                <span>{{ getFlagEmoji(item.id) }}</span>
                &nbsp;
                <span>{{ item.label }}</span>
            </option>                 
        </select>
        <button 
            class="btn btn-outline-light shadow-sm" 
            for="localeSelector"
            :alt="$t('settings')"
            @click="visible = !visible"
            :disabled="props.disabled"
            :title="$t('settings')">&#9881;</button>          
    </span>
  </div>
</template>

<style scoped>

</style>