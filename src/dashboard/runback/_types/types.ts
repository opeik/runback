import { Api, ApiProvider } from "./"

const num_players: number = 2
const num_commentators: number = 2

export class Bracket {
  stage: number = 0
  side: number = 0
  custom_progress: string = ""
  custom_progress_enabled: boolean = false
}

export class Commentator {
  player_id: string = ""
}

export class Commentators {
  commentators: Commentator[] = new Array<Commentator>(num_commentators).fill(
    new Commentator()
  )
  overrides: PlayerOverride[] = new Array<PlayerOverride>(
    num_commentators
  ).fill(new PlayerOverride())
}

export class Player {
  id: string = ""
  name: string = ""
  team: string = ""
  gamertag: string = ""
  country: string = ""
  twitter: string = ""
  api_ids: Record<string, string> = {}
}

export type Players = Record<string, Player>

export class PlayerOverride {
  should_override: boolean = false
  override: Player = new Player()
}

export class PlayerScore {
  player_id: string = ""
  score: number = 0
}

export class Scoreboard {
  scores: PlayerScore[] = new Array<PlayerScore>(num_players).fill(
    new PlayerScore()
  )
  overrides: PlayerOverride[] = new Array<PlayerOverride>(num_players).fill(
    new PlayerOverride()
  )
}

export class Settings {
  dark_mode: boolean = true
  live_dashboard_update: boolean = false
  api_keys: Record<string, string> = {}

  constructor() {
    this.api_keys[ApiProvider.Smash.text] = ""
  }
}

export class Event {
  tourney_api: Api = ApiProvider.Unset
  tourney_url: string = ""
  tourney_id: string = ""
  event_id: string = ""
}
