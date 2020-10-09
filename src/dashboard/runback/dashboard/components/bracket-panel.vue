<template>
  <panel title="Bracket" icon="tournament">
    <v-autocomplete
      :items="rules.stage_list"
      v-model="bracket_stage"
      label="Stage"
      item-text="text"
      item-value="value"
      required
    ></v-autocomplete>

    <v-autocomplete
      :items="rules.side_list"
      :disabled="is_grand_final"
      v-model="bracket_side"
      label="Bracket side"
      item-text="text"
      item-value="value"
      required
    ></v-autocomplete>

    <v-autocomplete
      :items="rules.grand_final_list"
      :disabled="!is_grand_final"
      v-model="grand_final_side"
      label="Grand Final side"
      item-text="text"
      item-value="value"
      required
    ></v-autocomplete>

    <v-row>
      <v-col cols="10">
        <v-text-field
          v-model="custom_progress"
          label="Custom progress"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-switch
          v-model="custom_progress_enabled"
          :disabled="custom_progress.length === 0"
        />
      </v-col>
    </v-row>
  </panel>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { Bracket, Rules } from "Runback/_types/"
import { Mutation, State, Action } from "vuex-class"
import type { ActionMethod } from "vuex"

@Component
export default class BracketPanel extends Vue {
  @State((state) => state.Runback.bracket) bracket!: Bracket
  @Mutation("set_bracket_stage") set_bracket_stage!: ActionMethod
  @Mutation("set_bracket_side") set_bracket_side!: ActionMethod
  @Mutation("set_grand_final_side") set_grand_final_side!: ActionMethod
  @Mutation("set_custom_progress") set_custom_progress!: ActionMethod
  @Mutation("set_custom_progress_enabled")
  set_custom_progress_enabled!: ActionMethod

  readonly rules = new Rules()

  get bracket_stage(): number {
    return this.bracket.bracket_stage
  }

  set bracket_stage(v: number) {
    this.set_bracket_stage(v)
  }

  get bracket_side(): number {
    return this.bracket.bracket_side
  }

  set bracket_side(v: number) {
    this.set_bracket_side(v)
  }

  get grand_final_side(): number {
    return this.bracket.grand_final_side
  }

  set grand_final_side(v: number) {
    this.set_grand_final_side(v)
  }

  get custom_progress(): string {
    return this.bracket.custom_progress
  }

  set custom_progress(v: string) {
    this.set_custom_progress(v)
  }

  get custom_progress_enabled(): boolean {
    return this.bracket.custom_progress_enabled
  }

  set custom_progress_enabled(v: boolean) {
    this.set_custom_progress_enabled(v)
  }

  get is_grand_final(): boolean {
    return this.rules.is_grand_final(this.bracket_stage)
  }
}
</script>
