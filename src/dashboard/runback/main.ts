/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import Vue from "vue"
import vuetify from "../_misc/vuetify"
import router from "../_misc/vue-router"
import App from "./main.vue"
import waitForReplicants from "src/dashboard/runback/../../browser_shared/store"
import "./runback.css"

import Panel from "src/dashboard/runback/components/panel.vue"
import Navigation from "src/dashboard/runback/components/navigation.vue"
import AppBar from "src/dashboard/runback/components/app-bar.vue"
import ScoreboardPanel from "src/dashboard/runback/dashboard/components/scoreboard-panel.vue"
import ScoreboardEntry from "src/dashboard/runback/dashboard/components/scoreboard-entry.vue"
import BracketPanel from "src/dashboard/runback/dashboard/components/bracket-panel.vue"
import CommentaryPanel from "src/dashboard/runback/dashboard/components/commentary-panel.vue"
import CommentaryEntry from "src/dashboard/runback/dashboard/components/commentary-entry.vue"
import EventPanel from "src/dashboard/runback/dashboard/components/event-panel.vue"
import Logo from "src/dashboard/runback/components/logo.vue"
import Snackbar from "src/dashboard/runback/components/snackbar.vue"

Vue.component("panel", Panel)
Vue.component("navigation", Navigation)
Vue.component("app-bar", AppBar)
Vue.component("scoreboard-panel", ScoreboardPanel)
Vue.component("scoreboard-entry", ScoreboardEntry)
Vue.component("bracket-panel", BracketPanel)
Vue.component("commentary-panel", CommentaryPanel)
Vue.component("commentary-entry", CommentaryEntry)
Vue.component("event-panel", EventPanel)
Vue.component("logo", Logo)
Vue.component("snackbar", Snackbar)

waitForReplicants().then((store) => {
  new Vue({
    vuetify,
    router,
    store,
    el: "#App",
    render: (h) => h(App),
  })
})
