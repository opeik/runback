import type { NodeCG } from "nodecg/types/server"
import { set } from "./util/nodecg"
import Uuid from "pure-uuid"
import type { ReplicantServer } from "nodecg/types/server"
import * as ApiInterface from "./api-interface"
import process from "process"
import path from "path"
import { fetch_tourney_entrants } from "./api/smash"
import {
  SettingsReplicant,
  TournamentReplicant,
  PlayersReplicant,
  Tournament,
  Player,
  ApiProvider,
  ApiReplicant,
} from "./runback/_types"
import * as Transliterate from "./transliterate"
import XRegExp from "xregexp"

const non_latin_regex = XRegExp("[^\\p{Latin}\\p{Common}\\p{Inherited}]")
let players: ReplicantServer<PlayersReplicant>
let settings: ReplicantServer<SettingsReplicant>
let tournament: ReplicantServer<TournamentReplicant>
let api: ReplicantServer<ApiReplicant>

interface FetchTourneyEventsArgs {
  tourney_api: ApiProvider
  tourney_id: string
}

interface TransliterateArgs {
  s: string
}

export = (nodecg: NodeCG): void => {
  set(nodecg)

  const current_version = require(path.join(
    process.cwd(),
    "bundles/runback/package.json"
  )).version

  players = nodecg.Replicant("Players", {
    defaultValue: {},
  })

  settings = nodecg.Replicant("Settings", {
    defaultValue: new SettingsReplicant(),
  })

  tournament = nodecg.Replicant("Tournament", {
    defaultValue: new TournamentReplicant(),
  })

  api = nodecg.Replicant("Api", {
    defaultValue: new ApiReplicant(),
  })

  settings.value!.version = current_version

  nodecg.listenFor(
    "fetch_tourney_events",
    (value: FetchTourneyEventsArgs, ack: any) => {
      nodecg_fetch_tourney_events(value, ack, nodecg)
    }
  )

  nodecg.listenFor(
    "fetch_tourney_entrants",
    (value: FetchTourneyEventsArgs, ack: any) => {
      nodecg_fetch_tourney_entrants(value, ack, nodecg)
    }
  )

  nodecg.listenFor("transliterate", (value: string, ack: any) => {
    ;(async () => {
      ack(null, await Transliterate.transliterate(value))
    })()
  })
}

function nodecg_fetch_tourney_events(
  value: FetchTourneyEventsArgs,
  ack: any,
  nodecg: NodeCG
): void {
  const tourney_id = value.tourney_id
  const tourney_api = value.tourney_api
  const api_key = settings.value!.api_keys[ApiProvider.Smash.text]
  api.value!.fetching.events = true
  ;(async () => {
    try {
      const tourney = await ApiInterface.fetch_tourney_events(
        api_key,
        tourney_api,
        tourney_id,
        events_progress_callback
      )

      api.value!.fetching.events = false
      tournament.value!.tourney = tourney
      ack(null, tourney.events.length)
    } catch (error) {
      api.value!.fetching.events = false
      console.error(error?.response?.body || error)
      ack(error?.response?.body || error)
    }
  })()
}

function nodecg_fetch_tourney_entrants(
  value: any,
  ack: any,
  nodecg: NodeCG
): void {
  const tourney_id = tournament.value!.tourney_id
  const tourney_api = tournament.value!.tourney_api
  const api_key = settings.value!.api_keys[ApiProvider.Smash.text]
  api.value!.fetching.entrants = true
  ;(async () => {
    try {
      let tourney = await ApiInterface.fetch_tourney_entrants(
        api_key,
        tourney_api,
        tournament.value!.tourney,
        entrants_progress_callback
      )

      const unique_players = get_all_unique_tourney_players(
        tourney,
        tourney_api
      )

      for (const player of unique_players) {
        await create_player(player, tourney_api, nodecg)
      }

      api.value!.fetching.entrants = false
      ack(null, unique_players.length)
    } catch (error) {
      api.value!.fetching.entrants = false
      console.error(error?.response?.body || error)
      ack(error?.response?.body || error)
    }
  })()
}

function get_all_unique_tourney_players(
  tourney: Tournament,
  api_provider: ApiProvider
): Array<Player> {
  let players: Array<Player> = []

  for (const event of Object.values(tourney.events)) {
    for (const entrant of event.entrants) {
      let player = new Player()
      player.name = entrant.name
      player.team = entrant.team
      player.gamertag = entrant.gamertag
      player.country = entrant.country
      player.twitter = entrant.twitter
      player.api_ids[api_provider.text] = entrant.id

      players.push(player)
    }
  }

  // Ahaha, this is awful.
  const unique_players = players.filter(
    (v, i, a) =>
      a.findIndex((t) => JSON.stringify(t) === JSON.stringify(v)) === i
  )

  return unique_players
}

async function create_player(
  player: Player,
  api_provider: ApiProvider,
  nodecg: NodeCG
): Promise<void> {
  const player_list = Object.values(players.value)

  if (player.country.length === 0) {
    player.country = settings.value!.default_country
  }

  let existing_player = player_list.find(
    (e: Player) =>
      e.api_ids[api_provider.text] === player.api_ids[api_provider.text]
  )

  if (existing_player !== undefined) {
    player.id = existing_player.id
  } else {
    while (player.id in players.value! || player.id.length === 0) {
      player.id = new Uuid(4).toString()
    }
  }

  if (non_latin_regex.test(player.gamertag)) {
    if (
      existing_player === undefined ||
      (existing_player !== undefined &&
        (player.gamertag !== existing_player.gamertag ||
          existing_player.gamertag_latin_generated.length === 0))
    ) {
      const gamertag_latin = await Transliterate.transliterate(player.gamertag)

      player.gamertag_latin_generated = gamertag_latin
    }
  } else {
    player.gamertag_latin_generated = ""
  }

  players.value![player.id] = player
}

function entrants_progress_callback(progress: number) {
  api.value!.progress.entrants = progress
}

function events_progress_callback(progress: number) {
  api.value!.progress.events = progress
}
