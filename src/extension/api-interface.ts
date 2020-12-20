import { Settings, ApiProvider } from "./runback/_types"
import * as SmashApi from "./api/smash"

export class Entrant {
  id: string = ""
  name: string = ""
  gamertag: string = ""
  team: string = ""
  country: string = ""
}

export class Event {
  id: string = ""
  name: string = ""
  entrants: Array<Entrant> = []
}

export class Tournament {
  id: string = ""
  name: string = ""
  events: Array<Event> = []
}

export async function fetch_tourney_data(
  api_key: string,
  api_provider: ApiProvider,
  tourney_url: string
): Promise<any> {
  switch (api_provider.value) {
    case ApiProvider.Smash.value:
      return SmashApi.fetch_tourney_data(api_key, tourney_url)
    default:
      throw new Error("Invalid API provider")
  }
}
