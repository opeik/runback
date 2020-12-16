<template>
  <div id="commentary">
    <div id="main-panel-wrapper">
      <img id="main-panel" src="./img/main.svg" />

      <div
        id="p1-name-text-wrapper"
        class="name-text-wrapper"
        :class="[p1_name_in ? 'text-in' : '', p1_name_out ? 'text-out' : '']"
      >
        <fitty
          ref="p1-name-fitty"
          :options="{
            minSize: 1,
            maxSize: name_font_size(0),
            multiLine: false,
          }"
        >
          <span class="gamertag-text">
            {{ display.players[0].gamertag }}
          </span>
        </fitty>
      </div>

      <div
        id="p1-twitter-text-wrapper"
        class="twitter-text-wrapper"
        :class="[p1_name_in ? 'text-in' : '', p1_name_out ? 'text-out' : '']"
      >
        <fitty
          ref="p1-twitter-fitty"
          :options="{
            minSize: 1,
            maxSize: font_sizes.twitter,
            multiLine: false,
          }"
        >
          <span class="twitter-text"> @{{ display.players[0].twitter }} </span>
        </fitty>
      </div>

      <div
        id="p2-twitter-text-wrapper"
        class="twitter-text-wrapper"
        :class="[p2_name_in ? 'text-in' : '', p2_name_out ? 'text-out' : '']"
      >
        <fitty
          ref="p2-twitter-fitty"
          :options="{
            minSize: 1,
            maxSize: font_sizes.twitter,
            multiLine: false,
          }"
        >
          <span class="twitter-text"> @{{ display.players[1].twitter }} </span>
        </fitty>
      </div>

      <div
        id="p2-name-text-wrapper"
        class="name-text-wrapper"
        :class="[p2_name_in ? 'text-in' : '', p2_name_out ? 'text-out' : '']"
      >
        <fitty
          ref="p2-name-fitty"
          :options="{
            minSize: 1,
            maxSize: name_font_size(1),
            multiLine: false,
          }"
        >
          <span class="gamertag-text">
            {{ display.players[1].gamertag }}
          </span>
        </fitty>
      </div>
    </div>
  </div>
</template>

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

img {
  height: 100%;
}
</style>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator"
import { State } from "vuex-class"
import Fitty from "../components/fitty.vue"
import {
  Player,
  Players,
  Commentator,
  Commentators,
} from "src/dashboard/runback/_types"
import CJK from "cjk-regex"

@Component
export default class App extends Vue {
  @State((state) => state.Runback.players) players!: Players
  @State((state) => state.Runback.commentators) commentators!: Commentators
  @Ref("p1-name-fitty") p1_name_fitty!: Fitty
  @Ref("p2-name-fitty") p2_name_fitty!: Fitty

  readonly num_players = 2
  readonly cjk_font_size_ratio = 0.8
  readonly cjk_regex = CJK().toRegExp()
  readonly font_sizes = {
    name: 45,
    twitter: 25,
  }

  display = {
    players: new Array<Player>(this.num_players).fill(new Player()),
  }

  ani = {
    in: {
      names: new Array<boolean>(this.num_players).fill(false),
    },
    out: {
      names: new Array<boolean>(this.num_players).fill(false),
    },
  }

  created(): void {
    this.display.players.forEach((e, i) => {
      this.display.players[i] = this.player_from_num(i) || new Player()
    })
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
      this.cjk_regex.test(player.name) || this.cjk_regex.test(player.team)

    return has_cjk ? base * this.cjk_font_size_ratio : base
  }

  get p1_name_in(): boolean {
    return this.ani.in.names[0]
  }

  get p1_name_out(): boolean {
    return this.ani.out.names[0]
  }

  get p2_name_in(): boolean {
    return this.ani.in.names[1]
  }

  get p2_name_out(): boolean {
    return this.ani.out.names[1]
  }
}
</script>
