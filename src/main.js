import { createApp } from 'vue';
import App from './App.vue';
import './style/global.css';
import 'bootstrap/dist/css/bootstrap.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
