import Vue from "vue";

import { emitToastr } from "@/lib/Utils";
import Api from "@/lib/Api";

Vue.prototype.$toast = emitToastr;
Vue.prototype.$api = Api;
