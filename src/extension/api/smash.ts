import { Event, Tournament } from "../api-interface"
import got from "got"

interface EventResponse {
  event: {
    id: string
    name: string
    entrants: {
      pageInfo: {
        total: number
        totalPages: number
      }
      nodes: Array<{
        id: string
        participants: Array<{
          id: string
          gamerTag: string
          prefix: string
          user: {
            id: string
            name: string
            location: {
              country: string
            }
          }
        }>
      }>
    }
  }
}

interface TournamentResponse {
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

export async function fetch_tourney_data(
  api_key: string,
  tourney_id: string
): Promise<Tournament> {
  const tourney = await fetch_tourney_events(api_key, tourney_id)
  let events = []

  for (let event of tourney.events) {
    events.push(await fetch_event_entrants(api_key, event.id))
  }

  return {
    id: tourney.id,
    name: tourney.name,
    events: events,
  }
}

async function fetch_tourney_events(
  api_key: string,
  tourney_id: string
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

  const response = await send_query(query, variables, api_key)
  return parse_tourney_response(response.data as TournamentResponse)
}

async function fetch_event_entrants(
  api_key: string,
  event_id: string
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
          id
          participants {
            id
            gamerTag
            prefix
            user {
              id,
              name,
              location {
                country
              },
            }
          }
        }
      }
    }
  }
  `

  const variables = {
    eventId: event_id,
    page: 1,
    perPage: 0,
  }

  const response = await send_query(query, variables, api_key)

  return parse_event_response(response.data as EventResponse)
}

function parse_tourney_response(response: TournamentResponse): Tournament {
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

function parse_event_response(response: EventResponse): Event {
  const entrants = response.event.entrants.nodes.map((n) => {
    const p = n.participants[0]

    return {
      id: p.user?.id || "",
      name: p.user?.name || "",
      gamertag: p.gamerTag,
      team: p.prefix || "",
      country: p.user?.location?.country || "",
    }
  })

  return {
    id: response.event.id,
    name: response.event.name,
    entrants: entrants,
  }
}
