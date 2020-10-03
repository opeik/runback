<template>
  <panel title="Scoreboard" icon="controller-classic">
    <v-row align="center" justify="center" class="mb-4">
      <v-btn class="mx-2">
        <v-icon left>mdi-swap-horizontal</v-icon>
        Swap
      </v-btn>
      <v-btn color="error" class="mx-2">
        <v-icon left>mdi-close</v-icon>
        Reset
      </v-btn>
      <v-btn class="mx-2">
        <v-icon left>mdi-pencil</v-icon>
        Override
      </v-btn>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="6">
        <scoreboard-player :player_num="0"></scoreboard-player>
      </v-col>
      <v-col cols="6">
        <scoreboard-player :player_num="1"></scoreboard-player>
      </v-col>
    </v-row>
  </panel>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"

@Component
export default class ScoreboardPanel extends Vue {}
</script>
