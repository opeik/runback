<template>
  <v-app>
    <navigation />
    <v-main>
      <v-container fluid fill-height class="align-start">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
import { State } from "vuex-class"

@Component
export default class extends Vue {
  @State((state) => state.Runback.settings.dark_mode) dark_mode!: boolean

  @Watch("dark_mode")
  on_dark_mode_change(val: boolean): void {
    this.$vuetify.theme.dark = this.dark_mode
  }

  mounted(): void {
    this.$vuetify.theme.dark = this.dark_mode
  }
}
</script>
