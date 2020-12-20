<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-container>
        <v-list subheader>
          <v-subheader>Display</v-subheader>

          <v-list-item>
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="appearance"
                  :items="apperance_list"
                  item-text="text"
                  item-value="value"
                  label="Appearance"
                />
              </v-col>
            </v-row>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="flip_commentator_sides" color="primary" />
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>Flip commentator sides</v-list-item-title>
              <v-list-item-subtitle
                >Accounts for mirrored commentator camera feed
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list subheader>
          <v-subheader>APIs</v-subheader>
          <v-list-item>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="smash_gg_api_key"
                  :append-icon="
                    show_smash_gg_api_key ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  :type="show_smash_gg_api_key ? 'text' : 'password'"
                  :rules="[smash_gg_api_key_rules.min]"
                  label="Smash.gg API key"
                  counter
                  @click:append="show_smash_gg_api_key = !show_smash_gg_api_key"
                />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list subheader>
          <v-subheader>Misc</v-subheader>

          <v-list-item>
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  label="Default country"
                  v-model="default_country"
                  :items="countries"
                  item-text="name"
                  item-value="code"
                />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Watch, PropSync, Prop } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"
import {
  Settings,
  Api,
  ApiProvider,
  Appearance,
} from "src/dashboard/runback/_types/"
import type { ActionMethod } from "vuex"
import countryList from "country-list"

@Component
export default class extends Vue {
  @State((state) => state.Runback.settings) settings!: Settings
  @Mutation("set_dark_mode") set_dark_mode!: ActionMethod
  @Mutation("set_flip_commentator_sides")
  set_flip_commentator_sides!: ActionMethod
  @Mutation("set_default_country") set_default_country!: ActionMethod
  @Mutation("set_appearance") set_appearance!: ActionMethod
  @Mutation("set_live_dashboard_update")
  set_live_dashboard_update!: ActionMethod
  @Mutation("set_api_key") set_api_key!: ActionMethod

  show_smash_gg_api_key: boolean = false

  readonly countries = countryList.getData()
  readonly smash_gg_api_key_rules: any = {
    min: (v: string) => v.length === 32 || "Must be 32 characters",
  }
  readonly apperance_list = Object.values(Appearance)

  get dark_mode(): boolean {
    return this.settings.dark_mode
  }

  set dark_mode(v: boolean) {
    this.set_dark_mode(v)
  }

  get flip_commentator_sides(): boolean {
    return this.settings.flip_commentator_sides
  }

  set flip_commentator_sides(v: boolean) {
    this.set_flip_commentator_sides(v)
  }

  get default_country(): string {
    return this.settings.default_country
  }

  set default_country(v: string) {
    this.set_default_country(v)
  }

  get appearance(): Appearance {
    return this.settings.appearance
  }

  set appearance(v: Appearance) {
    this.set_appearance(v)
  }

  get live_dashboard_update(): boolean {
    return this.settings.live_dashboard_update
  }

  set live_dashboard_update(v: boolean) {
    this.set_live_dashboard_update(v)
  }

  get smash_gg_api_key(): string {
    return this.settings.api_keys[ApiProvider.Smash.text] || ""
  }

  set smash_gg_api_key(v: string) {
    console.log(v)
    this.set_api_key({ api: ApiProvider.Smash, api_key: v })
  }
}
</script>
