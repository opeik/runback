/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import Vue from "vue"
import vuetify from "../_misc/vuetify"
import router from "../_misc/vue-router"
import App from "./main.vue"
import waitForReplicants from "../../browser_shared/store"

import Panel from "./components/panel.vue"
import Navigation from "./components/navigation.vue"
import ScoreboardPanel from "./components/scoreboard-panel.vue"
import ScoreboardPlayer from "./components/scoreboard-player.vue"
import TournamentPanel from "./components/tournament-panel.vue"

Vue.component("panel", Panel)
Vue.component("navigation", Navigation)
Vue.component("scoreboard-panel", ScoreboardPanel)
Vue.component("scoreboard-player", ScoreboardPlayer)
Vue.component("tournament-panel", TournamentPanel)

waitForReplicants().then((store) => {
  new Vue({
    vuetify,
    router,
    store,
    el: "#App",
    render: (h) => h(App),
  })
})
