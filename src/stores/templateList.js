import { createPinia, defineStore } from 'pinia'
import { createPersistPlugin } from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(createPersistPlugin())

export const useTemplateList = defineStore('templateList', {
  state: () => ({}),
  getters: {
    value() {
      return this.a * 2
    }
  }
})