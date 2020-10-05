import type { NodeCG } from "nodecg/types/server"
import { set } from "./util/nodecg"

export = (nodecg: NodeCG): void => {
  set(nodecg)

  const { app, BrowserWindow } = require("electron")
  const width = 1280
  const height = 900
  const url =
    "http://localhost:9090/bundles/runback/dashboard/runback.html?standalone=true#/"
  const loading_url = "file://" + __dirname + "/../dashboard/loading.html"
  const main_load_delay = 5 * 1000
  const main_refresh_timeout = 3 * 1000

  function create_main_window() {
    return new BrowserWindow({
      show: false,
      width: width,
      height: height,
      minWidth: 800,
      minHeight: 500,
      title: "Runback",
      backgroundColor: "#0f0f0f",
      webPreferences: {
        nodeIntegration: true,
      },
    })
  }

  function create_loading_window() {
    return new BrowserWindow({
      show: false,
      frame: true,
      resizable: false,
      width: width,
      height: height,
      title: "Runback",
      backgroundColor: "#0f0f0f",
    })
  }

  app.on("ready", () => {
    let main: any = null
    let dummy: any = null
    let loading = create_loading_window()

    loading.once("show", () => {
      main = create_main_window()
      dummy = create_main_window()

      // It Just Works™. This is an **awful** hack. For some reason there's a
      // period after NodeCG starts where pages won't load. Delaying the load,
      // then reloading the page appears to deal with this.
      dummy.once("ready-to-show", () => {
        dummy.close()
        main.loadURL(url)
      })

      setTimeout(() => {
        dummy.loadURL(url)
      }, main_load_delay)

      main.once("ready-to-show", () => {
        let position = loading.getPosition()
        main.setPosition(position[0], position[1])
        main.show()
        loading.hide()
        loading.close()
      })

      main.on("page-title-updated", (evt: any) => {
        evt.preventDefault()
      })

      loading.on("page-title-updated", (evt: any) => {
        evt.preventDefault()
      })
    })

    loading.loadURL(loading_url)
    loading.show()

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit()
      }
    })

    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        main = create_main_window()

        main.once("ready-to-show", () => {
          main.show()
        })

        main.loadURL(url)
      }
    })
  })
}
