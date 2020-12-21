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
    "Taking your lunch money",
    // Street Fighter
    "Parrying your super",
    "Fighting like gentlemen",
    "Fighting a new rival",
    "Keeping it classy",
    "Protecting Russia's skies",
    "Waking up with Dragon Punch",
    "Teching those throws",
    "Finding the heart of battle",
    "Chucking plasma",
    "Executing the Yeah Nah Yeah",
    // Guilty Gear
    "Counter-hitting Pilebunker",
    "Riding the lightning",
    "Knowing the smell of the game",
    "Dropping the instant kill combo",
    "What are you standing up for?!",
    "Stealing your soul",
    "Channelling your inner gorilla",
    "Initiating danger time",
    "Dragon Installing",
    "Practising dust loops",
    // BlazBlue
    "Turning the wheel of fate",
    "Escaping from crossing fate",
    // Tekken
    "Complaining about Paul's damage",
    "Nerfing Gigas",
    "Mashing hopkick",
    "Sidestepping your electric",
    "Punishing hellsweep with 1,1,2",
    "Emailing Harada",
    // Marvel
    "Explaining the DHC glitch",
    "When's Mahvel?",
    "Thanking god for the machine",
    "Setting up shop",
    "Getting motivated",
    "Activating X-Factor",
    // Dragon Ball
    "Adding yet another Goku",
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
