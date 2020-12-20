<template>
  <div class="player">
    <v-row>
      <v-col>
        <v-text-field
          hide-details
          single-line
          solo
          class="display-1 centered-input black--text"
          type="number"
          min="0"
          max="99"
          v-model="score"
          @keypress="prevent_typing($event)"
        />
      </v-col>
    </v-row>

    <v-row class="mb-n10">
      <v-col>
        <v-autocomplete
          outlined
          label="Player"
          class="mb-n2"
          v-model="player_id"
          item-text="gamertag"
          item-value="id"
          :items="players_array"
        />
        </v-autocomplete>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Mutation, State } from "vuex-class"
import {
  Player,
  PlayersReplicant,
  PlayerScore,
  ScoreboardReplicant,
} from "src/dashboard/runback/_types/"
import type { ActionMethod } from "vuex"

@Component
export default class ScoreboardEntry extends Vue {
  @Prop(Number) readonly player_num!: number
  @State((state) => state.Runback.players) players!: PlayersReplicant
  @State((state) => state.Runback.scoreboard) scoreboard!: ScoreboardReplicant
  @Mutation("set_scoreboard_score") set_scoreboard_score!: ActionMethod
  @Mutation("set_scoreboard_player_id") set_scoreboard_player_id!: ActionMethod

  get score(): string {
    return this.scoreboard.scores[this.player_num].score.toString()
  }

  set score(v: string) {
    this.set_scoreboard_score({
      player_num: this.player_num,
      score: parseInt(v, 10),
    })
  }

  get player_id(): string {
    return this.scoreboard.scores[this.player_num].player_id
  }

  set player_id(v: string) {
    this.set_scoreboard_player_id({
      player_num: this.player_num,
      player_id: v,
    })
  }

  get players_array(): Player[] {
    return Object.values(this.players)
  }

  prevent_typing(evt: any) {
    evt.preventDefault()
  }
}
</script>
