<template>
  <panel title="Tournament" icon="tournament">
    <v-autocomplete
      label="Stage"
      item-text="text"
      item-value="value"
      required
    ></v-autocomplete>

    <v-autocomplete
      label="Bracket side"
      item-text="text"
      item-value="value"
      required
    ></v-autocomplete>

    <v-autocomplete
      label="Grand finals side"
      item-text="text"
      item-value="value"
      required
    ></v-autocomplete>

    <v-row>
      <v-col cols="10">
        <v-text-field label="Custom progress" required></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-switch />
      </v-col>
    </v-row>
  </panel>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"

@Component
export default class TournamentPanel extends Vue {}
</script>
