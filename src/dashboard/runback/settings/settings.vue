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
                  label="Appearance"
                  return-object
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
                >Accounts for horizontally mirrored video feed
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="auto_transliteration" color="primary" />
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>Auto gamertag Latinization</v-list-item-title>
              <v-list-item-subtitle
                >Display Latin versions of non-Latin gamertags
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list subheader>
          <v-subheader>APIs</v-subheader>
          <v-list-item>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="mx-2" v-bind="attrs" v-on="on" @click="edit_form">
                  Set API keys
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline"> API keys </span>
                </v-card-title>

                <v-card-text>
                  <v-form ref="form" v-model="form_valid">
                    <v-text-field
                      v-model="edited.api_keys.smash"
                      :append-icon="
                        show_smash_gg_api_key ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      :type="show_smash_gg_api_key ? 'text' : 'password'"
                      :rules="[smash_gg_api_key_rules.min]"
                      label="Smash.gg"
                      counter
                      @click:append="
                        show_smash_gg_api_key = !show_smash_gg_api_key
                      "
                    />
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
import {
  Vue,
  Component,
  Watch,
  PropSync,
  Prop,
  Ref,
} from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"
import {
  SettingsReplicant,
  Api,
  ApiProvider,
  Appearance,
} from "src/dashboard/runback/_types/"
import type { ActionMethod } from "vuex"
import countryList from "country-list"

@Component
export default class extends Vue {
  @Ref("form") readonly form!: any
  @State((state) => state.Runback.settings) settings!: SettingsReplicant
  @Mutation("set_dark_mode") set_dark_mode!: ActionMethod
  @Mutation("set_flip_commentator_sides")
  set_flip_commentator_sides!: ActionMethod
  @Mutation("set_default_country") set_default_country!: ActionMethod
  @Mutation("set_appearance") set_appearance!: ActionMethod
  @Mutation("set_live_dashboard_update")
  set_live_dashboard_update!: ActionMethod
  @Mutation("set_api_key") set_api_key!: ActionMethod
  @Mutation("set_auto_transliteration") set_transliteration!: ActionMethod

  show_smash_gg_api_key: boolean = false

  dialog = false
  form_valid = false
  edited = {
    api_keys: {
      smash: "",
    },
  }

  readonly countries = countryList.getData()
  readonly smash_gg_api_key_rules: any = {
    min: (v: string) => v.length === 32 || "Must be 32 characters",
  }
  readonly apperance_list = Object.values(Appearance)

  close(): void {
    this.reset_validation()
    this.dialog = false
    this.$nextTick(() => {
      this.edited.api_keys.smash = ""
    })
  }

  save(): void {
    this.smash_gg_api_key = this.edited.api_keys.smash
    this.close()
  }

  edit_form(): void {
    this.edited.api_keys.smash = this.smash_gg_api_key
    this.dialog = true
  }

  reset_validation(): void {
    this.form.resetValidation()
  }

  get dark_mode(): boolean {
    return this.settings.dark_mode
  }

  set dark_mode(v: boolean) {
    this.set_dark_mode(v)
  }

  get auto_transliteration(): boolean {
    return this.settings.auto_transliteration
  }

  set auto_transliteration(v: boolean) {
    this.set_transliteration(v)
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
    this.set_api_key({ api: ApiProvider.Smash, api_key: v })
  }
}
</script>
