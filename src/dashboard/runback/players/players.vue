<template>
  <v-row>
    <v-col>
      <v-container>
        <v-data-table
          v-model="selected_items"
          :headers="headers"
          :items="players_array"
          :search="search"
          :items-per-page="10"
          sort-by="gamertag"
          show-select
        >
          <template v-slot:item.country="{ item }">
            {{ country_name(item.country) }}
          </template>
          <template v-slot:item.gamertag_latin="{ item }">
            {{
              item.gamertag_latin.length > 0
                ? item.gamertag_latin
                : item.gamertag_latin_generated
            }}
          </template>

          <template v-slot:top>
            <v-toolbar flat>
              <v-row>
                <v-col cols="12" sm="11" md="10">
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

              <v-btn
                class="mx-2"
                @click="delete_selected"
                :disabled="!are_items_selected"
                v-if="!is_mobile"
                >Delete</v-btn
              >

              <v-btn
                class="mx-2"
                @click="export_players"
                :disabled="!are_items_selected"
                v-if="!is_mobile"
                >Export</v-btn
              >

              <v-divider vertical class="mx-2" />

              <v-btn
                class="mx-2"
                @click="input_upload.click()"
                v-if="!is_mobile"
                >Import</v-btn
              >

              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mt-1 ml-2"
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
                        v-model="edited_item.gamertag_latin"
                        :placeholder="edited_item.gamertag_latin_generated"
                        label="Gamertag (Latin)"
                        :disabled="!non_latin_regex.test(edited_item.gamertag)"
                      ></v-text-field>

                      <v-text-field
                        v-model="edited_item.name"
                        label="Name"
                      ></v-text-field>

                      <v-autocomplete
                        label="Country"
                        v-model="edited_item.country"
                        :items="countries"
                        :rules="country_rules"
                        item-text="name"
                        item-value="code"
                      />

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
      </v-container>
    </v-col>

    <input
      v-show="false"
      ref="input_upload"
      type="file"
      accept="application/json"
      @change="import_players($event.target.files[0])"
    />
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator"
import { Mutation, State, Action } from "vuex-class"
import {
  Player,
  PlayersReplicant,
  SettingsReplicant,
} from "src/dashboard/runback/_types/"
import { saveAs } from "file-saver"
import type { ActionMethod } from "vuex"
import { EventBus } from "src/dashboard/runback/event-bus"
import Snackbar from "src/dashboard/runback/components/snackbar.vue"
import countryList from "country-list"
import clone from "clone"
import XRegExp from "xregexp"

@Component
export default class extends Vue {
  @Ref("form") readonly form!: any
  @Ref("input_upload") readonly input_upload!: HTMLInputElement
  @State((state) => state.Runback.players) players!: PlayersReplicant
  @State((state) => state.Runback.settings) settings!: SettingsReplicant
  @Mutation("set_player") set_player!: ActionMethod
  @Mutation("create_player") create_player!: ActionMethod
  @Mutation("delete_player") delete_player!: ActionMethod
  @Action("import_players") import_players_mutation!: ActionMethod

  readonly countries = countryList.getData()
  readonly non_latin_regex = XRegExp("[^\\p{Latin}\\p{Common}\\p{Inherited}]")

  dialog: boolean = false
  dialog_delete: boolean = false
  form_valid: boolean = false
  search: string = ""
  headers = [
    { text: "Gamertag", value: "gamertag" },
    { text: "Latin", value: "gamertag_latin" },
    { text: "Name", value: "name" },
    { text: "Country", value: "country" },
    { text: "Team", value: "team" },
    { text: "Actions", value: "actions", sortable: false },
  ]

  edited_id: string = ""
  edited_item: Player = new Player()
  selected_items: Player[] = []
  default_item: Player = new Player()

  mounted(): void {
    this.default_item.country = this.settings.default_country
    this.edited_item = this.default_item
  }

  gamertag_rules = [(v: string) => !!v || "Gamertag is required"]
  country_rules = [(v: string) => !!v || "Country is required"]

  get players_array(): Player[] {
    return Object.values(this.players)
  }

  get form_title(): string {
    return this.is_new_player ? "New player" : "Edit player"
  }

  get is_new_player(): boolean {
    return this.edited_id.length === 0
  }

  get are_items_selected(): boolean {
    return this.selected_items.length !== 0
  }

  get is_mobile(): boolean {
    return this.$vuetify.breakpoint.mobile
  }

  country_name(code: string) {
    if (code.length === 0) {
      return ""
    } else {
      return countryList.getName(code)
    }
  }

  @Watch("dialog")
  on_dialog_change(val: String): void {
    val || this.close()
  }

  @Watch("dialog_delete")
  on_dialog_delete_change(val: String): void {
    val || this.close_delete()
  }

  delete_selected(): void {
    for (const player_id of this.selected_items) {
      this.$nextTick(() => {
        this.delete_player(player_id.id)
      })
    }

    this.selected_items = []
  }

  import_players(file: File): void {
    const file_reader = new FileReader()

    file_reader.onload = (event) => {
      file_reader.abort()

      try {
        let json = event!.target!.result!.toString()
        let players: PlayersReplicant[] = JSON.parse(json)
        this.import_players_mutation(players)
        Snackbar.create_snackbar("Successfully imported players")
      } catch (e) {
        Snackbar.create_snackbar(
          `Error occured importing players: ${e.message}`,
          {
            background: "error",
          }
        )

        console.error(e)
      }
    }

    file_reader.onerror = (event) => {
      Snackbar.create_snackbar("Error occurred while reading players", {
        background: "error",
      })
    }

    file_reader.readAsText(file)
    this.input_upload.value = ""
  }

  export_players(): void {
    let json = JSON.stringify(this.selected_items)
    let blob = new Blob([json], { type: "text/plain;charset=utf-8" })
    saveAs(blob, "Exported players.json")
    Snackbar.create_snackbar("Successfully exported players")
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
    this.reset_validation()
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
    const edited_item = this.edited_item
    const is_new_player = this.is_new_player

    if (this.non_latin_regex.test(edited_item.gamertag)) {
      nodecg
        .sendMessage("transliterate", edited_item.gamertag)
        .then((result: any) => {
          edited_item.gamertag_latin_generated = result

          if (is_new_player) {
            this.create_player(edited_item)
          } else {
            this.set_player(edited_item)
          }
        })
    } else {
      edited_item.gamertag_latin_generated = ""

      if (is_new_player) {
        this.create_player(edited_item)
      } else {
        this.set_player(edited_item)
      }
    }

    this.close()
  }

  reset_validation(): void {
    this.form.resetValidation()
  }
}
</script>
