import { ApiProvider, Tournament } from "./runback/_types"
import * as SmashApi from "./api/smash"

export async function fetch_tourney_events(
  api_key: string,
  api_provider: ApiProvider,
  tourney_url: string,
  progress_callback: Function
): Promise<Tournament> {
  switch (api_provider.value) {
    case ApiProvider.Smash.value:
      return SmashApi.fetch_tourney_events(
        api_key,
        tourney_url,
        progress_callback
      )
    default:
      throw new Error("Invalid API provider")
  }
}

export async function fetch_tourney_entrants(
  api_key: string,
  api_provider: ApiProvider,
  tourney: Tournament,
  progress_callback: Function
): Promise<Tournament> {
  switch (api_provider.value) {
    case ApiProvider.Smash.value:
      return SmashApi.fetch_tourney_entrants(
        api_key,
        tourney,
        progress_callback
      )
    default:
      throw new Error("Invalid API provider")
  }
}
