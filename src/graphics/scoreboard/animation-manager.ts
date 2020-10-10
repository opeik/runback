import {
  Player,
  Players,
  Bracket,
  Scoreboard,
  Rules,
  ScoreboardView,
} from "Runback/_types/"
import Fitty from "./components/fitty.vue"

type EventCallback = (event: Event) => void

class Local {
  players = new Array<Player>()
  scores = new Array<number>()
  grand_final_is_winners = Array<boolean>()
  progress = ""
}

class Entering {
  main = true
  players = false
  bracket_stage = false
  grand_final_side = false
  scores = new Array<boolean>()
}

class Updating {
  players = false
  bracket_stage = false
  grand_final_side = false
  scores = new Array<boolean>()
}

export class AnimationManager {
  num_players: number = 2
  fitties: Fitty[] = []

  bracket = new Bracket()
  players = {} as Players
  scoreboard = new Scoreboard()
  view = {} as ScoreboardView

  local = new Local()
  entering = new Entering()
  updating = new Updating()

  constructor(
    num_players: number,
    bracket: Bracket,
    players: Players,
    scoreboard: Scoreboard,
    view: ScoreboardView
  ) {
    this.num_players = num_players
    this.bracket = bracket
    this.players = players
    this.scoreboard = scoreboard
    this.view = view

    this.local = {
      players: new Array<Player>(this.num_players).fill(new Player()),
      scores: new Array<number>(this.num_players).fill(0),
      grand_final_is_winners: new Array<boolean>(this.num_players).fill(false),
      progress: "",
    }

    this.entering = {
      main: true,
      players: false,
      bracket_stage: false,
      grand_final_side: false,
      scores: new Array<boolean>(this.num_players).fill(false),
    }

    this.updating = {
      players: false,
      bracket_stage: false,
      grand_final_side: false,
      scores: new Array<boolean>(this.num_players).fill(false),
    }
  }

  setup_animation_events(): void {
    this.animation_end_events.forEach((e) => {
      document.querySelector(e.id)?.addEventListener("animationend", e.c)
    })
  }

  setup_fitties(fitties: Fitty[]) {
    this.fitties = fitties
  }

  refit_text(): void {
    this.fitties.forEach((e) => e.fit())
  }

  text_wrapper_callback(event: Event | undefined, player_num: number): void {
    let animation_event = event! as AnimationEvent

    if (animation_event.animationName === "ani-text-in") {
      this.entering.scores[player_num] = false
    } else if (animation_event.animationName === "ani-text-out") {
      this.updating.scores[player_num] = false
      this.entering.scores[player_num] = true
      this.local.scores[player_num] = this.view.player_score_from_num(
        player_num
      )
    }
  }

  readonly animation_end_events: Array<{ id: string; c: EventCallback }> = [
    {
      id: "#main-panel-wrapper",
      c: (EventCallback) => {
        let animation_event = event! as AnimationEvent

        if (animation_event.animationName === "ani-main-panel-in") {
          this.entering.main = false
          this.entering.players = true
          this.entering.grand_final_side = true
          this.refit_text()
        }
      },
    },
    {
      id: "#p1-name-wrapper",
      c: (EventCallback) => {
        let animation_event = event! as AnimationEvent

        if (animation_event.animationName === "ani-p1-flag-in") {
          this.entering.players = false
        } else if (animation_event.animationName === "ani-p1-name-out") {
          this.local.players.forEach((e, i) => {
            this.local.players[i] = this.view.player_from_num(i)
          })

          this.updating.players = false
          this.entering.players = true
          this.refit_text()
        }
      },
    },
    {
      id: "#p1-games-text-wrapper",
      c: (EventCallback) => {
        this.text_wrapper_callback(event, 0)
      },
    },
    {
      id: "#p2-games-text-wrapper",
      c: (EventCallback) => {
        this.text_wrapper_callback(event, 1)
      },
    },
    {
      id: "#bracket-stage-text-wrapper",
      c: (EventCallback) => {
        let animation_event = event! as AnimationEvent

        if (animation_event.animationName === "ani-text-in") {
          this.entering.bracket_stage = false
        } else if (animation_event.animationName === "ani-text-out") {
          this.updating.bracket_stage = false
          this.entering.bracket_stage = true
          this.local.progress = this.view.progress
        }
      },
    },
    {
      id: "#p1-grand-final-side-wrapper",
      c: (EventCallback) => {
        let animation_event = event! as AnimationEvent

        if (animation_event.animationName === "ani-p1-grand_final_side-in") {
          this.entering.grand_final_side = false
        } else if (
          animation_event.animationName === "ani-p1-grand_final_side-out"
        ) {
          this.updating.grand_final_side = false

          if (this.view.is_grand_final) {
            this.entering.grand_final_side = true
          }

          this.local.players.forEach((e, i) => {
            this.local.grand_final_is_winners[
              i
            ] = this.view.player_is_winners_from_num(i)
          })
        }
      },
    },
  ]
}
