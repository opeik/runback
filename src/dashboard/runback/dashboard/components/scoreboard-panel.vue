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
      <v-dialog v-model="dialog" max-width="500px">
        <template #activator="{ on: on_dialog, attrs }">
          <v-tooltip :disabled="are_both_players_selected" bottom>
            <template #activator="{ on: on_tooltip }">
              <div v-on="{ ...on_tooltip }">
                <v-btn
                  class="mx-2"
                  v-bind="attrs"
                  v-on="{ ...on_dialog }"
                  :disabled="!are_both_players_selected"
                >
                  <v-icon left>mdi-pencil</v-icon>
                  Override
                </v-btn>
              </div>
            </template>
            <span>Both players must be selected</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Scoreboard override</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="form_valid">
              <v-row>
                <v-col cols="8">
                  <v-autocomplete
                    label="Player"
                    class="mb-n2"
                    v-model="edited_id"
                    item-text="gamertag"
                    item-value="id"
                    :items="players_array"
                    @input="edit_item"
                  />
                </v-col>
                <v-col cols="4">
                  <v-switch
                    v-model="should_override"
                    label="Enabled"
                    :disabled="!is_selected"
                  />
                </v-col>
              </v-row>
              <v-text-field
                v-model="edited_item.gamertag"
                label="Gamertag"
                :rules="gamertag_rules"
                :disabled="!is_selected"
              ></v-text-field>
              <v-text-field
                v-model="edited_item.name"
                label="Name"
                :disabled="!is_selected"
              ></v-text-field>
              <v-autocomplete
                label="Country"
                v-model="edited_item.country"
                item-text="name"
                item-value="code"
                :items="countries"
                :disabled="!is_selected"
              />
              <v-text-field
                v-model="edited_item.team"
                label="Team"
                :disabled="!is_selected"
              ></v-text-field>
              <v-text-field
                v-model="edited_item.twitter"
                label="Twitter"
                :disabled="!is_selected"
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" text @click="close"> Close </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="clear" :disabled="!is_selected">
              Reset
            </v-btn>
            <v-btn color="primary" text @click="close"> Cancel </v-btn>
            <v-btn
              color="primary"
              text
              @click="save"
              :disabled="!is_selected || !form_valid"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import { Vue, Component, Prop, Ref, Watch } from "vue-property-decorator"
import { Mutation, State, Action } from "vuex-class"
import {
  Player,
  PlayersReplicant,
  PlayerScore,
  ScoreboardReplicant,
} from "src/dashboard/runback/_types/"
import type { ActionMethod } from "vuex"
import countryList from "country-list"

@Component
export default class ScoreboardPanel extends Vue {
  @Ref("form") readonly form!: any
  @State((state) => state.Runback.scoreboard) scoreboard!: ScoreboardReplicant
  @State((state) => state.Runback.players) players!: PlayersReplicant
  @Mutation("set_scoreboard_score") set_scoreboard_score!: ActionMethod
  @Mutation("set_scoreboard_should_override")
  set_scoreboard_should_override!: ActionMethod
  @Mutation("set_scoreboard_override")
  set_scoreboard_override!: ActionMethod
  @Action("swap_players") swap_players!: ActionMethod
  @Action("reset_score") reset_score!: ActionMethod

  readonly default_item: Player = new Player()
  readonly countries = countryList.getData()

  edited_id: string = ""
  num_players: number = 0
  dialog: boolean = false
  form_valid: boolean = false
  edited_item: Player = new Player()

  gamertag_rules = [(v: string) => !!v || "Gamertag is required"]
  country_rules = [(v: string) => !!v || "Country is required"]

  get selected_player_num(): number {
    return this.selected_ids.indexOf(this.edited_id)
  }

  get selected_ids(): string[] {
    return this.scoreboard.scores.map((v: PlayerScore) => v.player_id)
  }

  get is_selected(): boolean {
    return this.edited_id.length !== 0
  }

  get should_override(): boolean {
    if (!this.is_selected) {
      return false
    }

    return this.scoreboard.overrides[this.selected_player_num].should_override
  }

  get are_both_players_selected(): boolean {
    let selected = true

    this.scoreboard.scores.forEach((e) => {
      if (e.player_id.length === 0) {
        selected = false
      }
    })

    return selected
  }

  set should_override(v: boolean) {
    this.set_scoreboard_should_override({
      player_num: this.selected_player_num,
      should_override: v,
    })
  }

  get players_array(): Player[] {
    return Object.values(this.players).filter((v: Player) =>
      this.selected_ids.includes(v.id)
    )
  }

  edit_item(id: string): void {
    this.edited_id = id

    if (
      this.scoreboard.overrides[this.selected_player_num].override.gamertag
        .length === 0
    ) {
      this.edited_item = Object.assign({}, this.players[this.edited_id])
    } else {
      this.edited_item = Object.assign(
        {},
        this.scoreboard.overrides[this.selected_player_num].override
      )
    }
  }

  mounted(): void {
    this.num_players = this.scoreboard.scores.length
  }

  swap(): void {
    this.swap_players()
  }

  reset(): void {
    this.reset_score()
  }

  close(): void {
    this.reset_validation()
    this.dialog = false
    this.$nextTick(() => {
      this.edited_item = Object.assign({}, this.default_item)
      this.edited_id = ""
    })
  }

  save(): void {
    this.set_scoreboard_override({
      player_num: this.selected_player_num,
      override: this.edited_item,
    })
  }

  reset_validation(): void {
    this.form.resetValidation()
  }

  clear(): void {
    this.edited_item = Object.assign({}, this.players[this.edited_id])
  }
}
</script>
