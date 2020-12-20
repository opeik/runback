import type { NodeCG } from "nodecg/types/server"
import { set } from "./util/nodecg"
import type { ReplicantServer } from "nodecg/types/server"
import { Settings, Tournament, ApiProvider } from "./runback/_types"
import * as ApiInterface from "./api-interface"
import process from "process"
import path from "path"

export = (nodecg: NodeCG): void => {
  set(nodecg)

  const current_version = require(path.join(
    process.cwd(),
    "../../package.json"
  )).version

  const settings: ReplicantServer<Settings> = nodecg.Replicant("Settings")
  const tournament: ReplicantServer<Tournament> = nodecg.Replicant("Tournament")
  settings.value!.version = current_version

  nodecg.listenFor("fetch_tourney_data", (value: any, ack: any) => {
    const tourney_id = tournament.value!.tourney_id
    const tourney_api = tournament.value!.tourney_api
    const api_key = settings.value!.api_keys[ApiProvider.Smash.text]

    ;(async () => {
      try {
        const tourney_data = await ApiInterface.fetch_tourney_data(
          api_key,
          tourney_api,
          tourney_id
        )

        console.log(JSON.stringify(tourney_data, null, 4))
        ack(null, null)
      } catch (error) {
        ack(error)
      }
    })()
  })
}
