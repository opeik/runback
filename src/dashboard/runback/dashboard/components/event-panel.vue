<template>
  <panel title="Event" icon="calendar">
    <v-text-field label="Smash.gg tournament URL" required></v-text-field>
    <v-autocomplete label="Event" outlined> </v-autocomplete>
    <v-divider />
    Details go here
  </panel>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class EventPanel extends Vue {
  menu = false
  date = new Date().toISOString().substr(0, 10)
}
</script>
