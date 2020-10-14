import type { NodeCG } from "nodecg/types/server"
import { set } from "./util/nodecg"

export = (nodecg: NodeCG): void => {
  set(nodecg)
}

const { app, BrowserWindow, shell } = require("electron")
const path = require("path")

const main_url =
  "http://localhost:9090/bundles/runback/dashboard/runback.html?standalone=true/#/"
const loading_url = path.join(
  "file://",
  __dirname,
  "/../dashboard/loading.html"
)
const main_load_delay = 10 * 1000
const background_color = "#0f0f0f"

function create_main_window(): typeof BrowserWindow {
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

  window.setMenuBarVisibility(false)

  window.on("page-title-updated", (evt: Event) => {
    evt.preventDefault()
  })

  window.webContents.on("will-navigate", (event: Event, link: string) => {
    event.preventDefault()
  })

  return window
}

function create_loading_window(): typeof BrowserWindow {
  let window = new BrowserWindow({
    show: false,
    frame: false,
    resizable: false,
    width: 300,
    height: 300,
    title: "Runback",
    backgroundColor: background_color,
  })

  window.on("page-title-updated", (event: Event) => {
    event.preventDefault()
  })

  return window
}

app.on("ready", () => {
  if (!app.isPackaged) {
    require("vue-devtools").install()
  }

  let main: typeof BrowserWindow
  let dummy: typeof BrowserWindow
  let loading = create_loading_window()

  loading.webContents.on("dom-ready", () => {
    console.log("[runback] Loading window ready")
    loading.show()
    main = create_main_window()
    dummy = create_main_window()

    // It Just Works™. This is an **awful** hack. For some reason there's a
    // period after NodeCG starts where pages won't load. Delaying the load,
    // then reloading the page appears to deal with this.
    dummy.once("ready-to-show", () => {
      console.log("[runback] Dummy window ready")
      dummy.close()
      main.loadURL(main_url)
    })

    setTimeout(() => {
      dummy.loadURL(main_url)
    }, main_load_delay)

    main.once("ready-to-show", () => {
      console.log("[runback] Main window ready")
      main.show()

      if (!loading.isDestroyed()) {
        loading.close()
      }
    })
  })

  loading.loadURL(loading_url)

  // Kill the process if all the windows are closed.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit()
    }
  })

  // Stay open on macOS.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      main = create_main_window()

      main.once("ready-to-show", () => {
        main.show()
      })

      main.loadURL(main_url)
    }
  })
})
