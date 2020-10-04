<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text>
          <v-switch label="Dark mode" v-model="dark_mode"></v-switch>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"

import { Settings as SettingsType } from "../../../../schemas"

@Component
export default class Settings extends Vue {
  @State2Way("set_dark_mode", "settings.dark_mode") dark_mode: any
}
</script>
