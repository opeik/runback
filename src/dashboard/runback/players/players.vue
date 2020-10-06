<template>
  <v-row>
    <v-col>
      <v-card>
        <v-data-table
          :headers="headers"
          :items="players_array"
          :search="search"
          :items-per-page="15"
          sort-by="gamertag"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-row>
                <v-col cols="12" sm="9" md="6">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mt-1"
                    v-bind="attrs"
                    v-on="on"
                  >
                    New Player
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ form_title }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-form ref="form" v-model="form_valid">
                      <v-text-field
                        v-model="edited_item.gamertag"
                        label="Gamertag"
                        :rules="gamertag_rules"
                      ></v-text-field>
                      <v-text-field
                        v-model="edited_item.name"
                        label="Name"
                        :rules="name_rules"
                      ></v-text-field>
                      <v-text-field
                        v-model="edited_item.country"
                        label="Country"
                        :rules="country_rules"
                      ></v-text-field>
                      <v-text-field
                        v-model="edited_item.team"
                        label="Team"
                      ></v-text-field>
                      <v-text-field
                        v-model="edited_item.twitter"
                        label="Twitter"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="close"> Cancel </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="save"
                      :disabled="!form_valid"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialog_delete" max-width="500px">
                <v-card>
                  <v-card-title class="headline"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="close_delete"
                      >Cancel</v-btn
                    >
                    <v-btn color="primary" text @click="delete_item_confirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="edit_item(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="delete_item(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator"
import { State2Way } from "vuex-class-state2way"
import { Mutation, Action } from "vuex-class"
import { Player, Players } from "Runback/_types/"

@Component
export default class extends Vue {
  @Ref("form") readonly form!: any
  @State2Way("set_players", "players") players!: Players
  @Mutation("set_player") set_player: any
  @Mutation("delete_player") delete_player: any

  dialog: boolean = false
  dialog_delete: boolean = false
  form_valid: boolean = false
  search: string = ""
  headers = [
    { text: "Gamertag", value: "gamertag" },
    { text: "Name", value: "name" },
    { text: "Country", value: "country" },
    { text: "Team", value: "team" },
    { text: "Twitter", value: "twitter" },
    { text: "Actions", value: "actions", sortable: false },
  ]

  edited_id: string = ""
  edited_item: Player = new Player()
  readonly default_item: Player = new Player()

  gamertag_rules = [(v: string) => !!v || "Gamertag is required"]
  name_rules = [(v: string) => !!v || "Name is required"]
  country_rules = [(v: string) => !!v || "Country is required"]

  get players_array(): Player[] {
    return Object.values(this.players)
  }

  get form_title(): string {
    return this.edited_id.length === 0 ? "New player" : "Edit player"
  }

  @Watch("dialog")
  on_dialog_change(val: String): void {
    val || this.close()
  }

  @Watch("dialog_delete")
  on_dialog_delete_change(val: String): void {
    val || this.close_delete()
  }

  edit_item(item: Player): void {
    this.edited_id = item.id
    this.edited_item = Object.assign({}, item)
    this.dialog = true
  }

  delete_item(item: Player): void {
    this.edited_id = item.id
    this.edited_item = Object.assign({}, item)
    this.dialog_delete = true
  }

  delete_item_confirm(): void {
    const delete_id = this.edited_id
    this.edited_id = ""
    this.close_delete()
    this.$nextTick(() => {
      this.delete_player(delete_id)
    })
  }

  close(): void {
    this.resetValidation()
    this.dialog = false
    this.$nextTick(() => {
      this.edited_item = Object.assign({}, this.default_item)
      this.edited_id = ""
    })
  }

  close_delete(): void {
    this.dialog_delete = false
    this.$nextTick(() => {
      this.edited_item = Object.assign({}, this.default_item)
      this.edited_id = ""
    })
  }

  save(): void {
    this.set_player(this.edited_item)
    this.close()
  }

  resetValidation(): void {
    this.form.resetValidation()
  }
}
</script>
