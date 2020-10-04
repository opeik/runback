<template>
  <v-row>
    <v-col>
      <v-card>
        <v-data-table
          :headers="headers"
          :items="players"
          :search="search"
          sort-by="gamertag"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>

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
                    New Item
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ form_title }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="edited_item.gamertag"
                            label="Gamertag"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="edited_item.name"
                            label="Name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="edited_item.country"
                            label="Country"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="edited_item.team"
                            label="Team"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="edited_item.twitter"
                            label="Twitter"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
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
                    <v-btn color="blue darken-1" text @click="close_delete"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="delete_item_confirm"
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
import { Vue, Component, Watch } from "vue-property-decorator"
// import { State, Mutation } from 'vuex-class';
// import { State2Way } from 'vuex-class-state2way';

@Component
export default class Players extends Vue {
  dialog = false
  dialog_delete = false
  headers = [
    { text: "Gamertag", value: "gamertag" },
    { text: "Name", value: "name" },
    { text: "Country", value: "country" },
    { text: "Team", value: "team" },
    { text: "Twitter", value: "twitter" },
    { text: "Actions", value: "actions", sortable: false },
  ]

  search: String = ""

  players: any[] = []
  edited_index = -1
  edited_item = {
    name: "",
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
  }
  default_item = {
    name: "",
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
  }

  get form_title(): String {
    return this.edited_index === -1 ? "New Item" : "Edit Item"
  }

  @Watch("dialog")
  on_dialog_change(val: String): void {
    val || this.close()
  }

  @Watch("dialog_delete")
  on_dialog_delete_change(val: String): void {
    val || this.close_delete()
  }

  edit_item(item: any) {
    this.edited_index = this.players.indexOf(item)
    this.edited_item = Object.assign({}, item)
    this.dialog = true
  }

  delete_item(item: any) {
    this.edited_index = this.players.indexOf(item)
    this.edited_item = Object.assign({}, item)
    this.dialog_delete = true
  }

  delete_item_confirm() {
    this.players.splice(this.edited_index, 1)
    this.close_delete()
  }

  close() {
    this.dialog = false
    this.$nextTick(() => {
      this.edited_item = Object.assign({}, this.default_item)
      this.edited_index = -1
    })
  }

  close_delete() {
    this.dialog_delete = false
    this.$nextTick(() => {
      this.edited_item = Object.assign({}, this.default_item)
      this.edited_index = -1
    })
  }

  save() {
    if (this.edited_index > -1) {
      Object.assign(this.players[this.edited_index], this.edited_item)
    } else {
      this.players.push(this.edited_item)
    }
    this.close()
  }
}
</script>
