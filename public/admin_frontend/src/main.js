import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from '@/plugins/vuex'
import "@/assets/global.css";
import DialogOrBottomSheet from "@/components/DialogOrBottomSheet";

import { emitToastr } from "@/lib/Utils";
import Api from "@/lib/Api";

Vue.config.productionTip = false;

// global properties
Vue.prototype.$toast = emitToastr;
Vue.prototype.$api = Api;

// global components
Vue.component("DialogOrBottomSheet", DialogOrBottomSheet);

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
