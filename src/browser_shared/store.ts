import clone from "clone"
import type { ReplicantBrowser } from "nodecg/types/browser"
import Vue from "vue"
import Vuex, { Store } from "vuex"
import {
  Bracket,
  BracketOverride,
  Players,
  PlayerOverride,
  Scores,
} from "../../schemas"

Vue.use(Vuex)

// Replicants and their types
const reps: {
  bracket: ReplicantBrowser<Bracket>
  bracket_override: ReplicantBrowser<BracketOverride>
  players: ReplicantBrowser<Players>
  player_override: ReplicantBrowser<PlayerOverride>
  scores: ReplicantBrowser<Scores>
  [k: string]: ReplicantBrowser<unknown>
} = {
  bracket: nodecg.Replicant("Bracket"),
  bracket_override: nodecg.Replicant("BracketOverride"),
  players: nodecg.Replicant("Players"),
  player_override: nodecg.Replicant("PlayerOverride"),
  scores: nodecg.Replicant("Scores"),
}

// Types for mutations below
export type ExampleMutation = (arg: any) => void

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val)
    },
    /* Mutations to replicants start */
    exampleMutation(arg): void {
      // You may need to do checks like these, depending on mutation content.
      if (typeof reps.replicantName.value !== "undefined") {
        reps.replicantName.value = clone(arg)
      }
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
