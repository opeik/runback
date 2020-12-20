<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-container>
        <v-list>
          <v-list class="ml-4 mt-2 mb-2">
            <v-list-item>
              <v-list-item-icon class="">
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

          <v-divider class="py-2" />

          <v-row align="center">
            <v-col>
              <v-row align="center">
                <v-col cols="2" class="text-center my-2 ml-2">
                  <v-progress-circular
                    v-if="checking_for_updates"
                    indeterminate
                    color="primary"
                    size="24"
                  ></v-progress-circular>
                  <v-icon v-else> {{ icon_name }} </v-icon>
                </v-col>
                <v-col cols="auto">
                  <v-list class="ml-n6">
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
        </v-list>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { Updater, SettingsReplicant } from "src/dashboard/runback/_types/"
import type { ActionMethod } from "vuex"
import { State } from "vuex-class"

@Component
export default class extends Vue {
  @State((state) => state.Runback.settings.version) version!: string
  readonly github: string = "https://github.com/opeik/runback"
  readonly twitter: string = "https://twitter.com/iamopeik"

  checking_for_updates: boolean = false
  is_out_of_date: boolean = false
  new_version: string = ""

  get message(): string {
    if (this.checking_for_updates) {
      return "Checking for updates"
    } else if (this.is_out_of_date) {
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

  async check_updates(): Promise<void> {
    this.checking_for_updates = true

    let r = await Updater.check_up_to_date(this.version)
    if (r.found_new_version) {
      this.is_out_of_date = true
      this.new_version = r.version!
    }
    this.checking_for_updates = false
  }
}
</script>
