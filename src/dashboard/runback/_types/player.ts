export class Player {
  id: string = ""
  name: string = ""
  team: string = ""
  gamertag: string = ""
  gamertag_latin: string = ""
  gamertag_latin_generated: string = ""
  country: string = ""
  twitter: string = ""
  api_ids: Record<string, string> = {}
}

export class PlayerOverride {
  should_override: boolean = false
  override: Player = new Player()
}

export class PlayerScore {
  player_id: string = ""
  score: number = 0
}
