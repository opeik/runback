<template>
  <div class="player">
    <v-row class="mb-n12">
      <v-col>
        <v-autocomplete
          outlined
          label="Player"
          class="mb-n2"
          v-model="player_id"
          :items="players_array"
          item-text="gamertag"
          item-value="id"
        >
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
  Commentator,
  CommentatorsReplicant,
} from "src/dashboard/runback/_types/"
import type { ActionMethod } from "vuex"

@Component
export default class CommentaryEntry extends Vue {
  @Prop(Number) readonly commentator_num!: number
  @State((state) => state.Runback.players) players!: PlayersReplicant
  @State((state) => state.Runback.commentators)
  commentators!: CommentatorsReplicant
  @Mutation("set_commentator_player_id")
  set_commentator_player_id!: ActionMethod

  get player_id(): string {
    return this.commentators.commentators[this.commentator_num].player_id
  }

  set player_id(v: string) {
    this.set_commentator_player_id({
      commentator_num: this.commentator_num,
      player_id: v,
    })
  }

  get players_array(): Player[] {
    return Object.values(this.players)
  }
}
</script>
