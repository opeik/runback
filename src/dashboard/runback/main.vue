<template>
  <v-app>
    <navigation />
    <app-bar />
    <v-main>
      <v-container fluid fill-height class="align-start">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
// import { State, Mutation } from 'vuex-class';
// import { State2Way } from 'vuex-class-state2way';

@Component
export default class extends Vue {}
</script>
