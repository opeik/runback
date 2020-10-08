<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card>
        <v-list-item>
          <v-list-item-icon class="mr-8">
            <v-icon :size="125">$logo</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="title">Runback</v-list-item-title>
            <v-list-item-subtitle> Version {{ version }} </v-list-item-subtitle>
            <v-list-item-subtitle>
              Developed by <a :href="twitter">opeik</a>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action> </v-list-item-action>
        </v-list-item>
        <v-divider />
        <v-list-item> Updates here </v-list-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { json } from "body-parser"
import { Vue, Component } from "vue-property-decorator"
import { Update } from "Runback/_types/"
import { State, Mutation, Action } from "vuex-class"
import type { ActionMethod } from "vuex"

@Component
export default class extends Vue {
  readonly version: string = require("@/../package.json").version
  readonly github: string = "https://github.com/opeik/runback"
  readonly twitter: string = "https://twitter.com/iamopeik"
  @State((state) => state.Runback.update) update!: Update
  @Action("check_up_to_date") check_up_to_date!: ActionMethod

  async check_updates(): Promise<void> {
    await this.check_up_to_date()
    console.log(this.update.is_out_of_date)
  }
}
</script>
