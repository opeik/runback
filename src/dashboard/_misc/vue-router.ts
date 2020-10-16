import Vue from "vue"
import VueRouter from "vue-router"
import Dashboard from "src/dashboard/runback/dashboard/dashboard.vue"
import Players from "src/dashboard/runback/players/players.vue"
import Graphics from "src/dashboard/runback/graphics/graphics.vue"
import Settings from "src/dashboard/runback/settings/settings.vue"
import About from "src/dashboard/runback/about/about.vue"

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
