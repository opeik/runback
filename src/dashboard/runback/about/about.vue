<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card>
        <v-row align="center">
          <v-col cols="auto">
            <v-row align="center">
              <v-col cols="auto">
                <v-icon class="ml-6" size="125">$logo</v-icon>
              </v-col>
              <v-col cols="auto">
                <v-list class="ml-n2">
                  <v-list-item class="my=n6">
                    <v-list-item-content>
                      <v-list-item-title class="text-h6"
                        >Runback</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item class="my-n6">
                    <v-list-item-content>
                      <v-list-item-subtitle
                        >Version {{ version }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content class="my-n6">
                      <v-list-item-subtitle>
                        Developed by <a :href="twitter">opeik</a>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-col>

          <v-divider vertical class="my-6" />

          <v-col cols="auto">
            <v-row align="center">
              <v-col cols="auto" class="text-subtitle-2">
                <span class="ml-2">
                  {{ message }}
                </span>
              </v-col>
              <v-col cols="auto" v-if="checking_for_updates">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  class="ml-n2"
                ></v-progress-circular>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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

  checking_for_updates: boolean = false

  get message(): string {
    if (this.checking_for_updates) {
      return "Checking for updates..."
    } else if (this.update.is_out_of_date) {
      return `Out of date, new version ${this.update.new_version}.`
    } else {
      return "Up to date!"
    }
  }

  async mounted(): Promise<void> {
    await this.check_updates()
  }

  async check_updates(): Promise<void> {
    this.checking_for_updates = true
    await this.check_up_to_date()
    this.checking_for_updates = false
    console.log(this.update.is_out_of_date)
  }
}
</script>
