<template>
  <v-card class="flex d-flex flex-column">
    <v-row no-gutters>
      <v-toolbar dark color="primary">
        <v-icon> mdi-{{ icon }} </v-icon>
        <v-toolbar-title class="white--text ml-3">
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
    </v-row>
    <v-card-text class="flex">
      <slot>Content</slot>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"

@Component
export default class Panel extends Vue {
  @Prop({ default: "Title" }) title!: string
  @Prop({ default: "information" }) icon!: string
}
</script>
