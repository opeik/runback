<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-container>
        <v-list>
          <v-list-item v-for="graphic in graphics" :key="graphic.name">
            <v-list-item-content>
              <v-list-item-title> {{ graphic.name }} </v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-row>
                <v-btn
                  class="mx-4"
                  @click="copy_url(format_url(graphic.name, graphic.file))"
                  >Copy URL</v-btn
                >
                <v-btn
                  :href="format_url(graphic.name, graphic.file)"
                  class="mr-4"
                  >Open</v-btn
                >
              </v-row>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class extends Vue {
  readonly base_url: string = "http://localhost:9090/bundles/runback/graphics/"
  readonly width = 1920
  readonly height = 1080
  graphics = [{ name: "Scoreboard", file: "scoreboard.html" }]

  copy_url(url: string) {
    navigator.clipboard.writeText(url)
  }

  format_url(name: string, file: string): string {
    return `${this.base_url}${file}?layer-name=${name}&layer-height=${this.height}&layer-width=${this.width}`
  }
}
</script>
