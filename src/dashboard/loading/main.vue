<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center mb-8">
            <span class="text-h1">Runback</span>
          </v-col>
          <v-col cols="12" class="text-center">
            <v-progress-circular
              :size="100"
              :width="7"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-col>
          <v-col cols="12" class="text-center mt-8">
            <span class="text-h5">Starting server... </span>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class extends Vue {}
</script>
