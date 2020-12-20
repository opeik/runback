<template>
  <panel title="Bracket" icon="tournament">
    <v-autocomplete
      :items="bracket_stage_list"
      v-model="bracket_stage"
      label="Stage"
      item-text="text"
      item-value="value"
      required
    ></v-autocomplete>

    <v-autocomplete
      :items="bracket_side_list"
      v-model="bracket_side"
      label="Bracket side"
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
import { Vue, Component, Watch } from "vue-property-decorator"
import {
  BracketReplicant,
  Rules,
  Stage,
  Side,
} from "src/dashboard/runback/_types/"
import { Mutation, State, Action } from "vuex-class"
import type { ActionMethod } from "vuex"

@Component
export default class BracketPanel extends Vue {
  @State((state) => state.Runback.bracket) bracket!: BracketReplicant
  @Mutation("set_bracket_stage") set_bracket_stage!: ActionMethod
  @Mutation("set_bracket_side") set_bracket_side!: ActionMethod
  @Mutation("set_custom_progress") set_custom_progress!: ActionMethod
  @Mutation("set_custom_progress_enabled")
  set_custom_progress_enabled!: ActionMethod

  readonly rules = new Rules()

  get bracket_side_list(): Array<Side> {
    let tmp = this.is_grand_final
      ? (this.rules.grand_final_side_list as any)
      : (this.rules.side_list as any)

    return tmp.filter((e: Side) => e.value !== Stage.Unset.value)
  }

  get bracket_stage_list(): Array<Stage> {
    return this.rules.stage_list.filter((e) => e.value !== Stage.Unset.value)
  }

  get bracket_stage(): number {
    return this.bracket.stage
  }

  set bracket_stage(v: number) {
    this.set_bracket_stage(v)
  }

  get bracket_side(): number {
    return this.bracket.side
  }

  set bracket_side(v: number) {
    this.set_bracket_side(v)
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
    return this.bracket_stage === Stage.GrandFinal.value
  }

  @Watch("bracket.stage")
  on_bracket_stage_change(old_value: number, new_value: number): void {
    if (old_value === Stage.GrandFinal.value) {
      this.set_bracket_side(Side.Unset.value)
    } else if (
      old_value >= Stage.Unset.value &&
      old_value <= Stage.GrandFinal.value &&
      new_value === Stage.GrandFinal.value
    ) {
      this.set_bracket_side(Side.Unset.value)
    }
  }
}
</script>
