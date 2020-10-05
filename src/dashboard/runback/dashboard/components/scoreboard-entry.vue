<template>
  <div class="player">
    <v-row>
      <v-col>
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

    <v-row class="mb-n10">
      <v-col>
        <v-autocomplete outlined label="Player" class="mb-n2"> </v-autocomplete>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class ScoreboardEntry extends Vue {}
</script>
