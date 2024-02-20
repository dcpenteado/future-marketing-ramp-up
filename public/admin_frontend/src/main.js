import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from '@/plugins/vuex'
import "@/assets/global.css";

import './plugins/components'
import './plugins/globals'

Vue.config.productionTip = false;

const app = new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
})

app.$mount("#app");
