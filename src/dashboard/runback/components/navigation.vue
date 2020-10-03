<template>
  <v-navigation-drawer
    app
    class="pt-4"
    color="grey lighten-3"
    mini-variant
    permanent
    :mini-variant-width="70"
  >
    <v-btn
      class="d-block text-center mx-auto mb-4"
      fab
      dark
      retain-focus-on-click="true"
      color="grey darken-3"
    >
      <v-icon dark>mdi-home</v-icon>
    </v-btn>

    <v-btn
      class="d-block text-center mx-auto mb-4"
      fab
      dark
      color="grey darken-3"
    >
      <v-icon dark>mdi-account-details</v-icon>
    </v-btn>

    <v-btn
      class="d-block text-center mx-auto mb-4"
      fab
      dark
      color="grey darken-3"
    >
      <v-icon dark>mdi-cog</v-icon>
    </v-btn>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"

@Component
export default class Navigation extends Vue {}
</script>
