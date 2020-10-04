import Vue from "vue"
import VueRouter from "vue-router"
import Dashboard from "../runback/dashboard/dashboard.vue"
import Players from "../runback/players/players.vue"
import Settings from "../runback/settings/settings.vue"
import About from "../runback/about/about.vue"

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: "/", component: Dashboard, name: "Dashboard" },
    { path: "/players", component: Players, name: "Players" },
    { path: "/settings", component: Settings, name: "Settings" },
    { path: "/about", component: About, name: "About" },
  ],
})
