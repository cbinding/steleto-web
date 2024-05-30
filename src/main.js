import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

const pinia = createPinia()

const i18n = createI18n({
  locale: 'es',
  fallbackLocale: 'en',
  messages: {
    cy: {
      confirmDelete: "@:delete '{id}' - ydych chi'n siŵr?",
      creator: 'crëwr',
      created: 'creu',
      content: 'cynnwys',
      delete: 'dileu',
      description: 'disgrifiad',
      items: 'eitemau',
      new: 'newydd',
      result: 'canlyniad | canlyniadau',
      save: 'cadw',
      template: 'templed | templedi',
      title: 'teitl',
      updated: 'diweddaredig'
    },
    en: {
      confirmDelete: "@:delete '{id}' - are you sure?",
      created: 'created',
      creator: 'creator',
      content: 'content',
      delete: 'delete',
      description: 'description',
      items: 'items',
      new: 'new',
      result: 'result | results',
      save: 'save',
      template: 'template | templates',
      title: 'title',
      updated: 'updated'
    },
    es: {
      confirmDelete: "@:delete '{id}' - ¿Estás seguro?",
      created: 'creado',
      creator: 'creador',
      content: 'contenido',
      delete: 'borrar',
      description: 'descripción',
      items: 'artículos',
      new: 'nueva',
      result: 'resultado | resultados',
      save: 'guarde',
      template: 'plantilla | plantillas',
      title: 'título',
      updated: 'actualizado'
    },
    fr: {
      confirmDelete: "@:delete '{id}' - Êtes-vous sûr?",
      created: 'créé',
      creator: 'créateur',
      content: 'contenu',
      delete: 'supprimer',
      description: 'description',
      items: 'articles',
      new: 'nouveau',
      result: 'résultat | résultats',
      save: 'enregistrer',
      template: 'modèle | modèles',
      title: 'titre',
      updated: 'actualisé'
    }
  }
})

createApp(App)
    .use(pinia)
    .use(i18n)
    .mount('#app')
