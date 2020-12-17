import type { NodeCG } from "nodecg/types/server"
import { set } from "./util/nodecg"
import * as ApiRequest from "./api_request"

export = (nodecg: NodeCG): void => {
  set(nodecg)

  nodecg.listenFor("fetch_tourney_data", (value: any, ack: any) => {
    ;(async () => {
      await ApiRequest.fetch_tourney_data("")
    })()

    ack(null, null)
  })
}
