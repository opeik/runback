<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col class="text-center">
            <v-progress-circular
              :size="100"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
// import { State, Mutation } from 'vuex-class';
// import { State2Way } from 'vuex-class-state2way';

@Component
export default class extends Vue {}
</script>
