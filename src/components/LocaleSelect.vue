<!--TODO: locale selection for locale-->
<script setup>
import { watch } from "vue"
import { useI18n } from "vue-i18n"
const { locale } = useI18n()

// save current locale selection for next time
watch(locale, () => {
  localStorage.setItem("locale", locale.value) 
})

const locales = [
    {
        id: "cy",
        label: "Cymraeg",
        labelEN: "Welsh"
    },
    {
        id: "cs",
        label: "Čeština",
        labelEN: "Czech"
    },
     {
        id: "de",
        label: "Deutsch",
        labelEN: "German"
    },
    {
        id: "en",
        label: "English"
    },
    {
        id: "es",
        label: "Español",
        labelEN: "Spanish"
    },
    {
        id: "fr",
        label: "Français",
        labelEN: "French"
    },
    {
        id: "it",
        label: "Italiano",
        labelEN: "Italian"
    },
]
</script>

<template>
    <div class="input-group input-group-sm" >
        <label 
            class="input-group-text" 
            for="localeSelector"
            :alt="$t('settings')"
            :title="$t('settings')">&#x2699;</label>     
        <select 
            v-model="locale"
            id="localeSelector" 
            class='form-select form-select-sm'
            @change="changed"
            :lang="locale">
            <option 
                v-for="item in locales" 
                :key="item.id" 
                :value="item.id"
                :lang="locale"
                :selected="item.id == locale">
                <span>{{ item.label }}</span>
            </option>                 
        </select>        
    </div>
</template>

<style scoped>

</style>