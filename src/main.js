import './assets/main.css'

// Import our custom CSS
import './scss/styles.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import i18n_messages from './i18n_messages.json'

const pinia = createPinia()

const i18n = createI18n({
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: i18n_messages,
  globalInjection: true,
  legacy: false
})

createApp(App)
  .use(pinia)
  .use(i18n)
  .mount('#app')
