<template>
  <div class="player">
    <v-row>
      <v-col cols="auto">
        <v-text-field
          hide-details
          single-line
          solo
          class="display-1 centered-input black--text"
          value="0"
          type="number"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="auto">
        <v-autocomplete label="Player" outlined> </v-autocomplete>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"

@Component
export default class ScoreboardEntry extends Vue {}
</script>
