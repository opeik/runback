/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import Vue from "vue"
import vuetify from "../_misc/vuetify"
import router from "../_misc/vue-router"
import App from "./main.vue"
import waitForReplicants from "../../browser_shared/store"
import "./runback.css"

import Panel from "Runback/components/panel.vue"
import Navigation from "Runback/components/navigation.vue"
import AppBar from "Runback/components/app-bar.vue"
import ScoreboardPanel from "Runback/dashboard/components/scoreboard-panel.vue"
import ScoreboardEntry from "Runback/dashboard/components/scoreboard-entry.vue"
import BracketPanel from "Runback/dashboard/components/bracket-panel.vue"
import CommentaryPanel from "Runback/dashboard/components/commentary-panel.vue"
import CommentaryEntry from "Runback/dashboard/components/commentary-entry.vue"
import EventPanel from "Runback/dashboard/components/event-panel.vue"

Vue.component("panel", Panel)
Vue.component("navigation", Navigation)
Vue.component("app-bar", AppBar)
Vue.component("scoreboard-panel", ScoreboardPanel)
Vue.component("scoreboard-entry", ScoreboardEntry)
Vue.component("bracket-panel", BracketPanel)
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
