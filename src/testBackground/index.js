import Vue from 'vue'
// import 'lib-flexible/flexible.js'
// import './assets/css/main.scss'
import App from '@/views/index.vue'
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/testBackground/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }
new Vue({
    el: "#app",
    components: { App }
})