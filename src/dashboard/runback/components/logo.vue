<template>
  <img v-if="is_dark" src="../_img/runback-logo-dark.svg" />
  <img v-else src="../_img/runback-logo-light.svg" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"

@Component
export default class Logo extends Vue {
  get is_dark() {
    return this.$vuetify.theme.dark
  }
}
</script>
