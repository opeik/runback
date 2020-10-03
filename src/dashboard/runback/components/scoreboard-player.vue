<template>
  <div class="player">
    <v-container>
      <v-autocomplete label="Player" outlined> </v-autocomplete>
    </v-container>

    <v-row justify="center">
      <div class="headline justify-center black--text">Player name</div>
    </v-row>

    <v-row justify="center">
      <v-col cols="12">
        <div class="display-3 text-center text-no-wrap black--text px-2">0</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" align="center">
        <v-btn>
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="6" align="center">
        <v-btn>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"

@Component
export default class ScoreboardPlayer extends Vue {}
</script>
