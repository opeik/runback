<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text>
          <v-row align="center">
            <v-col cols="4" sm="4" md="2">
              <v-avatar :size="96">
                <v-img
                  :src="require('./img/opeik.png')"
                  aspect-ratio="1"
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="3"> Made by opeik </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
// import { State, Mutation } from 'vuex-class';
// import { State2Way } from 'vuex-class-state2way';

@Component
export default class About extends Vue {}
</script>
