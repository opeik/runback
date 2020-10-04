import clone from "clone"
import type { ReplicantBrowser } from "nodecg/types/browser"
import Vue from "vue"
import Vuex, { Store } from "vuex"
import {
  Bracket,
  Players,
  PlayerOverride,
  Scores,
  Settings,
} from "../../schemas"

Vue.use(Vuex)

// Replicants and their types
const reps: {
  bracket: ReplicantBrowser<Bracket>
  scores: ReplicantBrowser<Scores>
  players: ReplicantBrowser<Players>
  player_override: ReplicantBrowser<PlayerOverride>
  settings: ReplicantBrowser<Settings>
  [k: string]: ReplicantBrowser<unknown>
} = {
  bracket: nodecg.Replicant("bracket"),
  scores: nodecg.Replicant("scores"),
  players: nodecg.Replicant("players"),
  player_override: nodecg.Replicant("player_override"),
  settings: nodecg.Replicant("settings"),
}

// Types for mutations below
export type SetDarkMode = (dark_mode: boolean) => void

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val)
    },
    /* Mutations to replicants start */
    set_dark_mode(state, dark_mode): void {
      let settings: any = reps.settings.value
      let local_dark_mode: boolean = dark_mode as boolean
      settings.dark_mode = local_dark_mode
    },
    /* Mutations to replicants end */
  },
})

Object.keys(reps).forEach((key) => {
  reps[key].on("change", (val) => {
    store.commit("setState", { name: key, val: clone(val) })
  })
})

export default async (): Promise<Store<Record<string, unknown>>> => {
  await NodeCG.waitForReplicants(...Object.keys(reps).map((key) => reps[key]))
  return store
}
