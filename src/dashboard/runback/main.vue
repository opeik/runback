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
import { Update } from "Runback/_types/"
import type { ActionMethod } from "vuex"

@Component
export default class extends Vue {
  @State((state) => state.Runback.settings.dark_mode) dark_mode!: boolean
  @State((state) => state.Runback.update) update!: Update
  @Action("check_up_to_date") check_up_to_date!: ActionMethod

  @Watch("dark_mode")
  on_dark_mode_change(v: boolean): void {
    this.$vuetify.theme.dark = this.dark_mode
  }

  async mounted(): Promise<void> {
    this.$vuetify.theme.dark = this.dark_mode
    await this.check_up_to_date()
    if (this.update.is_out_of_date) {
      this.create_snackbar(
        `New update available: ${this.update.new_version}`,
        {},
        "Update",
        "/about"
      )
    }
  }

  create_snackbar(
    text: string,
    color?: { button?: string; background?: string },
    label?: string,
    link?: string
  ) {
    EventBus.$emit("create-snackbar", {
      text: text,
      color: color,
      label: label,
      link: link,
    })
  }
}
</script>
