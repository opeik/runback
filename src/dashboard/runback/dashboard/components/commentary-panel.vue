<template>
  <panel title="Commentary" icon="headset">
    <v-row align="center" justify="center" class="mb-8">
      <v-btn class="mx-2">
        <v-icon left>mdi-swap-horizontal</v-icon>
        Swap
      </v-btn>
      <v-btn class="mx-2">
        <v-icon left>mdi-pencil</v-icon>
        Details
      </v-btn>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col v-for="i in num_commentators" :key="i">
        <commentary-entry :player_num="i"></commentary-entry>
      </v-col>
    </v-row>
  </panel>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"

@Component
export default class CommentaryPanel extends Vue {
  num_commentators = 2
}
</script>
