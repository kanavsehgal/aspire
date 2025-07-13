// FILE: main.ts

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'
import router from './router'
import i18n from './i18n'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Import our organized SCSS styles
import './styles/main.scss'

// Assumes your root component is App.vue
// and placed in same folder as main.ts
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

// Use plugins
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Quasar, {
  plugins: { Notify }, // import Quasar plugins and add here
})

// Assumes you have a <div id="app"></div> in your index.html
app.mount('#app')
