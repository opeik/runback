import clone from "clone"
import type { ReplicantBrowser } from "nodecg/types/browser"
import Vue from "vue"
import Vuex, { Store } from "vuex"
import {
  Bracket,
  Commentator,
  Commentators,
  Player,
  Players,
  PlayerOverride,
  PlayerScore,
  Scoreboard,
  Settings,
} from "Runback/_types/"

Vue.use(Vuex)

const num_players = 2

const default_bracket: Bracket = {
  bracket_stage: 0,
  bracket_side: 0,
  grand_finals_side: 0,
  custom_progress: "",
}

let default_commentators: Commentators = {
  commentators: Array<Commentator>(num_players).fill(
    new Commentator()
  ) as Commentator[],
  overrides: Array<PlayerOverride>(num_players).fill(
    new PlayerOverride()
  ) as PlayerOverride[],
}

const default_players: Players = {} as Players

const default_scoreboard: Scoreboard = {
  scores: new Array<PlayerScore>(num_players).fill(new PlayerScore()),
  overrides: new Array<PlayerOverride>(num_players).fill(new PlayerOverride()),
}

const default_settings: Settings = {
  dark_mode: true,
  live_dashboard_update: false,
  smash_gg_api_key: "",
}

// Replicants and their types
const reps: {
  bracket: ReplicantBrowser<Bracket>
  commentators: ReplicantBrowser<Commentators>
  players: ReplicantBrowser<Players>
  scoreboard: ReplicantBrowser<Scoreboard>
  settings: ReplicantBrowser<Settings>
  [k: string]: ReplicantBrowser<unknown>
} = {
  bracket: nodecg.Replicant("Bracket", {
    defaultValue: default_bracket,
  }),
  commentators: nodecg.Replicant("Commentators", {
    defaultValue: default_commentators,
  }),
  players: nodecg.Replicant("Players", {
    defaultValue: default_players,
  }),
  scoreboard: nodecg.Replicant("Scoreboard", {
    defaultValue: default_scoreboard,
  }),
  settings: nodecg.Replicant("Settings", {
    defaultValue: default_settings,
  }),
}

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val)
    },
    /* Mutations to replicants start */
    set_dark_mode(state, dark_mode): void {
      let settings = reps.settings.value
      settings!.dark_mode = dark_mode as boolean
    },
    set_smash_gg_api_key(state, smash_gg_api_key): void {
      let settings = reps.settings.value
      settings!.smash_gg_api_key = smash_gg_api_key as string
    },
    set_live_dashboard_update(state, live_dashboard_update): void {
      let settings = reps.settings.value
      settings!.live_dashboard_update = live_dashboard_update as boolean
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
