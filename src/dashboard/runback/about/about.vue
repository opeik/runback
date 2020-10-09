<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-text>
          <v-row align="center">
            <v-list class="ml-2 mb-2 mt-n2">
              <v-list-item>
                <v-list-item-icon class="mr-8">
                  <v-icon :size="100">$logo</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title class="title">Runback</v-list-item-title>
                  <v-list-item-subtitle>
                    Version {{ version }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Developed by <a :href="twitter">opeik</a>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action> </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-row>

          <v-divider class="py-2" />

          <v-row align="center">
            <v-col>
              <v-row align="center">
                <v-col cols="2" class="text-center my-2">
                  <v-progress-circular
                    v-if="checking_for_updates"
                    indeterminate
                    color="primary"
                    size="24"
                  ></v-progress-circular>
                  <v-icon v-else> {{ icon_name }} </v-icon>
                </v-col>
                <v-col cols="auto">
                  <v-list class="ml-n4">
                    <v-list-item class="my-n6">
                      <v-list-item-content>
                        <v-list-item-subtitle>
                          {{ message }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      class="my-n6"
                      v-if="is_out_of_date && !checking_for_updates"
                    >
                      <v-list-item-content>
                        <v-list-item-subtitle>
                          <a :href="new_version_url">
                            Version {{ new_version }} available
                          </a>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
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
      return "Checking for updates"
    } else if (this.update.is_out_of_date) {
      return "Out of date"
    } else {
      return "Up to date!"
    }
  }

  get new_version_url(): string {
    return "https://github.com/opeik/runback/releases/tag/" + this.new_version
  }

  get icon_name(): string {
    if (this.is_out_of_date) {
      return "mdi-alert-circle"
    } else {
      return "mdi-check"
    }
  }

  async mounted(): Promise<void> {
    await this.check_updates()
  }

  get is_out_of_date(): boolean {
    return this.update.is_out_of_date
  }

  get new_version(): string {
    return this.update.new_version
  }

  async check_updates(): Promise<void> {
    this.checking_for_updates = true
    await this.check_up_to_date()
    this.checking_for_updates = false
  }
}
</script>
