<template>
  <panel title="Commentary" icon="headset">
    <v-row align="center" justify="center" class="mb-8 mt-4">
      <v-btn class="mx-2" @click="swap">
        <v-icon left>mdi-swap-horizontal</v-icon>
        Swap
      </v-btn>
      <v-btn class="mx-2">
        <v-icon left>mdi-pencil</v-icon>
        Details
      </v-btn>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col v-for="i in num_commentators" :key="i">
        <commentary-entry :commentator_num="i - 1"></commentary-entry>
      </v-col>
    </v-row>
  </panel>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Mutation, State, Action } from "vuex-class"
import { Commentator, Commentators } from "Runback/_types/"
import type { ActionMethod } from "vuex"

@Component
export default class CommentaryPanel extends Vue {
  @State((state) => state.Runback.commentators) commentators!: Commentators
  @Action("swap_commentators") swap_commentators!: ActionMethod

  num_commentators: number = 0

  mounted(): void {
    this.num_commentators = this.commentators.commentators.length
  }

  swap(): void {
    this.swap_commentators()
  }
}
</script>
