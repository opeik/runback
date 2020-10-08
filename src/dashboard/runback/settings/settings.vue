<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-text>
          <v-list subheader>
            <v-subheader>Display</v-subheader>
            <v-list-item-group>
              <v-list-item @click="dark_mode = !dark_mode">
                <v-list-item-action>
                  <v-switch v-model="dark_mode" color="primary"></v-switch>
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title>Dark mode</v-list-item-title>
                  <v-list-item-subtitle
                    >For late night broadcasting</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-list flat subheader>
            <v-subheader>Smash.gg</v-subheader>
            <v-list-item>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="smash_gg_api_key"
                    :append-icon="
                      show_smash_gg_api_key ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :type="show_smash_gg_api_key ? 'text' : 'password'"
                    :rules="[smash_gg_api_key_rules.min]"
                    label="Smash.gg API key"
                    counter
                    @click:append="
                      show_smash_gg_api_key = !show_smash_gg_api_key
                    "
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Watch, PropSync, Prop } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"
import { Settings } from "Runback/_types/"
import type { ActionMethod } from "vuex"

@Component
export default class extends Vue {
  @State((state) => state.Runback.settings) settings!: Settings
  @Mutation("set_dark_mode") set_dark_mode!: ActionMethod
  @Mutation("set_live_dashboard_update")
  set_live_dashboard_update!: ActionMethod
  @Mutation("set_smash_gg_api_key") set_smash_gg_api_key!: ActionMethod

  show_smash_gg_api_key: boolean = false
  smash_gg_api_key_rules: any = {
    min: (v: string) => v.length == 32 || "Must be 32 characters",
  }

  get dark_mode(): boolean {
    return this.settings.dark_mode
  }

  set dark_mode(v: boolean) {
    this.set_dark_mode(v)
  }

  get live_dashboard_update(): boolean {
    return this.settings.live_dashboard_update
  }

  set live_dashboard_update(v: boolean) {
    this.set_live_dashboard_update(v)
  }

  get smash_gg_api_key(): string {
    return this.settings.smash_gg_api_key
  }

  set smash_gg_api_key(v: string) {
    this.set_dark_mode(v)
  }
}
</script>
