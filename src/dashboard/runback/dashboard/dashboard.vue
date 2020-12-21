<template>
  <v-container>
    <v-row>
      <v-col cols="12" :md="6" class="d-flex flex-column">
        <scoreboard-panel />
      </v-col>
      <v-col cols="12" :md="6" class="d-flex flex-column">
        <bracket-panel />
      </v-col>
      <v-col cols="12" :md="6" class="d-flex flex-column">
        <commentary-panel />
      </v-col>
      <v-col cols="12" :md="6" class="d-flex flex-column">
        <event-panel />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class extends Vue {}
</script>
