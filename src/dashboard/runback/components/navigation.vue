<template>
  <v-navigation-drawer
    app
    permanent
    :mini-variant="should_draw_mini"
    class="pt-4"
    color="grey lighten-3"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Runback</v-list-item-title>
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
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"

@Component
export default class Navigation extends Vue {
  items = [
    { title: "Dashboard", icon: "mdi-view-dashboard", link: "/" },
    { title: "Players", icon: "mdi-account-group", link: "players" },
    { title: "Settings", icon: "mdi-cog", link: "settings" },
  ]

  get should_draw_mini(): boolean {
    return this.$vuetify.breakpoint.mdAndDown
  }
}
</script>
