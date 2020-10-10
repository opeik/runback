<template>
  <div id="scoreboard">
    <div
      id="back-panel-wrapper"
      :class="entering.main ? 'back-in main-initial' : ''"
    >
      <img id="back-panel" src="./img/back.svg" />
    </div>

    <div
      id="main-panel-wrapper"
      :class="entering.main ? 'main-in main-initial' : ''"
    >
      <img id="main-panel" src="./img/main.svg" />

      <div
        id="progress-text-wrapper"
        :class="[
          entering.progress ? 'text-in' : '',
          updating.progress ? 'text-out' : '',
        ]"
      >
        <fitty
          id="progress-text"
          :options="{ minSize: 1, maxSize: progressFontSize, multiLine: false }"
        >
          {{ local.progress }}
        </fitty>
      </div>

      <div
        id="p1-games-text-wrapper"
        class="games-text-wrapper"
        :class="[
          entering.p1Games ? 'text-in' : '',
          updating.p1Games ? 'text-out' : '',
        ]"
      >
        <fitty
          class="games-text"
          :options="{ minSize: 1, maxSize: 55, multiLine: false }"
        >
          {{ local.p1.games }}
        </fitty>
      </div>

      <div
        id="p2-games-text-wrapper"
        class="games-text-wrapper"
        :class="[
          entering.p2Games ? 'text-in' : '',
          updating.p2Games ? 'text-out' : '',
        ]"
      >
        <fitty
          class="games-text"
          :options="{ minSize: 1, maxSize: 55, multiLine: false }"
        >
          {{ local.p2.games }}
        </fitty>
      </div>

      <div
        id="p1-side-wrapper"
        class="side-wrapper"
        :class="[
          entering.side && isGrandFinals ? 'p1-side-in' : '',
          entering.main || !isGrandFinals ? 'p1-side-initial' : '',
          updating.side ? 'p1-side-out' : '',
        ]"
      >
        <img :src="p1SidePanelPath" />
        <div id="p1-side-text" class="side-text-wrapper">
          <span>
            {{ local.p1.side }}
          </span>
        </div>
      </div>

      <div
        id="p2-side-wrapper"
        class="side-wrapper"
        :class="[
          entering.side && isGrandFinals ? 'p2-side-in' : '',
          entering.main || !isGrandFinals ? 'p2-side-initial' : '',
          updating.side ? 'p2-side-out' : '',
        ]"
      >
        <img :src="p2SidePanelPath" />
        <div id="p2-side-text" class="side-text-wrapper">
          <span>
            {{ local.p2.side }}
          </span>
        </div>
      </div>

      <div
        id="p1-name-wrapper"
        class="name-wrapper"
        :class="[
          entering.players ? 'p1-name-in' : '',
          entering.main ? 'p1-name-initial' : '',
          updating.players ? 'p1-name-out' : '',
        ]"
      >
        <img src="./img/name1.svg" />

        <div
          id="p1-name-text-wrapper"
          class="name-text-wrapper"
          :class="isGrandFinals ? 'name-text-small' : ''"
        >
          <fitty
            ref="p1NameFitty"
            :options="{ minSize: 1, maxSize: p1NameFontSize, multiLine: false }"
          >
            <span class="team-text">
              {{ local.p1.team }}
            </span>

            <span class="gamertag-text">
              {{ local.p1.gamerTag }}
            </span>
          </fitty>
        </div>

        <div
          id="p1-flag-wrapper"
          class="flag-wrapper"
          :class="[
            entering.players ? 'p1-flag-in p1-flag-initial' : '',
            entering.main ? 'hidden' : '',
            updating.players ? 'p1-flag-out' : '',
          ]"
        >
          <div class="flag-mask">
            <img class="flag" :src="flagPath(local.p1.country)" />
          </div>
        </div>
      </div>

      <div
        id="p2-name-wrapper"
        class="name-wrapper"
        :class="[
          entering.players ? 'p2-name-in' : '',
          entering.main ? 'p2-name-initial' : '',
          updating.players ? 'p2-name-out' : '',
        ]"
      >
        <img src="./img/name2.svg" />

        <div
          id="p2-name-text-wrapper"
          class="name-text-wrapper"
          :class="isGrandFinals ? 'name-text-small' : ''"
        >
          <fitty
            ref="p2NameFitty"
            :options="{ minSize: 1, maxSize: p2NameFontSize, multiLine: false }"
          >
            <span class="team-text">
              {{ local.p2.team }}
            </span>

            <span class="gamertag-text">
              {{ local.p2.gamerTag }}
            </span>
          </fitty>
        </div>

        <div
          id="p2-flag-wrapper"
          class="flag-wrapper"
          :class="[
            entering.players ? 'p2-flag-in p2-flag-initial' : '',
            entering.main ? 'hidden' : '',
            updating.players ? 'p2-flag-out' : '',
          ]"
        >
          <div class="flag-mask">
            <img class="flag" :src="flagPath(local.p2.country)" />
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
import { Bracket, Player, Players, Scoreboard, Rules } from "Runback/_types"
import CJK from "cjk-regex"

type EventCallback = (event: Event) => void

@Component
export default class App extends Vue {
  @State((state) => state.Runback.players) playersState!: Players
  @State((state) => state.Runback.scoreboard) scoreboardState!: Scoreboard
  @State((state) => state.Runback.bracket) bracketState!: Bracket

  @Ref("p1NameFitty") p1NameFitty!: Fitty
  @Ref("p2NameFitty") p2NameFitty!: Fitty

  local = {
    progress: "" as string,

    p1: {
      gamerTag: "" as string,
      team: "" as string,
      games: 0 as number,
      country: "" as string,
      side: "" as string,
    },

    p2: {
      gamerTag: "" as string,
      team: "" as string,
      games: 0 as number,
      country: "" as string,
      side: "" as string,
    },
  }

  entering = {
    main: true as boolean,
    players: false as boolean,
    progress: false as boolean,
    p1Games: false as boolean,
    p2Games: false as boolean,
    side: false as boolean,
  }

  updating = {
    progress: false as boolean,
    players: false as boolean,
    p1Games: false as boolean,
    p2Games: false as boolean,
    side: false as boolean,
  }

  updateQueue = []

  readonly cjkFontSizeRatio = 0.8
  readonly cjkRegex = CJK().toRegExp()

  fontSizes = {
    name: 45,
    progress: 35,
  }

  readonly rules = new Rules()
  readonly progressList = this.rules.stage_list
  readonly sideList = this.rules.side_list
  readonly finalsList = this.rules.grand_final_list
  readonly finalsIsWinner = this.rules.grand_final_is_winner

  readonly winnersText = this.rules.winners_text
  readonly losersText = this.rules.losers_text
  readonly grandFinals: number = 13

  get players(): Players {
    return this.playersState
  }

  get scoreboard(): Scoreboard {
    return this.scoreboardState
  }

  get bracket(): Bracket {
    return this.bracketState
  }

  gamerTag(playerIndex: number): string {
    let player_id = this.scoreboard.scores[playerIndex].player_id
    if (!(player_id in this.players)) {
      return ""
    }

    return this.scoreboard.overrides[playerIndex].should_override
      ? this.scoreboard.overrides[playerIndex].override.gamertag
      : this.players[this.scoreboard.scores[playerIndex].player_id].gamertag ||
          ""
  }

  games(playerIndex: number): number {
    return this.scoreboard.scores[playerIndex].score || 0
  }

  team(playerIndex: number): string {
    let player_id = this.scoreboard.scores[playerIndex].player_id
    if (!(player_id in this.players)) {
      return ""
    }

    return this.scoreboard.overrides[playerIndex].should_override
      ? this.scoreboard.overrides[playerIndex].override.team
      : this.players[this.scoreboard.scores[playerIndex].player_id].team
  }

  sideWrapper(playerIndex: number): string {
    let isWinner =
      playerIndex === 0
        ? this.finalsIsWinner[this.bracket.grand_final_side - 1][0]
        : this.finalsIsWinner[this.bracket.grand_final_side - 1][1]

    return isWinner ? this.winnersText : this.losersText
  }

  progressWrapper(): string {
    const noneSide: number = 1
    let progress: string = ""

    if (this.bracket.custom_progress_enabled)
      progress = this.bracket.custom_progress
    else if (
      this.bracket.bracket_stage === this.grandFinals ||
      this.bracket.bracket_side === noneSide
    ) {
      progress = this.progressList[this.bracket.bracket_stage - 1].text
    } else {
      progress =
        this.sideList[this.bracket.bracket_side - 1].text +
        " " +
        this.progressList[this.bracket.bracket_stage - 1].text
    }

    return progress
  }

  country(playerIndex: number): string {
    let player_id = this.scoreboard.scores[playerIndex].player_id
    if (!(player_id in this.players)) {
      return "AU"
    }

    return this.scoreboard.overrides[playerIndex].should_override
      ? this.scoreboard.overrides[playerIndex].override.country
      : this.players[this.scoreboard.scores[playerIndex].player_id].country
  }

  flagPath(country: string): string {
    if (country.length === 0) {
      country = "au"
    }

    return require("./img/region-flags/svg/" + country.toUpperCase() + ".svg")
  }

  sidePanelPath(playerIndex: number): string {
    let base: string = "./img/side" + (playerIndex + 1) + "-"
    let isWinner: boolean =
      (playerIndex === 0 ? this.local.p1.side : this.local.p2.side) ===
      this.winnersText
    base += isWinner ? "winners" : "losers"

    return require(base + ".svg")
  }

  get p1SidePanelPath(): string {
    return this.sidePanelPath(0)
  }

  get p2SidePanelPath(): string {
    return this.sidePanelPath(1)
  }

  containsCjk(s: string): boolean {
    return this.cjkRegex.test(s)
  }

  nameFontSize(playerIndex: number): number {
    let base = this.fontSizes.name

    return this.containsCjk(this.team(playerIndex)) ||
      this.containsCjk(this.gamerTag(playerIndex))
      ? base * this.cjkFontSizeRatio
      : base
  }

  get progressFontSize(): number {
    let base = this.fontSizes.progress

    return this.containsCjk(this.progress) ? base * this.cjkFontSizeRatio : base
  }

  get p1NameFontSize(): number {
    return this.nameFontSize(0)
  }

  get p2NameFontSize(): number {
    return this.nameFontSize(1)
  }

  refitNameText(): void {
    this.p1NameFitty.fit()
    this.p2NameFitty.fit()
  }

  created(): void {
    this.local.p1.gamerTag = this.p1GamerTag
    this.local.p1.team = this.p1Team
    this.local.p1.games = this.p1Games
    this.local.p1.country = this.p1Country

    this.local.p2.gamerTag = this.p2GamerTag
    this.local.p2.team = this.p2Team
    this.local.p2.games = this.p2Games
    this.local.p2.country = this.p2Country

    this.local.p1.side = this.p1Side
    this.local.p2.side = this.p2Side

    this.local.progress = this.progress
  }

  readonly animationEndEvents: Array<{ id: string; c: EventCallback }> = [
    {
      id: "#main-panel-wrapper",
      c: (EventCallback) => {
        if ((event as AnimationEvent)!.animationName === "ani-main-panel-in") {
          this.entering.main = false
          this.entering.players = true
          this.entering.side = true
          this.refitNameText()
        }
      },
    },
    {
      id: "#p1-name-wrapper",
      c: (EventCallback) => {
        if ((event as AnimationEvent)!.animationName === "ani-p1-flag-in") {
          this.entering.players = false
        } else if (
          (event as AnimationEvent)!.animationName === "ani-p1-name-out"
        ) {
          this.local.p1.gamerTag = this.p1GamerTag
          this.local.p1.team = this.p1Team
          this.local.p1.country = this.p1Country

          this.local.p2.gamerTag = this.p2GamerTag
          this.local.p2.team = this.p2Team
          this.local.p2.country = this.p2Country

          this.updating.players = false
          this.entering.players = true
          this.refitNameText()
        }
      },
    },
    {
      id: "#p1-games-text-wrapper",
      c: (EventCallback) => {
        if ((event as AnimationEvent)!.animationName === "ani-text-in") {
          this.entering.p1Games = false
        } else if (
          (event as AnimationEvent)!.animationName === "ani-text-out"
        ) {
          this.updating.p1Games = false
          this.entering.p1Games = true
          this.local.p1.games = this.p1Games
        }
      },
    },
    {
      id: "#p2-games-text-wrapper",
      c: (EventCallback) => {
        if ((event as AnimationEvent)!.animationName === "ani-text-in") {
          this.entering.p2Games = false
        } else if (
          (event as AnimationEvent)!.animationName === "ani-text-out"
        ) {
          this.updating.p2Games = false
          this.entering.p2Games = true
          this.local.p2.games = this.p2Games
        }
      },
    },
    {
      id: "#progress-text-wrapper",
      c: (EventCallback) => {
        if ((event as AnimationEvent)!.animationName === "ani-text-in") {
          this.entering.progress = false
        } else if (
          (event as AnimationEvent)!.animationName === "ani-text-out"
        ) {
          this.updating.progress = false
          this.entering.progress = true
          this.local.progress = this.progress
        }
      },
    },
    {
      id: "#p1-side-wrapper",
      c: (EventCallback) => {
        if ((event as AnimationEvent)!.animationName === "ani-p1-side-in") {
          this.entering.side = false
        } else if (
          (event as AnimationEvent)!.animationName === "ani-p1-side-out"
        ) {
          this.updating.side = false

          if (this.isGrandFinals) {
            this.entering.side = true
          }

          this.local.p1.side = this.p1Side
          this.local.p2.side = this.p2Side
        }
      },
    },
  ]

  setupAnimationEndEvents(): void {
    this.animationEndEvents.forEach((e) => {
      document.querySelector(e.id)!.addEventListener("animationend", e.c)
    })
  }

  mounted(): void {
    this.setupAnimationEndEvents()
    this.refitNameText()
  }

  get progress(): string {
    return this.progressWrapper()
  }

  isGrandFinalsWrapper(): boolean {
    return this.bracket.bracket_stage === this.grandFinals
  }

  get isGrandFinals(): boolean {
    return this.isGrandFinalsWrapper()
  }

  @Watch("progress")
  progressWatch(newValue: string, oldValue: string): void {
    if (this.isGrandFinals) {
      this.entering.side = true
      this.refitNameText()
    } else if (oldValue === this.progressList[this.grandFinals - 1].text) {
      this.updating.side = true
      this.refitNameText()
    }

    this.updating.progress = true
  }

  get p1GamerTag(): string {
    return this.gamerTag(0)
  }

  get p1Side(): string {
    return this.sideWrapper(0)
  }

  @Watch("p1Side")
  p1SideWatch(newValue: string, oldValue: string): void {
    if (this.bracket.bracket_stage === this.grandFinals) {
      this.updating.side = true
    }
  }

  get p2Side(): string {
    return this.sideWrapper(1)
  }

  @Watch("p2Side")
  p2SideWatch(newValue: string, oldValue: string): void {
    if (this.bracket.bracket_stage === this.grandFinals) {
      this.updating.side = true
    }
  }

  @Watch("p1GamerTag")
  p1GamerTagWatch(newValue: string, oldValue: string): void {
    this.updating.players = true
  }

  get p1Team(): string {
    return this.team(0)
  }

  @Watch("p1Team")
  p1TeamWatch(newValue: string, oldValue: string): void {
    this.updating.players = true
  }

  get p1Games(): number {
    return this.games(0)
  }

  @Watch("p1Country")
  p1CountryWatch(newValue: string, oldValue: string): void {
    this.updating.players = true
  }

  get p2GamerTag(): string {
    return this.gamerTag(1)
  }

  @Watch("p1Games")
  p1GamesWatch(newValue: number, oldValue: number): void {
    this.updating.p1Games = true
  }

  get p1Country(): string {
    return this.country(0)
  }

  @Watch("p2GamerTag")
  p2GamerTagWatch(newValue: string, oldValue: string): void {
    this.updating.players = true
  }

  get p2Team(): string {
    return this.team(1)
  }

  @Watch("p2Team")
  p2TeamWatch(newValue: string, oldValue: string): void {
    this.updating.players = true
  }

  get p2Country(): string {
    return this.country(1)
  }

  @Watch("p2Country")
  p2CountryWatch(newValue: string, oldValue: string): void {
    this.updating.players = true
  }

  get p2Games(): number {
    return this.games(1)
  }

  @Watch("p2Games")
  p2GamesWatch(newValue: number, oldValue: number): void {
    this.updating.p2Games = true
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

#p1-side-wrapper {
  left: var(--side-end-x);
}

#p2-side-wrapper {
  right: var(--side-end-x);
}

.hidden {
  opacity: 0;
}

.p1-side-initial {
  left: var(--side-start-x) !important;
}

.p2-side-initial {
  right: var(--side-start-x) !important;
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
