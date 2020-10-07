import clone from "clone"
import Uuid from "pure-uuid"
import type { ReplicantBrowser } from "nodecg/types/browser"
import Vue from "vue"
import Vuex, { Store } from "vuex"
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"
import {
  Bracket,
  Commentators,
  Player,
  Players,
  PlayerScore,
  Scoreboard,
  Settings,
} from "Runback/_types/"

Vue.use(Vuex)

const reps: {
  bracket: ReplicantBrowser<Bracket>
  commentators: ReplicantBrowser<Commentators>
  players: ReplicantBrowser<Players>
  scoreboard: ReplicantBrowser<Scoreboard>
  settings: ReplicantBrowser<Settings>
  [k: string]: ReplicantBrowser<unknown>
} = {
  bracket: nodecg.Replicant("Bracket", {
    defaultValue: new Bracket(),
  }),
  commentators: nodecg.Replicant("Commentators", {
    defaultValue: new Commentators(),
  }),
  players: nodecg.Replicant("Players", {
    defaultValue: {} as Players,
  }),
  scoreboard: nodecg.Replicant("Scoreboard", {
    defaultValue: new Scoreboard(),
  }),
  settings: nodecg.Replicant("Settings", {
    defaultValue: new Settings(),
  }),
}

@Module
class Runback extends VuexModule {
  @Mutation
  set_dark_mode(dark_mode: boolean): void {
    reps.settings.value!.dark_mode = dark_mode
  }

  @Mutation
  set_smash_gg_api_key(smash_gg_api_key: string): void {
    reps.settings.value!.smash_gg_api_key = smash_gg_api_key
  }

  @Mutation
  set_live_dashboard_update(live_dashboard_update: boolean): void {
    reps.settings.value!.live_dashboard_update = live_dashboard_update
  }

  @Mutation
  set_player(player: Player): void {
    if (player.id.length === 0) {
      player.id = new Uuid(4).toString()
    }

    reps.players.value![player.id] = player
  }

  @Mutation
  delete_player(player_id: string): void {
    delete reps.players.value![player_id]
  }

  @Mutation
  set_scoreboard_score(args: { player_num: number; score: number }): void {
    reps.scoreboard.value!.scores[args.player_num].score = args.score
  }

  @Mutation
  set_scoreboard_player_id(args: {
    player_num: number
    player_id: string
  }): void {
    reps.scoreboard.value!.scores[args.player_num].player_id = args.player_id
  }

  @Mutation
  set_commentator_player_id(args: {
    commentator_num: number
    player_id: string
  }): void {
    reps.commentators.value!.commentators[args.commentator_num].player_id =
      args.player_id
  }

  @Action
  swap_players(): void {
    let left: string = reps.scoreboard.value!.scores[0].player_id
    let right: string = reps.scoreboard.value!.scores[1].player_id

    this.context.commit("set_scoreboard_player_id", {
      player_num: 0,
      player_id: right,
    })

    this.context.commit("set_scoreboard_player_id", {
      player_num: 1,
      player_id: left,
    })
  }

  @Action
  swap_commentators(): void {
    let left: string = reps.commentators.value!.commentators[0].player_id
    let right: string = reps.commentators.value!.commentators[1].player_id

    this.context.commit("set_commentator_player_id", {
      commentator_num: 0,
      player_id: right,
    })

    this.context.commit("set_commentator_player_id", {
      commentator_num: 1,
      player_id: left,
    })
  }

  @Action
  reset_score(): void {
    for (let i = 0; i < reps.scoreboard.value!.scores.length; ++i) {
      this.context.commit("set_scoreboard_score", {
        player_num: i,
        score: 0,
      })
    }
  }
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {},
  modules: { Runback },
  mutations: {
    set_state(state, { name, val }): void {
      Vue.set(state.Runback, name, val)
    },
  },
})

Object.keys(reps).forEach((key) => {
  reps[key].on("change", (val) => {
    store.commit("set_state", { name: key, val: clone(val) })
  })
})

export default async (): Promise<Store<Record<string, unknown>>> => {
  await NodeCG.waitForReplicants(...Object.keys(reps).map((key) => reps[key]))
  return store
}
