<template>
  <v-navigation-drawer app permanent :mini-variant="should_draw_mini">
    <v-list-item>
      <v-list-item-icon class="mr-4">
        <v-icon :size="icon_size">$logo</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title class="title">Runback</v-list-item-title>
        <v-list-item-subtitle>
          By <a :href="twitter">opeik</a>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item link v-for="item in items" :key="item.title" :to="item.link">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class Navigation extends Vue {
  readonly twitter: string = "https://twitter.com/iamopeik"

  items = [
    { title: "Dashboard", icon: "mdi-view-dashboard", link: "/" },
    { title: "Players", icon: "mdi-account-group", link: "players" },
    { title: "Graphics", icon: "mdi-palette", link: "graphics" },
    { title: "Settings", icon: "mdi-cog", link: "settings" },
    { title: "About", icon: "mdi-information", link: "about" },
  ]

  get should_draw_mini(): boolean {
    return this.$vuetify.breakpoint.mdAndDown
  }

  get icon_size(): number {
    return this.$vuetify.breakpoint.mdAndDown ? 24 : 72
  }
}
</script>
