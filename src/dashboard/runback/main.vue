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
import { EventBus } from "src/dashboard/runback/event-bus"
import { Updater, Appearance } from "src/dashboard/runback/_types/"
import type { ActionMethod } from "vuex"
import Snackbar from "src/dashboard/runback/components/snackbar.vue"

@Component
export default class extends Vue {
  @State((state) => state.Runback.settings.appearance) appearance!: Appearance
  @State((state) => state.Runback.settings.dark_mode) dark_mode!: boolean
  @State((state) => state.Runback.settings.version) version!: string

  os_dark_mode = false

  @Watch("appearance")
  on_dark_mode_change(v: Appearance): void {
    this.$vuetify.theme.dark = this.should_use_dark_mode(v)
  }

  should_use_dark_mode(apperance: Appearance): boolean {
    switch (apperance.value) {
      case Appearance.Light.value:
        return false
      case Appearance.Dark.value:
        return true
      case Appearance.Auto.value:
        return this.os_dark_mode
      default:
        return false
    }
  }

  created(): void {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.os_dark_mode = true
    } else {
      this.os_dark_mode = false
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        if (event.matches) {
          console.log("dark")
          this.os_dark_mode = true
        } else {
          console.log("light")
          this.os_dark_mode = false
        }

        this.$vuetify.theme.dark = this.should_use_dark_mode(this.appearance)
      })
  }

  async mounted(): Promise<void> {
    let r = await Updater.check_up_to_date(this.version)
    if (r.found_new_version) {
      Snackbar.create_snackbar("Runback is out of date", {}, "Update", "/about")
    }
  }
}
</script>
