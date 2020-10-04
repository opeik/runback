<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text>
          <v-switch label="Dark mode" v-model="dark_mode"></v-switch>
          <v-row>
            <v-col cols="12" sm="8" md="4">
              <v-text-field
                v-model="smash_gg_api_key"
                :append-icon="show_smash_gg_api_key ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show_smash_gg_api_key ? 'text' : 'password'"
                :rules="[smash_gg_api_key_rules.min]"
                label="Smash.gg API key"
                counter
                @click:append="show_smash_gg_api_key = !show_smash_gg_api_key"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"

import { Settings as SettingsType } from "Runback/../../schemas"

@Component
export default class Settings extends Vue {
  @State2Way("set_dark_mode", "settings.dark_mode") dark_mode!: boolean
  @State2Way("set_smash_gg_api_key", "settings.smash_gg_api_key")
  smash_gg_api_key!: string
  show_smash_gg_api_key: boolean = false
  smash_gg_api_key_rules: any = {
    min: (v: string) => v.length == 32 || "Must equal 32 characters",
  }
}
</script>
