import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

const messages = {
  en
}

export default createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Set default locale
  fallbackLocale: 'en', // Fallback locale
  messages,
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false
})
