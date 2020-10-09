import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";

import App from "./App.vue";
import store from "./store";
import VueSSE from "vue-sse";

Vue.use(VueSSE);
Vue.config.productionTip = false;

new Vue({
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
