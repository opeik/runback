<template>
  <panel title="Scoreboard" icon="controller-classic">
    <v-row align="center" justify="center" class="mb-8 mt-4">
      <v-btn class="mx-2" @click="swap">
        <v-icon left>mdi-swap-horizontal</v-icon>
        Swap
      </v-btn>
      <v-btn class="mx-2" @click="reset">
        <v-icon left>mdi-close</v-icon>
        Reset
      </v-btn>
      <v-btn class="mx-2">
        <v-icon left>mdi-pencil</v-icon>
        Details
      </v-btn>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col v-for="i in num_players" :key="i">
        <scoreboard-entry :player_num="i - 1"></scoreboard-entry>
      </v-col>
    </v-row>
  </panel>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Mutation, State, Action } from "vuex-class"
import { Player, Players, PlayerScore, Scoreboard } from "Runback/_types/"
import type { ActionMethod } from "vuex"

@Component
export default class ScoreboardPanel extends Vue {
  @State((state) => state.Runback.scoreboard) scoreboard!: Scoreboard
  @Mutation("set_scoreboard_score") set_scoreboard_score!: ActionMethod
  @Action("swap_players") swap_players!: ActionMethod
  @Action("reset_score") reset_score!: ActionMethod

  num_players: number = 0

  mounted(): void {
    this.num_players = this.scoreboard.scores.length
  }

  swap(): void {
    this.swap_players()
  }

  reset(): void {
    this.reset_score()
  }
}
</script>
