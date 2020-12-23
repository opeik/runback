<template>
  <panel title="Tournament" icon="calendar">
    <v-row align="center" justify="center" class="mb-8 mt-4">
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mx-2"
            v-bind="attrs"
            v-on="on"
            @click="edit_form"
            :disabled="is_fetching_entrants()"
            :loading="is_fetching_events()"
          >
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
                :rules="[tourney_url_rules.url, tourney_url_rules.api]"
                :disabled="is_tournament_url_disabled"
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
              :disabled="!form_valid || !is_edited_url_valid"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-tooltip bottom :disabled="!is_fetch_button_disabled">
        <template v-slot:activator="{ on }">
          <div v-on="on" class="d-inline-block">
            <v-btn
              :loading="is_fetching_entrants()"
              @click="fetch_entrants"
              class="mx-2"
              :disabled="is_fetch_button_disabled"
            >
              Fetch entrants
            </v-btn>
          </div>
        </template>
        <span>Tournament must be set</span>
      </v-tooltip>
    </v-row>

    <v-divider class="mb-5" />

    <span class="text-h6">
      {{ tournament.tourney.name }}
    </span>

    <v-autocomplete
      label="Event"
      v-model="event_id"
      :items="event_list"
      item-text="name"
      item-value="id"
    />
  </panel>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import {
  TournamentReplicant,
  Api,
  SettingsReplicant,
  ApiProvider,
  Event,
  ApiReplicant,
} from "src/dashboard/runback/_types/"
import type { ActionMethod } from "vuex"
import { NodeCGBrowser } from "nodecg/types/browser"
import Snackbar from "src/dashboard/runback/components/snackbar.vue"

@Component
export default class EventPanel extends Vue {
  @Ref("form") readonly form!: any
  @State((state) => state.Runback.tournament) tournament!: TournamentReplicant
  @State((state) => state.Runback.settings) settings!: SettingsReplicant
  @State((state) => state.Runback.api) api!: ApiReplicant
  @Mutation("set_tourney_url") set_tourney_url!: ActionMethod
  @Mutation("set_tourney_id") set_tourney_id!: ActionMethod
  @Mutation("set_tourney_api") set_tourney_api!: ActionMethod
  @Mutation("set_event_id") set_event_id!: ActionMethod

  readonly tourney_url_rules: any = {
    url: (v: string) => {
      const api_provider = Api.get_api_provider_from_url(v)

      if (api_provider !== undefined) {
        const tourney_id = Api.get_tourney_id_from_url(api_provider, v)

        if (tourney_id !== undefined) {
          return true
        } else {
          return `Invalid tournament URL for ${api_provider.text}`
        }
      } else {
        return "Invalid tournament URL"
      }
    },
    api: (v: string) => {
      if (this.is_api_key_set_for_api(v)) {
        return true
      } else {
        const api_provider = Api.get_api_provider_from_url(v)

        if (api_provider !== undefined) {
          return `API key unset for ${api_provider.text}`
        } else {
          return "Unsupported API"
        }
      }
    },
  }

  dialog = false
  form_valid = false
  edited = {
    tourney_url: "",
  }

  is_fetching_events(): boolean {
    return this.api.fetching.events
  }

  is_fetching_entrants(): boolean {
    return this.api.fetching.entrants
  }

  entrants_fetch_progress(): number {
    return this.api.progress.entrants
  }

  events_fetch_progress(): number {
    return this.api.progress.events
  }

  get event_list(): Array<Event> {
    return this.tournament.tourney.events
  }

  created(): void {
    this.edited.tourney_url = this.tourney_url
  }

  fetch_entrants(): void {
    nodecg
      .sendMessage("fetch_tourney_entrants", null)
      .then((result: any) => {
        Snackbar.create_snackbar(
          `Successfully fetched ${result} tournament entrants`
        )
      })
      .catch((error: any) => {
        Snackbar.create_snackbar(
          `Failed to fetch entrants: ${JSON.stringify(error)}`,
          {
            background: "error",
          }
        )
      })
  }

  save(): void {
    const url = this.edited.tourney_url
    const api = Api.get_api_provider_from_url(url) || ApiProvider.Unset
    const id = Api.get_tourney_id_from_url(api, url) || ""

    this.tourney_url = this.edited.tourney_url
    this.tourney_api = api
    this.tourney_id = id

    nodecg
      .sendMessage("fetch_tourney_events", {
        tourney_api: api,
        tourney_id: id,
      })
      .then((result: any) => {
        Snackbar.create_snackbar(
          `Successfully fetched ${result} tournament events`
        )
      })
      .catch((error: any) => {
        Snackbar.create_snackbar(
          `Failed to fetch tournament events: ${JSON.stringify(error)}`,
          {
            background: "error",
          }
        )
      })

    this.close()
  }

  close(): void {
    this.reset_validation()
    this.dialog = false
    this.$nextTick(() => {
      this.edited.tourney_url = ""
    })
  }

  reset_validation(): void {
    this.form.resetValidation()
  }

  edit_form(): void {
    this.edited.tourney_url = this.tourney_url
    this.dialog = true
  }

  is_api_key_set_for_api(url: string): boolean {
    const api_provider = Api.get_api_provider_from_url(url)

    if (api_provider !== undefined) {
      const api_key = this.settings.api_keys[api_provider.text]

      if (api_key !== undefined && api_key.length > 0) {
        return true
      }
    }

    return false
  }

  get is_edited_url_valid(): boolean {
    const api = this.edited_api
    const api_key = this.settings.api_keys[api.text]

    if (api_key !== undefined && api_key.length > 0) {
      return true
    }

    return false
  }

  get is_tournament_url_disabled(): boolean {
    return false
  }

  get is_fetch_button_disabled(): boolean {
    return !(
      this.tournament.tourney_api !== ApiProvider.Unset &&
      this.tournament.tourney_id.length > 0 &&
      this.tournament.tourney.name.length > 0
    )
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

  get edited_api(): ApiProvider {
    return (
      Api.get_api_provider_from_url(this.edited.tourney_url) ||
      ApiProvider.Unset
    )
  }

  get tourney_api(): ApiProvider {
    return this.tournament.tourney_api || ApiProvider.Unset
  }

  set tourney_api(v: ApiProvider) {
    this.set_tourney_api(v)
  }

  get event_id(): string {
    return this.tournament.event_id || ""
  }

  set event_id(v: string) {
    this.set_event_id(v)
  }
}
</script>
