<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <v-progress-circular
              :size="100"
              :width="7"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-col>
          <v-col cols="12" class="text-center mt-6 mb-n4">
            <span class="text-h4"> {{ load_quote }} </span>
          </v-col>
          <v-col cols="12" class="text-center">
            <span class="text-h6"> Starting server... </span>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class extends Vue {
  load_quotes = [
    "Parrying your super",
    "Waking up with Dragon Install",
    "Explaining the DHC glitch",
    "Complaining about Paul's damage",
  ]

  get_random_int(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  get load_quote(): string {
    return this.load_quotes[this.get_random_int(0, this.load_quotes.length - 1)]
  }
}
</script>
