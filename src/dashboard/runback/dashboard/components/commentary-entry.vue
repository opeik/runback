<template>
  <div class="player">
    <v-row class="mb-n12">
      <v-col>
        <v-autocomplete outlined label="Commentator" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class CommentaryEntry extends Vue {}
</script>
