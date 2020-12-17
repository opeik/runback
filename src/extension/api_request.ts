import got from "got"
import type { ReplicantBrowser } from "nodecg/types/browser"
import Types = require("src/extension/runback/_types/types")
import Api = require("src/extension/runback/_types/api")
import Settings = Types.Settings
import ApiProvider = Api.ApiProvider

export async function fetch_tourney_data(tourney_url: string): Promise<void> {
  try {
    const query = `
    query EventEntrants($eventId: ID!, $page: Int!, $perPage: Int!) {
      event(id: $eventId) {
        id
        name
        entrants(query: {
          page: $page
          perPage: $perPage
        }) {
          pageInfo {
            total
            totalPages
          }
          nodes {
            id
            participants {
              id
              gamerTag
            }
          }
        }
      }
    }
    `

    const variables = {
      eventId: 534067,
      page: 1,
      perPage: 0,
    }

    let settings: ReplicantBrowser<Settings> = nodecg.Replicant("Settings")
    const api_key = settings.value!.api_keys[ApiProvider.Smash.text]

    const response = await got.post("https://api.smash.gg/gql/alpha", {
      json: {
        query: query,
        variables: variables,
      },
      headers: {
        Authorization: api_key,
      },
      responseType: "json",
    })

    console.log(response.body)
  } catch (error) {
    console.log(error.response.body)
  }
}
