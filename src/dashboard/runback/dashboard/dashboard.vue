<template>
  <v-row>
    <v-col cols="12" :md="6" class="d-flex flex-column">
      <scoreboard-panel />
    </v-col>
    <v-col cols="12" :md="6" class="d-flex flex-column">
      <tournament-panel />
    </v-col>
    <v-col cols="12" :md="6" class="d-flex flex-column">
      <commentary-panel />
    </v-col>
    <v-col cols="12" :md="6" class="d-flex flex-column">
      <event-panel />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
// import { State, Mutation } from 'vuex-class';
// import { State2Way } from 'vuex-class-state2way';

@Component
export default class Dashboard extends Vue {}
</script>
