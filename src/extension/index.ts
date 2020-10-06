import type { NodeCG } from "nodecg/types/server"
import { set } from "./util/nodecg"

export = (nodecg: NodeCG): void => {
  set(nodecg)

  const { app, BrowserWindow, session } = require("electron")
  const shell = require("electron").shell

  const url =
    "http://localhost:9090/bundles/runback/dashboard/runback.html?standalone=true"
  const loading_url = "file://" + __dirname + "/../dashboard/loading.html"
  const main_load_delay = 10 * 1000
  const background_color = "#0f0f0f"

  function create_main_window() {
    let window = new BrowserWindow({
      show: false,
      width: 1280,
      height: 800,
      minWidth: 800,
      minHeight: 500,
      title: "Runback",
      backgroundColor: background_color,
      webPreferences: {
        nodeIntegration: true,
      },
    })

    window.on("page-title-updated", (evt: any) => {
      evt.preventDefault()
    })

    window.webContents.on("will-navigate", (event: any, url: string) => {
      event.preventDefault()

      // Stops a window being created when hot-reloading.
      if (!url.startsWith("http://localhost")) {
        shell.openExternal(url)
      }
    })

    return window
  }

  function create_loading_window() {
    let window = new BrowserWindow({
      show: false,
      frame: false,
      resizable: false,
      width: 300,
      height: 300,
      title: "Runback",
      backgroundColor: background_color,
    })

    window.on("page-title-updated", (evt: any) => {
      evt.preventDefault()
    })

    return window
  }

  app.on("ready", () => {
    if (process.env.NODE_ENV !== "production") {
      require("vue-devtools").install()
    }

    let main: any = null
    let dummy: any = null
    let loading = create_loading_window()

    loading.webContents.on("dom-ready", () => {
      console.log("Load ready")
      loading.show()
      main = create_main_window()
      dummy = create_main_window()

      // It Just Works™. This is an **awful** hack. For some reason there's a
      // period after NodeCG starts where pages won't load. Delaying the load,
      // then reloading the page appears to deal with this.
      dummy.once("ready-to-show", () => {
        console.log("Dummy ready")
        dummy.close()
        main.loadURL(url)
      })

      setTimeout(() => {
        dummy.loadURL(url)
      }, main_load_delay)

      main.once("ready-to-show", () => {
        console.log("Main ready")
        main.show()

        if (!loading.isDestroyed()) {
          loading.close()
        }
      })
    })

    loading.loadURL(loading_url)

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
