
<template>
  <div id="scoreboard">
    <div
      id="back-panel-wrapper"
      :class="animation.entering.main ? 'back-in main-initial' : ''"
    >
      <img id="back-panel" src="./img/back.svg" />
    </div>

    <div
      id="main-panel-wrapper"
      :class="animation.entering.main ? 'main-in main-initial' : ''"
    >
      <img id="main-panel" src="./img/main.svg" />

      <div
        id="bracket-stage-text-wrapper"
        :class="[
          animation.entering.bracket_stage ? 'text-in' : '',
          animation.updating.bracket_stage ? 'text-out' : '',
        ]"
      >
        <fitty
          id="bracket-stage-text"
          :options="{
            minSize: 1,
            maxSize: font_sizes.bracket_stage,
            multiLine: false,
          }"
        >
          {{ animation.local.progress }}
        </fitty>
      </div>

      <div
        id="p1-games-text-wrapper"
        class="games-text-wrapper"
        :class="[
          animation.entering.scores[0] ? 'text-in' : '',
          animation.updating.scores[0] ? 'text-out' : '',
        ]"
      >
        <fitty
          class="games-text"
          :options="{ minSize: 1, maxSize: 55, multiLine: false }"
        >
          {{ animation.local.scores[0] }}
        </fitty>
      </div>

      <div
        id="p2-games-text-wrapper"
        class="games-text-wrapper"
        :class="[
          animation.entering.scores[1] ? 'text-in' : '',
          animation.updating.scores[1] ? 'text-out' : '',
        ]"
      >
        <fitty
          class="games-text"
          :options="{ minSize: 1, maxSize: 55, multiLine: false }"
        >
          {{ animation.local.scores[1] }}
        </fitty>
      </div>

      <div
        id="p1-grand-final-side-wrapper"
        class="grand-final-side-wrapper"
        :class="[
          animation.entering.grand_final_side && view.is_grand_final
            ? 'p1-grand-final-side-in'
            : '',
          animation.entering.main || !view.is_grand_final
            ? 'p1-grand-final-side-initial'
            : '',
          animation.updating.grand_final_side ? 'p1-grand_final-side-out' : '',
        ]"
      >
        <img :src="side_panel_path(0)" />
        <div
          id="p1-grand-final-side-text"
          class="grand-final-side-text-wrapper"
        >
          <span>
            {{
              animation.local.grand_final_is_winners[0]
                ? rules.winners_text
                : rules.losers_text
            }}
          </span>
        </div>
      </div>

      <div
        id="p2-grand-final-side-wrapper"
        class="grand-final-side-wrapper"
        :class="[
          animation.entering.grand_final_side && view.is_grand_final
            ? 'p2-grand-final-side-in'
            : '',
          animation.entering.main || !view.is_grand_final
            ? 'p2-grand-final-side-initial'
            : '',
          animation.updating.grand_final_side ? 'p2-grand_final-side-out' : '',
        ]"
      >
        <img :src="side_panel_path(1)" />
        <div
          id="p2-grand-final-side-text"
          class="grand-final-side-text-wrapper"
        >
          <span>
            {{
              animation.local.grand_final_is_winners[1]
                ? rules.winners_text
                : rules.losers_text
            }}
          </span>
        </div>
      </div>

      <div
        id="p1-name-wrapper"
        class="name-wrapper"
        :class="[
          animation.entering.players ? 'p1-name-in' : '',
          animation.entering.main ? 'p1-name-initial' : '',
          animation.updating.players ? 'p1-name-out' : '',
        ]"
      >
        <img src="./img/name1.svg" />

        <div
          id="p1-name-text-wrapper"
          class="name-text-wrapper"
          :class="view.is_grand_final ? 'name-text-small' : ''"
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
              {{ animation.local.players[0].team }}
            </span>

            <span class="gamertag-text">
              {{ animation.local.players[0].gamertag }}
            </span>
          </fitty>
        </div>

        <div
          id="p1-flag-wrapper"
          class="flag-wrapper"
          :class="[
            animation.entering.players ? 'p1-flag-in p1-flag-initial' : '',
            animation.entering.main ? 'hidden' : '',
            animation.updating.players ? 'p1-flag-out' : '',
          ]"
        >
          <div class="flag-mask">
            <img
              class="flag"
              :src="flag_image_path(animation.local.players[0].country)"
            />
          </div>
        </div>
      </div>

      <div
        id="p2-name-wrapper"
        class="name-wrapper"
        :class="[
          animation.entering.players ? 'p2-name-in' : '',
          animation.entering.main ? 'p2-name-initial' : '',
          animation.updating.players ? 'p2-name-out' : '',
        ]"
      >
        <img src="./img/name2.svg" />

        <div
          id="p2-name-text-wrapper"
          class="name-text-wrapper"
          :class="view.is_grand_final ? 'name-text-small' : ''"
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
              {{ animation.local.players[1].team }}
            </span>

            <span class="gamertag-text">
              {{ animation.local.players[1].gamertag }}
            </span>
          </fitty>
        </div>

        <div
          id="p2-flag-wrapper"
          class="flag-wrapper"
          :class="[
            animation.entering.players ? 'p2-flag-in p2-flag-initial' : '',
            animation.entering.main ? 'hidden' : '',
            animation.updating.players ? 'p2-flag-out' : '',
          ]"
        >
          <div class="flag-mask">
            <img
              class="flag"
              :src="flag_image_path(animation.local.players[1].country)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator"
import { State } from "vuex-class"
import Fitty from "./components/fitty.vue"
import {
  Player,
  Players,
  Bracket,
  Scoreboard,
  Rules,
  ScoreboardView,
} from "Runback/_types/"
import Countries from "i18n-iso-countries"
import { AnimationManager } from "./animation-manager"
import CJK from "cjk-regex"
import cjk_regex from "cjk-regex"

@Component
export default class App extends Vue {
  @State((state) => state.Runback.players) players!: Players
  @State((state) => state.Runback.scoreboard) scoreboard!: Scoreboard
  @State((state) => state.Runback.bracket) bracket!: Bracket
  @Ref("p1-name-fitty") p1_name_fitty!: Fitty
  @Ref("p2-name-fitty") p2_name_fitty!: Fitty

  readonly cjk_regex = CJK().toRegExp()
  readonly rules = new Rules()
  readonly cjk_font_size_ratio = 0.8
  readonly num_players = 2
  readonly font_sizes = {
    name: 45,
    bracket_stage: 35,
  }

  view: ScoreboardView = {} as ScoreboardView
  animation: AnimationManager = {} as AnimationManager

  created(): void {
    this.view = new ScoreboardView(
      this.num_players,
      this.bracket,
      this.players,
      this.scoreboard
    )
    this.animation = new AnimationManager(
      this.num_players,
      this.bracket,
      this.players,
      this.scoreboard,
      this.view
    )
  }

  mounted(): void {
    this.animation.setup_fitties([this.p1_name_fitty, this.p2_name_fitty])
    this.animation.setup_animation_events()
  }

  side_panel_path(player_num: number): string {
    const base: string = "./img/side" + (player_num + 1) + "-"
    const is_winners = this.view.player_is_winners_from_num(player_num)
    const url = base + (is_winners ? "winners" : "losers")

    return require(url + ".svg")
  }

  flag_image_path(country: string): string {
    if (country.length === 0) {
      country = "au"
    }

    return require("./img/region-flags/svg/" + country.toUpperCase() + ".svg")
  }

  does_contain_cjk(s: string): boolean {
    return this.cjk_regex.test(s)
  }

  name_font_size(player_num: number): number {
    const base_size = this.font_sizes.name
    const player = this.view.player_from_num(player_num)
    const contains_cjk =
      this.does_contain_cjk(player.gamertag) ||
      this.does_contain_cjk(player.team)

    return contains_cjk ? base_size * this.cjk_font_size_ratio : base_size
  }

  // The Wall of Watches™
  did_first_update = {
    progress: false,
    grand_final_side: new Array<boolean>(this.num_players).fill(false),
    gamertag: new Array<boolean>(this.num_players).fill(false),
    country: new Array<boolean>(this.num_players).fill(false),
    team: new Array<boolean>(this.num_players).fill(false),
    score: new Array<boolean>(this.num_players).fill(false),
  }

  @Watch("view.progress")
  progressWatch(_: string, old_value: string): void {
    if (!this.did_first_update.progress) {
      this.did_first_update.progress = true
      return
    }

    console.log("Progress")

    if (this.view.is_grand_final) {
      this.animation.entering.grand_final_side = true
      this.animation.refit_text()
    } else if (
      old_value === this.rules.stage_name(this.rules.grand_final_stage_num)
    ) {
      this.animation.updating.grand_final_side = true
      this.animation.refit_text()
    }

    this.animation.updating.bracket_stage = true
  }

  on_grand_final_side_change(old_value: string, player_num: number): void {
    if (!this.did_first_update.grand_final_side[player_num]) {
      this.did_first_update.grand_final_side[player_num] = true
      return
    }

    if (this.bracket.bracket_stage === this.rules.grand_final_stage_num) {
      this.animation.updating.grand_final_side = true
    }
  }

  @Watch("view.p1_grand_final_side")
  on_p1_grand_final_side_change(_: string, old_value: string): void {
    this.on_grand_final_side_change(old_value, 0)
  }

  @Watch("view.p1_grand_final_side")
  on_p2_grand_final_side_change(_: string, old_value: string): void {
    this.on_grand_final_side_change(old_value, 1)
  }

  on_player_change(player_num: number, key: string): void {
    if (!((this.did_first_update as any)[key] as any)[player_num]) {
      ;((this.did_first_update as any)[key] as any)[player_num] = true
      return
    }

    this.animation.updating.players = true
  }

  @Watch("view.p1_gamertag")
  on_p1_gamertag_change(_: string, old_value: string): void {
    this.on_player_change(0, "gamertag")
  }

  @Watch("view.p2_gamertag")
  on_p2_gamertag_change(_: string, old_value: string): void {
    this.on_player_change(1, "gamertag")
  }

  @Watch("view.p1_team")
  on_p1_team_change(_: string, old_value: string): void {
    this.on_player_change(0, "team")
  }

  @Watch("view.p2_team")
  on_p2_team_change(_: string, old_value: string): void {
    this.on_player_change(1, "team")
  }

  @Watch("view.p1_country")
  on_p1_country_change(_: string, old_value: string): void {
    this.on_player_change(0, "country")
  }

  @Watch("view.p2_country")
  on_p2_country_change(_: string, old_value: string): void {
    this.on_player_change(1, "country")
  }

  on_score_change(player_num: number) {
    if (!this.did_first_update.score[player_num]) {
      this.did_first_update.score[player_num] = true
      return
    }
  }

  @Watch("view.p1_score")
  on_p1_score_change(_: number, old_value: number): void {
    this.on_score_change(0)
  }

  @Watch("view.p2_score")
  on_p2_score_change(_: number, old_value: number): void {
    this.on_score_change(1)
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

  --grand-final-side-panel-height: calc(var(--main-panel-height) * 0.5);
  --grand-final-side-panel-width: 43px;
  --grand-final-side-text-height: var(--grand-final-side-panel-height);
  --grand-final-side-text-width: var(--grand-final-side-panel-width);
  --grand-final-side-start-x: 1px;
  --grand-final-side-end-x: calc(
    var(--grand-final-side-panel-width) * 0.8 * -1
  );

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

  --bracket_stage-text-width: calc(var(--main-panel-width) * 0.65);
  --bracket_stage-text-height: calc(var(--main-panel-height) * 0.55);
  --bracket_stage-text-offset-x: calc(var(--main-panel-width) * 0.5);
  --bracket_stage-text-offset-y: calc(
    var(--main-panel-height) * 0.35 - (var(--bracket_stage-text-height) * 0.5)
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
  --grand-final-side-in-duration: 0.5s;
  --grand-final-side-out-duration: 0.5s;

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

#bracket-stage-text-wrapper {
  position: absolute;
  top: var(--bracket_stage-text-offset-y);
  left: var(--bracket_stage-text-offset-x);
  width: var(--bracket_stage-text-width);
  height: var(--bracket_stage-text-height);
  line-height: var(--bracket_stage-text-height);
  text-align: center;
  transform: translateX(-50%);
}

#bracket-stage-text {
  color: white;
  font-family: "Bebas Neue Regular", "Rounded Mplus Regular";
}

#p1-name-wrapper {
  left: var(--name-panel-offset);
  padding-left: var(--flag-width);
  margin-left: calc(var(--flag-width) * -1);
}

#p2-name-wrapper {
  right: var(--name-panel-offset);
  padding-right: var(--flag-width);
  margin-right: calc(var(--flag-width) * -1);
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

#p1-grand-final-side-wrapper {
  left: var(--grand-final-side-end-x);
}

#p2-grand-final-side-wrapper {
  right: var(--grand-final-side-end-x);
}

.hidden {
  opacity: 0;
}

.p1-grand-final-side-initial {
  left: var(--grand-final-side-start-x) !important;
}

.p2-grand-final-side-initial {
  right: var(--grand-final-side-start-x) !important;
}

.main-initial {
  top: calc(var(--main-panel-height) * -1) !important;
}

.p1-name-initial {
  clip-path: var(--name-panel-p1-mask-start);
}

.p1-flag-initial {
  left: var(--flag-start-x) !important;
}

.p2-flag-initial {
  right: var(--flag-start-x) !important;
}

.p2-name-initial {
  clip-path: var(--name-panel-p2-mask-start);
}

.grand-final-side-wrapper {
  position: absolute;
  height: var(--grand-final-side-panel-height);
  width: var(--grand-final-side-panel-width);
  top: 0;
  z-index: -1;
  overflow: visible;
  filter: drop-shadow(0px 2px 5px #222);
}

.grand-final-side-text-wrapper {
  position: absolute;
  height: var(--grand-final-side-text-height);
  width: var(--grand-final-side-text-width);
  top: 0;
  font-family: "Bebas Neue Bold";
  text-align: center;
  line-height: var(--grand-final-side-panel-height);
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
    var(--name-text-width) - (var(--grand-final-side-panel-width) * 0.85)
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

.p1-grand-final-side-in {
  animation: ani-p1-grand-final-side-in var(--grand-final-side-in-duration)
    forwards;
  animation-timing-function: var(--animation-curve);
}

.p2-grand-final-side-in {
  animation: ani-p2-grand-final-side-in var(--grand-final-side-in-duration)
    forwards;
  animation-timing-function: var(--animation-curve);
}

.p1-grand-final-side-out {
  animation: ani-p1-grand-final-side-out var(--grand-final-side-out-duration)
    forwards;
  animation-timing-function: var(--animation-curve);
}

.p2-grand-final-side-out {
  animation: ani-p2-grand-final-side-out var(--grand-final-side-out-duration)
    forwards;
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

@keyframes ani-p1-grand-final-side-in {
  0% {
    left: var(--grand-final-side-start-x);
  }
  100% {
    left: var(--grand-final-side-end-x);
  }
}

@keyframes ani-p1-grand-final-side-out {
  0% {
    left: var(--grand-final-side-end-x);
  }
  100% {
    left: var(--grand-final-side-start-x);
  }
}

@keyframes ani-p2-grand-final-side-in {
  0% {
    right: var(--grand-final-side-start-x);
  }
  100% {
    right: var(--grand-final-side-end-x);
  }
}

@keyframes ani-p2-grand-final-side-out {
  0% {
    right: var(--grand-final-side-end-x);
  }
  100% {
    right: var(--grand-final-side-start-x);
  }
}
</style>
