<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <v-progress-circular
              :size="50"
              :width="5"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-col>
          <v-col cols="12" class="text-center mt-2 mb-n6">
            <span class="text-subtitle-1"> {{ load_quote }} </span>
          </v-col>
          <v-col cols="12" class="text-center">
            <span class="text-subtitle-2 font-italic"> Loading... </span>
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
    // Misc
    "Demanding rollback netcode",
    "Disrespecting your plus frames",
    "Completing the download",
    // Street Fighter
    "Parrying your super",
    "Waking up dp'ing",
    "Fighting like gentlemen",
    "Fighting a new rival",
    "Keeping it classy",
    "Protecting Russia's skies",
    // Guilty Gear
    "Dragon Intalling",
    "Counter-hitting fafnir",
    "UMEHARA GA KIMETAAAAA",
    "Riding the lightning",
    "Knowing the smell of the game",
    // BlazBlue
    "Turning the wheel of fate",
    "Escaping from crossing fate",
    // Tekken
    "Complaining about Paul's damage",
    "Nerfing Gigas",
    "Mashing hopkick",
    // Marvel
    "Explaining the DHC glitch",
    // Dragon Ball
    "Adding another Goku",
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
