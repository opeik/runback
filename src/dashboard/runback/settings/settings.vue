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
// import { State, Mutation } from 'vuex-class';
// import { State2Way } from 'vuex-class-state2way';

@Component
export default class Settings extends Vue {
  dark_mode = false

  @Watch("dark_mode")
  on_dark_mode_change(val: boolean): void {
    this.$vuetify.theme.dark = this.dark_mode
  }
}
</script>
