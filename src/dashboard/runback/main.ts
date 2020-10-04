/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import Vue from "vue"
import vuetify from "../_misc/vuetify"
import router from "../_misc/vue-router"
import App from "./main.vue"
import waitForReplicants from "../../browser_shared/store"

import Panel from "./components/panel.vue"
import Navigation from "./components/navigation.vue"
import ScoreboardPanel from "./dashboard/components/scoreboard-panel.vue"
import ScoreboardEntry from "./dashboard/components/scoreboard-entry.vue"
import TournamentPanel from "./dashboard/components/tournament-panel.vue"
import CommentaryPanel from "./dashboard/components/commentary-panel.vue"
import CommentaryEntry from "./dashboard/components/commentary-entry.vue"
import EventPanel from "./dashboard/components/event-panel.vue"

Vue.component("panel", Panel)
Vue.component("navigation", Navigation)
Vue.component("scoreboard-panel", ScoreboardPanel)
Vue.component("scoreboard-entry", ScoreboardEntry)
Vue.component("tournament-panel", TournamentPanel)
Vue.component("commentary-panel", CommentaryPanel)
Vue.component("commentary-entry", CommentaryEntry)
Vue.component("event-panel", EventPanel)

waitForReplicants().then((store) => {
  new Vue({
    vuetify,
    router,
    store,
    el: "#App",
    render: (h) => h(App),
  })
})
