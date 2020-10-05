<template>
  <v-app-bar app dark color="primary">
    <v-toolbar-title>
      {{ current_route_name }}
    </v-toolbar-title>
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class AppBar extends Vue {
  get current_route_name(): String {
    return this.$route.name || ""
  }
}
</script>
