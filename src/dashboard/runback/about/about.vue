<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text>
          <v-avatar :size="96" class="mr-4">
            <v-img :src="require('./img/opeik.png')" aspect-ratio="1"></v-img>
          </v-avatar>
          Runback version {{ version }}, made by opeik
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

const VERSION = require("@/../package.json").version

@Component
export default class App extends Vue {
  version: string = VERSION
  github: string = "https://github.com/opeik/runback"
  twitter: string = "https://twitter.com/iamopeik"
}
</script>
