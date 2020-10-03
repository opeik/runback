import Vue from "vue"
import VueRouter from "vue-router"
import Dashboard from "../runback/dashboard/dashboard.vue"
import Players from "../runback/players/players.vue"

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: "/", component: Dashboard, name: "dashboard" },
    { path: "/players", component: Players, name: "players" },
  ],
})
