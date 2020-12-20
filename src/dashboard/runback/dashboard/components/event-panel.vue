<template>
  <panel title="Tournament" icon="calendar">
    <v-autocomplete label="Event" outlined> </v-autocomplete>

    <v-row align="center" justify="center">
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark class="mx-2" v-bind="attrs" v-on="on" @click="edit_form">
            Set tournament
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline"> Set Tournament </span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="form_valid">
              <v-text-field
                v-model="edited.tourney_url"
                label="Tounrnament URL"
                :rules="[tourney_url_rules.url]"
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="close"> Cancel </v-btn>
            <v-btn color="primary" text @click="save" :disabled="!form_valid">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn @click="fetch_players" class="mx-2"> Fetch players </v-btn>
    </v-row>
  </panel>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import {
  Tournament,
  Api,
  Settings,
  ApiProvider,
} from "src/dashboard/runback/_types/"
import type { ActionMethod } from "vuex"
import { NodeCGBrowser } from "nodecg/types/browser"

@Component
export default class EventPanel extends Vue {
  @Ref("form") readonly form!: any
  @State((state) => state.Runback.tournament) tournament!: Tournament
  @State((state) => state.Runback.settings) settings!: Settings
  @Mutation("set_tourney_url") set_tourney_url!: ActionMethod
  @Mutation("set_tourney_id") set_tourney_id!: ActionMethod
  @Mutation("set_tourney_api") set_tourney_api!: ActionMethod

  readonly tourney_url_rules: any = {
    url: (v: string) => Api.validate_tourney_url(v) || "Invalid tournament URL",
  }

  dialog = false
  form_valid = false
  edited = {
    tourney_url: "",
  }

  created(): void {
    this.edited.tourney_url = this.tourney_url
  }

  fetch_players(): void {
    nodecg
      .sendMessage("fetch_tourney_data", null)
      .then((result: any) => {
        console.log("Fetch success")
      })
      .catch((error: any) => {
        console.error("Fetch failure", error)
      })
  }

  save(): void {
    this.tourney_url = this.edited.tourney_url
    this.tourney_api =
      Api.get_api_provider_from_url(this.tourney_url) || ApiProvider.Unset
    this.tourney_id =
      Api.get_tourney_id_from_url(this.tourney_api, this.tourney_url) || ""
    this.close()
  }

  close(): void {
    this.reset_validation()
    this.dialog = false
  }

  reset_validation(): void {
    this.form.resetValidation()
  }

  edit_form(): void {
    this.edited.tourney_url = this.tourney_url
    this.dialog = true
  }

  get tourney_url(): string {
    return this.tournament.tourney_url || ""
  }

  set tourney_url(v: string) {
    this.set_tourney_url(v)
  }

  get tourney_id(): string {
    return this.tournament.tourney_id
  }

  set tourney_id(v: string) {
    this.set_tourney_id(v)
  }

  get tourney_api(): ApiProvider {
    return this.tournament.tourney_api || ApiProvider.Unset
  }

  set tourney_api(v: ApiProvider) {
    this.set_tourney_api(v)
  }
}
</script>
