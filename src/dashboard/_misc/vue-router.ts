import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../runback/home/home.vue"

Vue.use(VueRouter)

export default new VueRouter({
  routes: [{ path: "/", component: Home, name: "home" }],
})
