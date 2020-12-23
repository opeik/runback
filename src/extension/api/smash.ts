import { Event, Tournament, Player } from "../runback/_types"
import countryList from "country-list"
import got from "got"

interface EventEntrantsResponse {
  event: {
    id: string
    name: string
    entrants: {
      pageInfo: {
        total: number
        totalPages: number
      }
      nodes: Array<{
        participants: Array<{
          gamerTag: string
          prefix: string
          user: {
            id: string
            name: string
            location: {
              country: string
            }
            player: {
              gamerTag: string
              prefix: string
            }
            authorizations: Array<{
              type: string
              externalUsername: string
            }>
          }
        }>
      }>
    }
  }
}

interface TournamentEventsResponse {
  tournament: {
    id: string
    name: string
    events: Array<{
      id: string
      name: string
    }>
  }
}

interface Response {
  data: any
  extensions: any
  actionRecords: any
}

async function send_query(
  query: string,
  variables: any,
  api_key: string
): Promise<Response> {
  const post: any = await got.post("https://api.smash.gg/gql/alpha", {
    json: {
      query: query,
      variables: variables,
    },
    headers: {
      Authorization: `Bearer ${api_key}`,
    },
    responseType: "json",
  })

  return post.body as Response
}

export async function fetch_tourney_entrants(
  api_key: string,
  tourney: Tournament,
  progress_callback: Function
): Promise<Tournament> {
  let events = []

  for (let event of tourney.events) {
    events.push(
      await fetch_event_entrants(api_key, event.id, progress_callback)
    )
  }

  return {
    id: tourney.id,
    name: tourney.name,
    events: events,
  }
}

export async function fetch_tourney_events(
  api_key: string,
  tourney_id: string,
  progress_callback: Function
): Promise<Tournament> {
  const query = `
    query tourneyData($slug: String) {
      tournament(slug: $slug){
        id
        name
        events {
          id
          name
        }
      }
    }
    `

  const variables = {
    slug: tourney_id,
  }

  progress_callback(0)

  const response = await send_query(query, variables, api_key)
  const data = response.data as TournamentEventsResponse

  progress_callback(1)

  return parse_tourney_events_response(data)
}

async function fetch_event_entrants(
  api_key: string,
  event_id: string,
  progress_callback: Function
): Promise<Event> {
  const query = `
  query eventEntrants($eventId: ID!, $page: Int!, $perPage: Int!) {
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
          participants {
            gamerTag
            prefix
            user {
              id
              name
              location {
                country
              }
              player {
                gamerTag
                prefix
              }
              authorizations {
                type,
                externalUsername
              }
            }
          }
        }
      }
    }
  }
  `

  const entrants_per_page = 100
  const variables = {
    eventId: event_id,
    page: 1,
    perPage: 100,
  }

  progress_callback(0)

  // Fetch the initial, and potentially only page.
  const response = await send_query(query, variables, api_key)
  const data = response.data as EventEntrantsResponse
  const num_entrants = data.event.entrants.pageInfo.total
  const num_pages = data.event.entrants.pageInfo.totalPages

  let combined_data = data

  // If there are more pages, fetch them too.
  for (let page_num = 2; page_num <= num_pages; ++page_num) {
    progress_callback((page_num - 1) / num_pages)

    const variables = {
      eventId: event_id,
      page: page_num,
      perPage: entrants_per_page,
    }

    const response = await send_query(query, variables, api_key)
    const data = response.data as EventEntrantsResponse

    // Combine the responses.
    for (const entrant of data.event.entrants.nodes) {
      combined_data.event.entrants.nodes.push(entrant)
    }
  }

  progress_callback(1)

  return parse_event_entrants_response(combined_data)
}

function parse_tourney_events_response(
  response: TournamentEventsResponse
): Tournament {
  const events = response.tournament.events.map((e) => {
    let x = e as Event
    x.entrants = []
    return x
  })

  return {
    id: response.tournament.id,
    name: response.tournament.name,
    events: events,
  }
}

function parse_event_entrants_response(response: EventEntrantsResponse): Event {
  const entrants = response.event.entrants.nodes.map((n) => {
    const p = n.participants[0]

    let gamertag = p.gamerTag
    let team = p.prefix
    let twitter = ""
    let country = ""

    if (p.user) {
      if (p?.user?.authorizations) {
        const twitter_auth = p.user.authorizations.find(
          (e) => e.type === "TWITTER" && e.externalUsername !== undefined
        )

        if (twitter_auth) {
          twitter = twitter_auth.externalUsername
        }
      }

      if (p?.user?.location?.country) {
        const country_code =
          countryList.getCode(p?.user?.location?.country) || ""

        if (country_code) {
          country = country_code
        }
      }

      if (p?.user?.player) {
        gamertag = p.user.player.gamerTag
        team = p.user.player.prefix
      }
    }

    return {
      id: p.user?.id || "",
      name: p.user?.name || "",
      gamertag: gamertag,
      team: team || "",
      country: country,
      twitter: twitter || "",
    }
  })

  return {
    id: response.event.id,
    name: response.event.name,
    entrants: entrants,
  }
}
