<template>
  <panel title="Event" icon="calendar">
    <v-form v-model="valid">
      <v-text-field
        v-model="local.tourney_url"
        label="Tournament URL"
        :rules="[tourney_url_rules.url]"
        required
      ></v-text-field>
      <v-autocomplete label="Event" outlined> </v-autocomplete>
    </v-form>

    <v-row align="center" justify="center">
      <v-btn @click="fetch_players">
        <v-icon left>mdi-cloud-download</v-icon>
        Fetch players
      </v-btn>
    </v-row>
  </panel>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import {
  Event,
  Api,
  Settings,
  ApiProvider,
} from "src/dashboard/runback/_types/"
import type { ActionMethod } from "vuex"
import { NodeCGBrowser } from "nodecg/types/browser"

@Component
export default class EventPanel extends Vue {
  @State((state) => state.Runback.event) event!: Event
  @State((state) => state.Runback.settings) settings!: Event
  @Mutation("set_tourney_url") set_tourney_url!: ActionMethod
  @Mutation("set_tourney_id") set_tourney_id!: ActionMethod

  readonly tourney_url_rules: any = {
    url: (v: string) => Api.validate_tourney_url(v) || "Invalid tournament URL",
  }

  valid = false
  local = {
    tourney_url: "",
  }

  created(): void {
    this.local.tourney_url = this.tourney_url
  }

  fetch_players(): void {
    nodecg
      .sendMessage("fetch_tourney_data", null)
      .then((result: any) => {
        console.log(result)
      })
      .catch((error: any) => {
        console.error(error)
      })
  }

  get tourney_url(): string {
    return this.event.tourney_url
  }

  set tourney_url(v: string) {
    this.set_tourney_url(v)
  }

  get tourney_id(): string {
    return this.event.tourney_id
  }

  set tourney_id(v: string) {
    this.set_tourney_id(v)
  }

  @Watch("local.tourney_url")
  on_tourney_url_change(): void {
    const tourney_url = this.tourney_url

    console.log(tourney_url)

    if (this.valid) {
      console.log("Is valid")
      this.tourney_url = this.local.tourney_url
    }
  }
}
</script>
