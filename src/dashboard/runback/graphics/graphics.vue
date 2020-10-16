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
                  class="mr-4"
                  draggable
                  :href="format_url(graphic.name, graphic.file)"
                  color="primary"
                  >Drag into OBS</v-btn
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
  readonly drag_offset = 30
  graphics = [{ name: "Scoreboard", file: "scoreboard.html" }]
  dragged: any = {}
  drag_img = new Image()

  created(): void {
    this.drag_img.src = require("./img/obs-logo.svg")
  }

  mounted(): void {
    document.addEventListener("dragstart", (e: any) => {
      this.dragged = e!.target!
      e.dataTransfer.setDragImage(
        this.drag_img,
        this.drag_offset,
        this.drag_offset
      )
      e.dataTransfer.setData("text/uri-list", this.dragged.href)
    })

    document.addEventListener("dragend", (e) => this.dragged.blur())
    document.addEventListener("click", (e) => e.preventDefault())
  }

  copy_url(url: string) {
    navigator.clipboard.writeText(url)
  }

  format_url(name: string, file: string): string {
    return `${this.base_url}${file}?layer-name=${name}&layer-height=${this.height}&layer-width=${this.width}`
  }
}
</script>
