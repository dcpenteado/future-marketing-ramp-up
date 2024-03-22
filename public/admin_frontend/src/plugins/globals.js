import Vue from "vue";

import { emitToastr } from "@/lib/Utils";
import Api from "@/lib/Api";

import { format } from "date-fns";

Vue.prototype.$toast = emitToastr;
Vue.prototype.$api = Api;

Vue.prototype.$date = {
    format: (date, pattern = "yyyy-MM-dd HH:mm") => {
        return format(date, pattern);
    }
}
