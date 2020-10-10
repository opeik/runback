<template>
  <v-app>
    <navigation />
    <v-main>
      <v-container fluid fill-height class="align-start">
        <router-view></router-view>
      </v-container>
    </v-main>
    <snackbar />
  </v-app>
</template>


<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
import { State, Mutation, Action } from "vuex-class"
import { EventBus } from "Runback/event-bus"
import { Updater } from "Runback/_types/"
import type { ActionMethod } from "vuex"
import Snackbar from "Runback/components/snackbar.vue"

@Component
export default class extends Vue {
  @State((state) => state.Runback.settings.dark_mode) dark_mode!: boolean

  @Watch("dark_mode")
  on_dark_mode_change(v: boolean): void {
    this.$vuetify.theme.dark = this.dark_mode
  }

  async mounted(): Promise<void> {
    this.$vuetify.theme.dark = this.dark_mode

    let r = await Updater.check_up_to_date()
    if (r.found_new_version) {
      Snackbar.create_snackbar("Runback is out of date", {}, "Update", "/about")
    }
  }
}
</script>
