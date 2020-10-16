<template>
  <v-snackbar app v-model="snackbar" :color="background_color">
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        :color="button_color"
        :to="link"
        @click="snackbar = false"
      >
        {{ label }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"
import { EventBus } from "src/dashboard/runback/event-bus"

@Component
export default class Snackbar extends Vue {
  snackbar: boolean = false
  text: string = ""
  background_color = ""
  button_color: string = ""
  label: string = ""
  link: string = ""

  mounted(): void {
    EventBus.$on(
      "create-snackbar",
      (args: {
        text: string
        color: { button?: string; background?: string }
        label?: string
        link?: string
      }) => {
        this.internal_create_snackbar(
          args.text,
          args.color,
          args.label,
          args.link
        )
      }
    )
  }

  static create_snackbar(
    text: string,
    color?: { button?: string; background?: string },
    label?: string,
    link?: string
  ) {
    EventBus.$emit("create-snackbar", {
      text: text,
      color: color,
      label: label,
      link: link,
    })
  }

  internal_create_snackbar(
    text: string,
    color?: { button?: string; background?: string },
    label?: string,
    link?: string
  ) {
    this.text = text
    this.button_color = color?.button || "primary"
    this.background_color = color?.background || ""
    this.label = label || "Close"
    this.link = link || ""
    this.snackbar = true
  }
}
</script>
