import {
  Bracket as BracketI,
  Commentator as CommentatorI,
  Commentators as CommentatorsI,
  Player as PlayerI,
  Players as PlayersI,
  PlayerOverride as PlayerOverrideI,
  PlayerScore as PlayerScoreI,
  Scoreboard as ScoreboardI,
  Settings as SettingsI,
} from "Runback/../../schemas"

const num_players: number = 2
const num_commentators: number = 2

export class Bracket implements BracketI {
  bracket_stage: number = 0
  bracket_side: number = 0
  grand_final_side: number = 0
  custom_progress: string = ""
  custom_progress_enabled: boolean = false

  static test(self: Bracket): void {
    console.log(self.bracket_side)
  }
}

export class Commentator implements CommentatorI {
  player_id: string = ""
}

export class Commentators implements CommentatorsI {
  commentators: Commentator[] = new Array<Commentator>(num_commentators).fill(
    new Commentator()
  )
  overrides: PlayerOverride[] = new Array<PlayerOverride>(
    num_commentators
  ).fill(new PlayerOverride())
}

export class Player implements PlayerI {
  id: string = ""
  smash_gg_id: string = ""
  name: string = ""
  team: string = ""
  gamertag: string = ""
  country: string = ""
  twitter: string = ""
}

export type Players = Record<string, Player>

export class PlayerOverride implements PlayerOverrideI {
  should_override: boolean = false
  override: Player = new Player()
}

export class PlayerScore implements PlayerScoreI {
  player_id: string = ""
  score: number = 0
}

export class Scoreboard implements ScoreboardI {
  scores: PlayerScore[] = new Array<PlayerScore>(num_players).fill(
    new PlayerScore()
  )
  overrides: PlayerOverride[] = new Array<PlayerOverride>(num_players).fill(
    new PlayerOverride()
  )
}

export class Settings implements SettingsI {
  dark_mode: boolean = true
  live_dashboard_update: boolean = false
  smash_gg_api_key: string = ""
}
