import clone from "clone"
import Uuid from "pure-uuid"
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
  Rules,
  Updater,
} from "src/dashboard/runback/_types"
import UUID from "pure-uuid"

Vue.use(Vuex)

const rules = new Rules()
const version: string = require("src/../package.json").version

@Module
class Runback extends VuexModule {
  @Mutation
  set_dark_mode(dark_mode: boolean): void {
    // reps.settings.value!.dark_mode = dark_mode
  }

  @Mutation
  set_smash_gg_api_key(smash_gg_api_key: string): void {
    // reps.settings.value!.smash_gg_api_key = smash_gg_api_key
  }

  @Mutation
  set_live_dashboard_update(live_dashboard_update: boolean): void {
    // reps.settings.value!.live_dashboard_update = live_dashboard_update
  }

  @Mutation
  create_player(player: Player): void {
    // while (player.id in reps.players.value! || player.id.length === 0) {
    //   player.id = new Uuid(4).toString()
    // }
    // reps.players.value![player.id] = player
  }

  @Mutation
  set_player(player: Player): void {
    // if (!(player.id in reps.players.value!)) {
    //   console.error("Invalid player id to update")
    // } else {
    //   reps.players.value![player.id] = player
    // }
  }

  @Mutation
  delete_player(player_id: string): void {
    // reps.scoreboard.value!.scores.forEach((v, i) => {
    //   if (v.player_id === player_id) {
    //     reps.scoreboard.value!.scores[i].player_id = ""
    //   }
    // })
    // reps.commentators.value!.commentators.forEach((v, i) => {
    //   if (v.player_id === player_id) {
    //     reps.commentators.value!.commentators[i].player_id = ""
    //   }
    // })
    // delete reps.players.value![player_id]
  }

  @Mutation
  set_scoreboard_score(args: { player_num: number; score: number }): void {
    // if (args.score < 0) {
    //   console.warn("Score is negative")
    //   args.score = 0
    // } else if (Number.isNaN(args.score)) {
    //   console.warn("Score is NaN")
    //   args.score = 0
    // }
    // args.score = Math.trunc(args.score)
    // reps.scoreboard.value!.scores[args.player_num].score = args.score
  }

  @Mutation
  set_scoreboard_player_id(args: {
    player_num: number
    player_id: string
  }): void {
    // reps.scoreboard.value!.scores[args.player_num].player_id = args.player_id
  }

  @Mutation
  set_commentator_player_id(args: {
    commentator_num: number
    player_id: string
  }): void {
    // reps.commentators.value!.commentators[args.commentator_num].player_id =
    //   args.player_id
  }

  @Mutation
  set_scoreboard_should_override(args: {
    player_num: number
    should_override: boolean
  }) {
    // reps.scoreboard.value!.overrides[args.player_num].should_override =
    //   args.should_override
  }

  @Mutation
  set_commentators_should_override(args: {
    commentator_num: number
    should_override: boolean
  }) {
    // reps.commentators.value!.overrides[args.commentator_num].should_override =
    //   args.should_override
  }

  @Mutation
  set_scoreboard_override(args: { player_num: number; override: Player }) {
    // reps.scoreboard.value!.overrides[args.player_num].override = args.override
  }

  @Mutation
  set_commentators_override(args: {
    commentator_num: number
    override: Player
  }) {
    // reps.commentators.value!.overrides[args.commentator_num].override =
    //   args.override
  }

  @Mutation
  set_bracket_stage(bracket_stage: number) {
    // if (bracket_stage < 0 || bracket_stage > rules.stage_list.length) {
    //   bracket_stage = 0
    // }
    // reps.bracket.value!.stage = bracket_stage
  }

  @Mutation
  set_bracket_side(bracket_side: number) {
    // if (
    //   bracket_side < 0 ||
    //   bracket_side > rules.side_list.length + rules.grand_final_side_list.length
    // ) {
    //   console.warn("Bracket side out of bounds")
    //   bracket_side = 0
    // }
    // reps.bracket.value!.side = bracket_side
  }

  @Mutation
  set_custom_progress(custom_progress: string) {
    // reps.bracket.value!.custom_progress = custom_progress
  }

  @Mutation
  set_custom_progress_enabled(custom_progress_enabled: boolean) {
    // reps.bracket.value!.custom_progress_enabled = custom_progress_enabled
  }

  @Action
  import_players(players: Player[]) {
    // for (let player of players) {
    //   player.id = ""
    //   this.context.commit("create_player", player)
    // }
  }

  @Action
  swap_players(): void {
    // let left: string = reps.scoreboard.value!.scores[0].player_id
    // let right: string = reps.scoreboard.value!.scores[1].player_id
    // this.context.commit("set_scoreboard_player_id", {
    //   player_num: 0,
    //   player_id: right,
    // })
    // this.context.commit("set_scoreboard_player_id", {
    //   player_num: 1,
    //   player_id: left,
    // })
  }

  @Action
  swap_commentators(): void {
    // let left: string = reps.commentators.value!.commentators[0].player_id
    // let right: string = reps.commentators.value!.commentators[1].player_id
    // this.context.commit("set_commentator_player_id", {
    //   commentator_num: 0,
    //   player_id: right,
    // })
    // this.context.commit("set_commentator_player_id", {
    //   commentator_num: 1,
    //   player_id: left,
    // })
  }

  @Action
  reset_score(): void {
    // for (let i = 0; i < reps.scoreboard.value!.scores.length; ++i) {
    //   this.context.commit("set_scoreboard_score", {
    //     player_num: i,
    //     score: 0,
    //   })
    // }
  }
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {},
  modules: { Runback },
  mutations: {},
})
