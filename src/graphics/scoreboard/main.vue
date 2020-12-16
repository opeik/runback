<template>
  <div id="scoreboard">
    <div
      id="back-panel-wrapper"
      :class="ani.in.main ? 'back-in main-hidden' : ''"
    >
      <img id="back-panel" src="./img/back.svg" />
    </div>

    <div
      id="main-panel-wrapper"
      :class="ani.in.main ? 'main-in main-hidden' : ''"
    >
      <img id="main-panel" src="./img/main.svg" />

      <div
        id="progress-text-wrapper"
        :class="[
          ani.in.progress ? 'text-in' : '',
          ani.out.progress ? 'text-out' : '',
        ]"
      >
        <fitty
          id="progress-text"
          :options="{
            minSize: 1,
            maxSize: progress_font_size,
            multiLine: false,
          }"
        >
          {{ display.progress }}
        </fitty>
      </div>

      <div
        id="p1-games-text-wrapper"
        class="games-text-wrapper"
        :class="[p1_score_in ? 'text-in' : '', p1_score_out ? 'text-out' : '']"
      >
        <fitty
          class="games-text"
          :options="{ minSize: 1, maxSize: 55, multiLine: false }"
        >
          {{ display.scores[0] }}
        </fitty>
      </div>

      <div
        id="p2-games-text-wrapper"
        class="games-text-wrapper"
        :class="[
          ani.in.scores[1] ? 'text-in' : '',
          ani.out.scores[1] ? 'text-out' : '',
        ]"
      >
        <fitty
          class="games-text"
          :options="{ minSize: 1, maxSize: 55, multiLine: false }"
        >
          {{ display.scores[1] }}
        </fitty>
      </div>

      <div
        id="p1-side-wrapper"
        class="side-wrapper"
        :class="[
          ani.in.side && is_grand_final ? 'p1-side-in' : '',
          !ani.visible.side ? 'p1-side-hidden' : '',
          ani.out.side ? 'p1-side-out' : '',
        ]"
      >
        <img :src="side_panel_path(0)" />
        <div id="p1-side-text" class="side-text-wrapper">
          <span>
            {{ is_winners_text(display.is_winner[0]) }}
          </span>
        </div>
      </div>

      <div
        id="p2-side-wrapper"
        class="side-wrapper"
        :class="[
          ani.in.side && is_grand_final ? 'p2-side-in' : '',
          !ani.visible.side ? 'p2-side-hidden' : '',
          ani.out.side ? 'p2-side-out' : '',
        ]"
      >
        <img :src="side_panel_path(1)" />
        <div id="p2-side-text" class="side-text-wrapper">
          <span>
            {{ is_winners_text(display.is_winner[1]) }}
          </span>
        </div>
      </div>

      <div
        id="p1-name-wrapper"
        class="name-wrapper"
        :class="[
          ani.in.players ? 'p1-name-in' : '',
          ani.in.main ? 'p1-name-hidden' : '',
          ani.out.players ? 'p1-name-out' : '',
        ]"
      >
        <img src="./img/name1.svg" />

        <div
          id="p1-name-text-wrapper"
          class="name-text-wrapper"
          :class="is_grand_final ? 'name-text-small' : ''"
        >
          <fitty
            ref="p1-name-fitty"
            :options="{
              minSize: 1,
              maxSize: name_font_size(0),
              multiLine: false,
            }"
          >
            <span class="team-text">
              {{ display.players[0].team }}
            </span>

            <span class="gamertag-text">
              {{ display.players[0].gamertag }}
            </span>
          </fitty>
        </div>

        <div
          id="p1-flag-wrapper"
          class="flag-wrapper"
          :class="[
            ani.in.players ? 'p1-flag-in p1-flag-hidden' : '',
            ani.in.main ? 'hidden' : '',
            ani.out.players ? 'p1-flag-out' : '',
          ]"
        >
          <div class="flag-mask">
            <img class="flag" :src="flag_path(0)" />
          </div>
        </div>
      </div>

      <div
        id="p2-name-wrapper"
        class="name-wrapper"
        :class="[
          ani.in.players ? 'p2-name-in' : '',
          ani.in.main ? 'p2-name-hidden' : '',
          ani.out.players ? 'p2-name-out' : '',
        ]"
      >
        <img src="./img/name2.svg" />

        <div
          id="p2-name-text-wrapper"
          class="name-text-wrapper"
          :class="is_grand_final ? 'name-text-small' : ''"
        >
          <fitty
            ref="p2-name-fitty"
            :options="{
              minSize: 1,
              maxSize: name_font_size(1),
              multiLine: false,
            }"
          >
            <span class="team-text">
              {{ display.players[1].team }}
            </span>

            <span class="gamertag-text">
              {{ display.players[1].gamertag }}
            </span>
          </fitty>
        </div>

        <div
          id="p2-flag-wrapper"
          class="flag-wrapper"
          :class="[
            ani.in.players ? 'p2-flag-in p2-flag-hidden' : '',
            ani.in.main ? 'hidden' : '',
            ani.out.players ? 'p2-flag-out' : '',
          ]"
        >
          <div class="flag-mask">
            <img class="flag" :src="flag_path(1)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator"
import { State } from "vuex-class"
import Fitty from "../components/fitty.vue"
import {
  Bracket,
  Player,
  Players,
  Scoreboard,
  Rules,
  Stage,
  Side,
} from "src/dashboard/runback/_types"
import CJK from "cjk-regex"

@Component
export default class App extends Vue {
  @State((state) => state.Runback.players) players!: Players
  @State((state) => state.Runback.scoreboard) scoreboard!: Scoreboard
  @State((state) => state.Runback.bracket) bracket!: Bracket

  @Ref("p1-name-fitty") p1_name_fitty!: Fitty
  @Ref("p2-name-fitty") p2_name_fitty!: Fitty

  readonly num_players = 2
  readonly cjk_font_size_ratio = 0.8
  readonly cjk_regex = CJK().toRegExp()
  readonly rules = new Rules()
  readonly font_sizes = {
    name: 45,
    progress: 35,
  }

  fitties: Array<Fitty> = []

  ani = {
    in: {
      main: true,
      players: false,
      progress: false,
      scores: new Array<boolean>(this.num_players).fill(false),
      side: false,
    },
    out: {
      main: false,
      players: false,
      progress: false,
      scores: new Array<boolean>(this.num_players).fill(false),
      side: false,
    },
    visible: {
      side: false,
    },
  }

  display = {
    progress: "",
    players: new Array<Player>(this.num_players).fill(new Player()),
    scores: new Array<number>(this.num_players).fill(0),
    is_winner: new Array<boolean>(this.num_players).fill(false),
    stage: Stage.Unset,
    side: Side.Unset,
  }

  created(): void {
    this.display.progress = this.progress
    this.display.stage = Stage.from_value(this.bracket.stage)
    this.display.side = Side.from_value(this.bracket.side)
    this.display.players.forEach((e, i) => {
      this.display.players[i] = this.player_from_num(i) || new Player()
      this.display.scores[i] = this.player_score_from_num(i)
      this.display.is_winner[i] = this.rules.is_winner(
        i,
        Side.from_value(this.bracket.side)
      )
    })
  }

  mounted(): void {
    this.fitties = [this.p1_name_fitty, this.p2_name_fitty]
    this.setup_animation_events()
  }

  player_id_from_num(player_num: number): string {
    return this.scoreboard.scores[player_num].player_id
  }

  player_from_num(player_num: number): Player | undefined {
    let player_id = this.player_id_from_num(player_num)

    if (this.scoreboard.overrides[player_num].should_override) {
      return this.scoreboard.overrides[player_num].override
    } else {
      return this.players[player_id]
    }
  }

  player_is_winner_from_num(player_num: number): boolean {
    return this.rules.is_winner(player_num, Side.from_value(this.bracket.side))
  }

  player_score_from_num(player_num: number): number {
    return this.scoreboard.scores[player_num].score
  }

  flag_path(player_num: number): string {
    let country = this.display.players[player_num].country

    if (country === "") {
      country = "RS"
    } else {
      country = country.toUpperCase()
    }

    const path = `./img/region-flags/svg/${country}`
    return require(path + ".svg")
  }

  side_panel_path(player_num: number): string {
    const side = this.display.is_winner[player_num] ? "winners" : "losers"
    const path = `./img/side${player_num + 1}-${side}`

    return require(path + ".svg")
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

  refit_text(): void {
    this.fitties.forEach((e) => e.fit())
  }

  is_winners_text(is_winner: boolean): string {
    return is_winner
      ? this.rules.winners_abbreviation
      : this.rules.losers_abbreviation
  }

  get is_sides_visible(): boolean {
    return (
      (this.is_grand_final && this.is_grand_final_sides_selected) ||
      this.ani.in.side ||
      this.ani.out.side
    )
  }

  get progress(): string {
    const stage = Stage.from_value(this.bracket.stage)
    const side = Side.from_value(this.bracket.side)
    const custom_progress_enabled = this.bracket.custom_progress_enabled
    const custom_progress = this.bracket.custom_progress
    let progress = ""

    if (custom_progress_enabled) {
      return custom_progress
    }

    if (
      !this.is_grand_final &&
      side.value >= Side.Winners.value &&
      side.value <= Side.Losers.value
    ) {
      progress += side.text
    }

    if (
      stage.value >= Stage.Pools.value &&
      stage.value <= Stage.GrandFinal.value
    ) {
      progress += " " + stage.text
    }

    return progress
  }

  get progress_font_size(): number {
    const base = this.font_sizes.progress
    const has_cjk = this.cjk_regex.test(this.progress)

    return has_cjk ? base * this.cjk_font_size_ratio : base
  }

  get is_grand_final(): boolean {
    return this.bracket.stage === Stage.GrandFinal.value
  }

  get is_grand_final_sides_selected(): boolean {
    return (
      this.bracket.side >= Side.WinnersLosers.value &&
      this.bracket.side <= Side.LosersLosers.value
    )
  }

  get p1_score(): number {
    return this.player_score_from_num(0)
  }

  get p2_score(): number {
    return this.player_score_from_num(1)
  }

  get p1(): Player {
    return this.player_from_num(0) || new Player()
  }

  get p2(): Player {
    return this.player_from_num(1) || new Player()
  }

  // The Wall Of Watches™
  @Watch("progress")
  on_progress_change(new_value: string, old_value: string): void {
    this.ani.out.progress = true
  }

  @Watch("bracket.stage")
  on_bracket_stage_change(new_value: number, old_value: number): void {
    if (
      !this.ani.visible.side &&
      new_value === Stage.GrandFinal.value &&
      this.is_grand_final_sides_selected
    ) {
      this.ani.in.side = true
      this.ani.visible.side = true
    } else if (this.ani.visible.side && new_value !== Stage.GrandFinal.value) {
      this.ani.out.side = true
    }
  }

  @Watch("bracket.side")
  on_bracket_side_change(new_value: Side, old_value: Side): void {
    if (
      !this.ani.visible.side &&
      this.is_grand_final &&
      this.is_grand_final_sides_selected
    ) {
      this.display.is_winner.forEach((e, i) => {
        this.display.is_winner[i] = this.player_is_winner_from_num(i)
      })

      this.ani.in.side = true
      this.ani.visible.side = true
    } else if (this.ani.visible.side) {
      this.ani.out.side = true
    }
  }

  @Watch("p1.gamertag")
  on_p1_change(): void {
    this.ani.out.players = true
  }

  @Watch("p1.team")
  on_p1_team_change(): void {
    this.ani.out.players = true
  }

  @Watch("p1.country")
  on_p1_country_change(): void {
    this.ani.out.players = true
  }

  @Watch("p2.gamertag")
  on_p2_change(): void {
    this.ani.out.players = true
  }

  @Watch("p2.team")
  on_p2_team_change(): void {
    this.ani.out.players = true
  }

  @Watch("p2.country")
  on_p2_country_change(): void {
    this.ani.out.players = true
  }

  @Watch("p1_score")
  on_p1_score_change(): void {
    Vue.set(this.ani.out.scores, 0, true)
  }

  @Watch("p2_score")
  on_p2_score_change(): void {
    Vue.set(this.ani.out.scores, 1, true)
  }

  readonly animation_events = [
    {
      id: "#main-panel-wrapper",
      c: this.main_panel_animation_callback,
    },
    {
      id: "#progress-text-wrapper",
      c: this.progress_animation_callback,
    },
    {
      id: "#p1-name-wrapper",
      c: this.p1_name_animation_callback,
    },
    {
      id: "#p1-games-text-wrapper",
      c: (e: Event) => this.score_animation_calback(e, 0),
    },
    {
      id: "#p2-games-text-wrapper",
      c: (e: Event) => this.score_animation_calback(e, 1),
    },
    {
      id: "#p1-side-wrapper",
      c: this.side_animation_callback,
    },
  ]

  main_panel_animation_callback(event: Event): void {
    const e = event as AnimationEvent

    if (e.animationName === "ani-main-panel-in") {
      this.ani.in.main = false
      this.ani.in.players = true
      this.ani.in.side = true

      if (this.is_grand_final && this.is_grand_final_sides_selected) {
        this.ani.visible.side = true
      }

      this.refit_text()
    }
  }

  p1_name_animation_callback(event: Event): void {
    const e = event as AnimationEvent

    switch (e.animationName) {
      case "ani-p1-flag-in":
        this.ani.in.players = false
        break

      case "ani-p1-name-out":
        this.ani.out.players = false
        this.ani.in.players = true
        this.display.players.forEach((e, i) => {
          this.display.players[i] = this.player_from_num(i) || new Player()
        })
        this.refit_text()
        break
    }
  }

  get p1_score_in(): boolean {
    return this.ani.in.scores[0]
  }

  get p1_score_out(): boolean {
    return this.ani.out.scores[0]
  }

  score_animation_calback(event: Event, player_num: number): void {
    const e = event as AnimationEvent

    // Vue doesn't propagate the state for this **one specific field**.
    // Why? I have no idea. I'm never getting those two hours of my life back.
    switch (e.animationName) {
      case "ani-text-in":
        this.ani.in.scores[0] = false
        Vue.set(this.ani.in.scores, player_num, false)
        break

      case "ani-text-out":
        Vue.set(this.ani.out.scores, player_num, false)
        Vue.set(this.ani.in.scores, player_num, true)
        this.display.scores[player_num] = this.player_score_from_num(player_num)
        break
    }
  }

  progress_animation_callback(event: Event) {
    const e = event as AnimationEvent

    switch (e.animationName) {
      case "ani-text-in":
        this.ani.in.progress = false
        break

      case "ani-text-out":
        this.ani.out.progress = false
        this.ani.in.progress = true
        this.display.progress = this.progress
        break
    }
  }

  side_animation_callback(event: Event): void {
    const e = event as AnimationEvent

    switch (e.animationName) {
      case "ani-p1-side-in":
        this.ani.in.side = false
        break

      case "ani-p1-side-out":
        this.ani.out.side = false

        if (this.is_grand_final && this.is_grand_final_sides_selected) {
          this.ani.in.side = true
        } else {
          this.ani.visible.side = false
        }

        this.display.is_winner.forEach((e, i) => {
          this.display.is_winner[i] = this.player_is_winner_from_num(i)
        })
        break
    }
  }

  setup_animation_events(): void {
    this.animation_events.forEach((e) => {
      document.querySelector(e.id)!.addEventListener("animationend", e.c)
    })
  }
}
</script>

<style>
:root {
  --main-panel-height: 60px;
  --main-panel-width: 409.28px;

  --back-panel-height: 50px;
  --back-panel-width: 596.6px;

  --name-panel-height: 50px;
  --name-panel-width: 499.19px;
  --name-panel-offset: calc(var(--name-panel-width) * 0.95 * -1);
  --name-panel-p1-mask-start: polygon(0 0, 15% 0, 15% 100%, 0 100%);
  --name-panel-p2-mask-start: polygon(85% 0, 100% 0, 100% 100%, 85% 100%);
  --name-panel-mask-end: polygon(0 0, 100% 0, 100% 100%, 0 100%);

  --side-panel-height: calc(var(--main-panel-height) * 0.5);
  --side-panel-width: 43px;
  --side-text-height: var(--side-panel-height);
  --side-text-width: var(--side-panel-width);
  --side-start-x: 1px;
  --side-end-x: calc(var(--side-panel-width) * 0.8 * -1);

  --flag-height: 50px;
  --flag-width: 120px;
  --flag-start-x: calc(var(--flag-width) + 1px);
  --flag-end-x: calc(var(--flag-width) * (0.25 + 0.01));

  --name-text-width: calc(var(--name-panel-width) * 0.845);
  --name-text-height: calc(var(--name-panel-height) * 0.8);
  --name-text-offset-x: calc(var(--name-panel-width) * 0.325);
  --name-text-offset-y: calc(
    var(--name-panel-height) * 0.5 - (var(--name-text-height) * 0.5)
  );

  --games-text-width: calc(var(--main-panel-width) * 0.11);
  --games-text-height: calc(var(--main-panel-height) * 0.8);
  --games-text-offset-x: calc(var(--main-panel-width) * 0.04);
  --games-text-offset-y: calc(
    var(--main-panel-height) * 0.5 - (var(--games-text-height) * 0.5)
  );

  --progress-text-width: calc(var(--main-panel-width) * 0.65);
  --progress-text-height: calc(var(--main-panel-height) * 0.55);
  --progress-text-offset-x: calc(var(--main-panel-width) * 0.5);
  --progress-text-offset-y: calc(
    var(--main-panel-height) * 0.35 - (var(--progress-text-height) * 0.5)
  );

  --text-in-duration: 0.25s;
  --text-out-duration: 0.25s;
  --main-in-duration: 0.5s;
  --main-in-delay: 0.15s;
  --back-in-duration: var(--main-in-duration);
  --name-in-duration: 1s;
  --name-out-duration: 0.75s;
  --flag-in-duration: 0.75s;
  --flag-in-delay: 0.25s;
  --flag-out-duration: 0.3s;
  --side-in-duration: 0.5s;
  --side-out-duration: 0.5s;

  --animation-curve: cubic-bezier(0.19, 1, 0.22, 1);
  --text-curve: linear;
}

img {
  height: 100%;
}

#scoreboard {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

#back-panel-wrapper {
  position: absolute;
  height: var(--back-panel-height);
  top: 0;
  left: 0;
  z-index: -2;
  transform: translateX(-50%) translate3d(0, 0, 0);
}

#main-panel {
  filter: drop-shadow(0px 5px 5px #222);
}

#main-panel-wrapper {
  position: absolute;
  height: var(--main-panel-height);
  top: 0;
  left: 0;
  z-index: 0;
  transform: translateX(-50%);
}

#progress-text-wrapper {
  position: absolute;
  top: var(--progress-text-offset-y);
  left: var(--progress-text-offset-x);
  width: var(--progress-text-width);
  height: var(--progress-text-height);
  line-height: var(--progress-text-height);
  text-align: center;
  transform: translateX(-50%);
}

#progress-text {
  color: white;
  font-family: "Bebas Neue Regular", "Rounded Mplus Regular";
}

#p1-name-wrapper {
  left: var(--name-panel-offset);
  padding-left: var(--flag-width);
  margin-left: calc(var(--flag-width) * -1);
  text-align: left;
}

#p2-name-wrapper {
  right: var(--name-panel-offset);
  padding-right: var(--flag-width);
  margin-right: calc(var(--flag-width) * -1);
  text-align: right;
}

#p1-flag-wrapper {
  left: var(--flag-end-x);
  clip-path: polygon(0 0, 75% 0, 100% 100%, 25% 100%);
}

#p2-flag-wrapper {
  right: var(--flag-end-x);
  clip-path: polygon(25% 0, 100% 0, 75% 100%, 0 100%);
}

#p1-name-text-wrapper {
  left: var(--name-text-offset-x);
  text-align: left;
}

#p2-name-text-wrapper {
  right: var(--name-text-offset-x);
  text-align: right;
}

#p1-games-text-wrapper {
  left: var(--games-text-offset-x);
}

#p2-games-text-wrapper {
  right: var(--games-text-offset-x);
}

#p1-side-wrapper {
  left: var(--side-end-x);
}

#p2-side-wrapper {
  right: var(--side-end-x);
}

.hidden {
  opacity: 0;
}

.p1-side-hidden {
  left: var(--side-start-x) !important;
}

.p2-side-hidden {
  right: var(--side-start-x) !important;
}

.main-hidden {
  top: calc(var(--main-panel-height) * -1) !important;
}

.p1-name-hidden {
  clip-path: var(--name-panel-p1-mask-start);
}

.p1-flag-hidden {
  left: var(--flag-start-x) !important;
}

.p2-flag-hidden {
  right: var(--flag-start-x) !important;
}

.p2-name-hidden {
  clip-path: var(--name-panel-p2-mask-start);
}

.side-wrapper {
  position: absolute;
  height: var(--side-panel-height);
  width: var(--side-panel-width);
  top: 0;
  z-index: -1;
  overflow: visible;
  filter: drop-shadow(0px 2px 5px #222);
}

.side-text-wrapper {
  position: absolute;
  height: var(--side-text-height);
  width: var(--side-text-width);
  top: 0;
  font-family: "Bebas Neue Bold";
  text-align: center;
  line-height: var(--side-panel-height);
  font-size: 30px;
  color: black;
}

.name-wrapper {
  position: absolute;
  height: var(--name-panel-height);
  top: 0;
  z-index: -2;
  overflow: visible;
  padding-bottom: 20px;
  filter: drop-shadow(0px 2px 5px #222);
}

.flag-wrapper {
  position: absolute;
  height: var(--flag-height);
  width: var(--flag-width);
  top: 0;
  z-index: -3;
}

.flag-mask {
  width: 100%;
  height: var(--flag-height);
}

.flag {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.name-text-wrapper {
  position: absolute;
  top: var(--name-text-offset-y);
  height: var(--name-text-height);
  width: var(--name-text-width);
  line-height: var(--name-text-height);
  font-family: "Bebas Neue Bold", "Rounded Mplus Bold";
}

.name-text-small {
  width: calc(
    var(--name-text-width) - (var(--side-panel-width) * 0.85)
  ) !important;
}

.games-text-wrapper {
  position: absolute;
  top: var(--games-text-offset-y);
  height: var(--games-text-height);
  width: var(--games-text-width);
  text-align: center;
  line-height: var(--games-text-height);
}

.games-text {
  color: white;
  font-family: "Gilroy";
  font-weight: bold;
}

.team-text {
  color: #a5a5a5;
}

.gamertag-text {
  color: white;
}

.text-in {
  animation: ani-text-in var(--text-in-duration) forwards;
  animation-timing-function: var(--text-curve);
}

.text-out {
  animation: ani-text-out var(--text-in-duration) forwards;
  animation-timing-function: var(--text-curve);
}

.back-in {
  animation: ani-main-panel-in var(--back-in-duration) forwards;
  animation-timing-function: var(--animation-curve);
}

.main-in {
  animation: ani-main-panel-in var(--main-in-duration) forwards;
  animation-timing-function: var(--animation-curve);
  animation-delay: var(--main-in-delay);
}

.p1-name-in {
  animation: ani-p1-name-in var(--name-in-duration) forwards;
  animation-timing-function: var(--animation-curve);
}

.p2-name-in {
  animation: ani-p2-name-in var(--name-in-duration) forwards;
  animation-timing-function: var(--animation-curve);
}

.p1-name-out {
  animation: ani-p1-name-out var(--name-out-duration) forwards;
  animation-timing-function: var(--animation-curve);
}

.p2-name-out {
  animation: ani-p2-name-out var(--name-out-duration) forwards;
  animation-timing-function: var(--animation-curve);
}

.p1-flag-in {
  animation: ani-p1-flag-in var(--flag-in-duration) forwards;
  animation-timing-function: var(--animation-curve);
  animation-delay: var(--flag-in-delay);
}

.p2-flag-in {
  animation: ani-p2-flag-in var(--flag-in-duration) forwards;
  animation-timing-function: var(--animation-curve);
  animation-delay: var(--flag-in-delay);
}

.p1-flag-out {
  animation: ani-p1-flag-out var(--flag-out-duration) forwards;
  animation-timing-function: var(--animation-curve);
}

.p2-flag-out {
  animation: ani-p2-flag-out var(--flag-out-duration) forwards;
  animation-timing-function: var(--animation-curve);
}

.p1-side-in {
  animation: ani-p1-side-in var(--side-in-duration) forwards;
  animation-timing-function: var(--animation-curve);
}

.p2-side-in {
  animation: ani-p2-side-in var(--side-in-duration) forwards;
  animation-timing-function: var(--animation-curve);
}

.p1-side-out {
  animation: ani-p1-side-out var(--side-out-duration) forwards;
  animation-timing-function: var(--animation-curve);
}

.p2-side-out {
  animation: ani-p2-side-out var(--side-out-duration) forwards;
  animation-timing-function: var(--animation-curve);
}

@keyframes ani-main-panel-in {
  0% {
    top: calc(var(--main-panel-height) * -1);
  }
  100% {
    top: 0px;
  }
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

@keyframes ani-p1-name-in {
  0% {
    left: 10%;
    clip-path: var(--name-panel-p1-mask-start);
  }
  100% {
    left: var(--name-panel-offset);
    clip-path: var(--name-panel-mask-end);
  }
}

@keyframes ani-p1-name-out {
  0% {
    left: var(--name-panel-offset);
    clip-path: var(--name-panel-mask-end);
  }
  100% {
    left: 10%;
    clip-path: var(--name-panel-p1-mask-start);
  }
}

@keyframes ani-p2-name-in {
  0% {
    right: 10%;
    clip-path: var(--name-panel-p2-mask-start);
  }
  100% {
    right: var(--name-panel-offset);
    clip-path: var(--name-panel-mask-end);
  }
}

@keyframes ani-p2-name-out {
  0% {
    right: var(--name-panel-offset);
    clip-path: var(--name-panel-mask-end);
  }
  100% {
    right: 10%;
    clip-path: var(--name-panel-p2-mask-start);
  }
}

@keyframes ani-p1-flag-in {
  0% {
    left: var(--flag-start-x);
  }
  100% {
    left: var(--flag-end-x);
  }
}

@keyframes ani-p1-flag-out {
  0% {
    left: var(--flag-end-x);
  }
  100% {
    left: var(--flag-start-x);
  }
}

@keyframes ani-p2-flag-in {
  0% {
    right: var(--flag-start-x);
  }
  100% {
    right: var(--flag-end-x);
  }
}

@keyframes ani-p2-flag-out {
  0% {
    right: var(--flag-end-x);
  }
  100% {
    right: var(--flag-start-x);
  }
}

@keyframes ani-p1-side-in {
  0% {
    left: var(--side-start-x);
  }
  100% {
    left: var(--side-end-x);
  }
}

@keyframes ani-p1-side-out {
  0% {
    left: var(--side-end-x);
  }
  100% {
    left: var(--side-start-x);
  }
}

@keyframes ani-p2-side-in {
  0% {
    right: var(--side-start-x);
  }
  100% {
    right: var(--side-end-x);
  }
}

@keyframes ani-p2-side-out {
  0% {
    right: var(--side-end-x);
  }
  100% {
    right: var(--side-start-x);
  }
}
</style>
