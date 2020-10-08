import Vue from "vue"
import VueRouter from "vue-router"
import Dashboard from "Runback/dashboard/dashboard.vue"
import Players from "Runback/players/players.vue"
import Graphics from "Runback/graphics/graphics.vue"
import Settings from "Runback/settings/settings.vue"
import About from "Runback/about/about.vue"

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: "/", component: Dashboard, name: "Dashboard" },
    { path: "/players", component: Players, name: "Players" },
    { path: "/graphics", component: Graphics, name: "Graphics" },
    { path: "/settings", component: Settings, name: "Settings" },
    { path: "/about", component: About, name: "About" },
  ],
})
