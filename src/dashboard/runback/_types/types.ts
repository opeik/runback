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

export class Appearance {
  static readonly Light = new Appearance(0, "Light")
  static readonly Dark = new Appearance(1, "Dark")
  static readonly Auto = new Appearance(2, "Automatic")

  private constructor(
    public readonly value: number,
    public readonly text: string
  ) {}

  static from_value(value: number): Appearance {
    return Object.values(this)[value]
  }
}

export class Settings {
  dark_mode: boolean = true
  live_dashboard_update: boolean = false
  api_keys: Record<string, string> = {}
  version: string = ""
  default_country: string = "AU"
  flip_commentator_sides: boolean = false
  appearance: Appearance = Appearance.Auto

  constructor() {
    this.api_keys[ApiProvider.Smash.text] = ""
  }
}

export class Event {
  name: string = ""
  id: string = ""
}

export class Tournament {
  tourney_api: ApiProvider = ApiProvider.Unset
  tourney_url: string = ""
  tourney_id: string = ""
  event_id: string = ""
  events: Record<string, Event> = {}
}
