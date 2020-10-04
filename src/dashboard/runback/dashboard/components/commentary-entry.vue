<template>
  <div class="player">
    <v-row>
      <v-col cols="auto">
        <v-autocomplete label="Commentator" outlined> </v-autocomplete>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { State, Mutation } from "vuex-class"
import { State2Way } from "vuex-class-state2way"

@Component
export default class CommentaryEntry extends Vue {}
</script>
