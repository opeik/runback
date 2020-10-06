<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text>
          <v-row align="center">
            <v-col cols="auto">
              <v-avatar :size="96" class="mr-4">
                <v-img
                  :src="require('./img/opeik.png')"
                  aspect-ratio="1"
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col>
              <v-row class="my-n4">
                <v-col>
                  <span>Runback version {{ version }}</span>
                </v-col>
              </v-row>
              <v-row class="my-n4">
                <v-col>
                  <span>Made by <a :href="twitter">opeik</a></span>
                </v-col>
              </v-row>
              <v-row class="my-n4">
                <v-col>
                  <span> Source on <a :href="github">GitHub</a></span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class App extends Vue {
  readonly version: string = require("@/../package.json").version
  readonly github: string = "https://github.com/opeik/runback"
  readonly twitter: string = "https://twitter.com/iamopeik"
}
</script>
