import {
  Api,
  ApiProvider,
  Appearance,
  Player,
  PlayerOverride,
  PlayerScore,
  Commentator,
  Tournament,
} from "."

const num_players: number = 2
const num_commentators: number = 2

export class BracketReplicant {
  stage: number = 0
  side: number = 0
  custom_progress: string = ""
  custom_progress_enabled: boolean = false
}

export class CommentatorsReplicant {
  commentators: Commentator[] = new Array<Commentator>(num_commentators).fill(
    new Commentator()
  )
  overrides: PlayerOverride[] = new Array<PlayerOverride>(
    num_commentators
  ).fill(new PlayerOverride())
}

export type PlayersReplicant = Record<string, Player>

export class ScoreboardReplicant {
  scores: PlayerScore[] = new Array<PlayerScore>(num_players).fill(
    new PlayerScore()
  )
  overrides: PlayerOverride[] = new Array<PlayerOverride>(num_players).fill(
    new PlayerOverride()
  )
}

export class SettingsReplicant {
  dark_mode: boolean = true
  live_dashboard_update: boolean = false
  api_keys: Record<string, string> = {}
  version: string = ""
  default_country: string = "AU"
  flip_commentator_sides: boolean = false
  appearance: Appearance = Appearance.Auto
  auto_transliteration = true

  constructor() {
    this.api_keys[ApiProvider.Smash.text] = ""
  }
}

export class TournamentReplicant {
  tourney_api: ApiProvider = ApiProvider.Unset
  tourney_url: string = ""
  tourney_id: string = ""
  event_id: string = ""
  tourney: Tournament = new Tournament()
}

export class ApiReplicant {
  fetching = {
    events: false,
    entrants: false,
  }

  progress = {
    events: 0,
    entrants: 0,
  }
}
