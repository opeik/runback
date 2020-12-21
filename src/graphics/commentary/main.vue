<template>
  <div id="commentary">
    <div id="main-panel-wrapper">
      <img id="main-panel" src="./img/main.svg" />

      <div
        id="p1-name-text-wrapper"
        class="name-text-wrapper"
        :class="[p1_in ? 'text-in' : '', p1_out ? 'text-out' : '']"
      >
        <fitty
          ref="p1-name-fitty"
          :options="{
            minSize: 1,
            maxSize: name_font_size(left_side_index()),
            multiLine: false,
          }"
        >
          <span class="gamertag-text">
            {{ display.players[left_side_index()].gamertag }}
          </span>
        </fitty>
      </div>

      <div
        id="p1-twitter-text-wrapper"
        class="twitter-text-wrapper"
        :class="[p1_in ? 'text-in' : '', p1_out ? 'text-out' : '']"
      >
        <fitty
          ref="p1-twitter-fitty"
          :options="{
            minSize: 1,
            maxSize: font_sizes.twitter,
            multiLine: false,
          }"
        >
          <span class="twitter-text">
            {{ player_twitter(left_side_index()) }}
          </span>
        </fitty>
      </div>

      <div
        id="p2-twitter-text-wrapper"
        class="twitter-text-wrapper"
        :class="[p2_in ? 'text-in' : '', p2_out ? 'text-out' : '']"
      >
        <fitty
          ref="p2-twitter-fitty"
          :options="{
            minSize: 1,
            maxSize: font_sizes.twitter,
            multiLine: false,
          }"
        >
          <span class="twitter-text">
            {{ player_twitter(right_side_index()) }}
          </span>
        </fitty>
      </div>

      <div
        id="p2-name-text-wrapper"
        class="name-text-wrapper"
        :class="[p2_in ? 'text-in' : '', p2_out ? 'text-out' : '']"
      >
        <fitty
          ref="p2-name-fitty"
          :options="{
            minSize: 1,
            maxSize: name_font_size(right_side_index()),
            multiLine: false,
          }"
        >
          <span class="gamertag-text">
            {{ display.players[right_side_index()].gamertag }}
          </span>
        </fitty>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator"
import { State } from "vuex-class"
import Fitty from "../components/fitty.vue"
import {
  Player,
  PlayersReplicant,
  Commentator,
  CommentatorsReplicant,
  SettingsReplicant,
} from "src/dashboard/runback/_types"
import CJK from "cjk-regex"

@Component
export default class App extends Vue {
  @State((state) => state.Runback.settings) settings!: SettingsReplicant
  @State((state) => state.Runback.players) players!: PlayersReplicant
  @State((state) => state.Runback.commentators)
  commentators!: CommentatorsReplicant
  @Ref("p1-name-fitty") p1_name_fitty!: Fitty
  @Ref("p2-name-fitty") p2_name_fitty!: Fitty

  readonly num_players = 2
  readonly cjk_font_size_ratio = 0.8
  readonly cjk_regex = CJK().toRegExp()
  readonly font_sizes = {
    name: 45,
    twitter: 25,
  }

  fitties: Array<Fitty> = []
  display = {
    players: new Array<Player>(this.num_players).fill(new Player()),
  }

  ani = {
    in: {
      players: new Array<boolean>(this.num_players).fill(false),
    },
    out: {
      players: new Array<boolean>(this.num_players).fill(false),
    },
  }

  player_twitter(player_num: number): string {
    const twitter = this.display.players[player_num].twitter

    if (twitter.length > 0) {
      return `@${twitter}`
    } else {
      return ""
    }
  }

  left_side_index(): number {
    if (this.settings.flip_commentator_sides) {
      return 1
    } else {
      return 0
    }
  }

  right_side_index(): number {
    if (this.settings.flip_commentator_sides) {
      return 0
    } else {
      return 1
    }
  }

  created(): void {
    this.display.players.forEach((e, i) => {
      this.display.players[i] = this.player_from_num(i) || new Player()
    })
  }

  mounted(): void {
    this.fitties = [this.p1_name_fitty, this.p2_name_fitty]
    this.setup_animation_events()
  }

  refit_text(): void {
    this.fitties.forEach((e) => e.fit())
  }

  player_id_from_num(player_num: number): string {
    return this.commentators.commentators[player_num].player_id
  }

  player_from_num(player_num: number): Player | undefined {
    let player_id = this.player_id_from_num(player_num)

    if (this.commentators.overrides[player_num].should_override) {
      return this.commentators.overrides[player_num].override
    } else {
      return this.players[player_id]
    }
  }

  name_font_size(player_num: number): number {
    const base = this.font_sizes.name
    const player = this.player_from_num(player_num)

    if (player === undefined) {
      return base
    }

    let has_cjk =
      this.cjk_regex.test(player.gamertag) || this.cjk_regex.test(player.team)

    return has_cjk ? base * this.cjk_font_size_ratio : base
  }

  readonly animation_events = [
    {
      id: "#p1-name-text-wrapper",
      c: (e: Event) => this.name_animation_calback(e, 0),
    },
    {
      id: "#p2-name-text-wrapper",
      c: (e: Event) => this.name_animation_calback(e, 1),
    },
  ]

  name_animation_calback(event: Event, player_num: number): void {
    const e = event as AnimationEvent

    // Vue doesn't propagate the state for this **one specific field**.
    // Why? I have no idea. I'm never getting those two hours of my life back.
    switch (e.animationName) {
      case "ani-text-in":
        Vue.set(this.ani.in.players, player_num, false)
        break

      case "ani-text-out":
        Vue.set(this.ani.out.players, player_num, false)
        Vue.set(this.ani.in.players, player_num, true)
        this.display.players[player_num] =
          this.player_from_num(player_num) || new Player()
        break
    }
  }

  setup_animation_events(): void {
    this.animation_events.forEach((e) => {
      document.querySelector(e.id)!.addEventListener("animationend", e.c)
    })
  }

  get p1(): Player {
    return this.player_from_num(0) || new Player()
  }

  get p2(): Player {
    return this.player_from_num(1) || new Player()
  }

  get p1_in(): boolean {
    return this.ani.in.players[0]
  }

  get p1_out(): boolean {
    return this.ani.out.players[0]
  }

  get p2_in(): boolean {
    return this.ani.in.players[1]
  }

  get p2_out(): boolean {
    return this.ani.out.players[1]
  }

  @Watch("p1.gamertag")
  on_p1_change(): void {
    Vue.set(this.ani.out.players, 0, true)
  }

  @Watch("p1.twitter")
  on_p1_twitter_change(): void {
    Vue.set(this.ani.out.players, 0, true)
  }

  @Watch("p2.gamertag")
  on_p2_change(): void {
    Vue.set(this.ani.out.players, 1, true)
  }

  @Watch("p2.twitter")
  on_p2_twitter_change(): void {
    Vue.set(this.ani.out.players, 1, true)
  }
}
</script>

<style>
:root {
  --main-panel-height: 100px;
  --main-panel-width: 887px;
  --main-panel-logo-width: 200px;

  --name-text-width: 300px;
  --name-text-height: 50px;
  --name-text-offset-x: 50px;
  --name-text-offset-y: 45px;

  --twitter-text-width: 300px;
  --twitter-text-height: 40px;
  --twitter-text-offset-x: 50px;
  --twitter-text-offset-y: 0px;

  --text-in-duration: 0.25s;
  --text-out-duration: 0.25s;
  --text-curve: linear;
}

#commentary {
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
}

#main-panel {
  filter: drop-shadow(0px 5px 5px #222);
}

#main-panel-wrapper {
  position: absolute;
  height: var(--main-panel-height);
  bottom: 25%;
  left: 50%;
  z-index: 0;
  transform: translateX(-50%);
}

.name-text-wrapper {
  position: absolute;
  top: var(--name-text-offset-y);
  height: var(--name-text-height);
  width: var(--name-text-width);
  line-height: var(--name-text-height);
  font-family: "Bebas Neue Bold", "Rounded Mplus Bold";
  text-align: center;
}

.twitter-text-wrapper {
  position: absolute;
  top: var(--twitter-text-offset-y);
  height: var(--twitter-text-height);
  width: var(--twitter-text-width);
  line-height: var(--twitter-text-height);
  font-family: "Bebas Neue Regular", "Rounded Mplus Bold";
  text-align: center;
}

#p1-name-text-wrapper {
  left: var(--name-text-offset-x);
}

#p1-twitter-text-wrapper {
  left: var(--twitter-text-offset-x);
}

#p2-twitter-text-wrapper {
  right: var(--twitter-text-offset-x);
}

#p2-name-text-wrapper {
  right: var(--name-text-offset-x);
}

.gamertag-text {
  color: white;
}

.twitter-text {
  color: #a5a5a5;
}

.text-in {
  animation: ani-text-in var(--text-in-duration) forwards;
  animation-timing-function: var(--text-curve);
}

.text-out {
  animation: ani-text-out var(--text-in-duration) forwards;
  animation-timing-function: var(--text-curve);
}

@keyframes ani-text-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes ani-text-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

img {
  height: 100%;
}
</style>
