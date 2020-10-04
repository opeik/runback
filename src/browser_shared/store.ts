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
} from "Runback/../../schemas"

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

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val)
    },
    /* Mutations to replicants start */
    set_dark_mode(state, dark_mode): void {
      let settings: any = reps.settings.value
      settings.dark_mode = dark_mode as boolean
    },
    set_smash_gg_api_key(state, smash_gg_api_key): void {
      let settings: any = reps.settings.value
      settings.smash_gg_api_key = smash_gg_api_key as string
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
