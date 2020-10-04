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

  app.on("ready", () => {
    let main: any = null
    let loading = new BrowserWindow({
      show: false,
      frame: false,
      resizable: false,
      width: width,
      height: height,
      title: "Runback",
    })

    loading.once("show", () => {
      main = new BrowserWindow({
        show: false,
        width: width,
        height: height,
        minWidth: 800,
        minHeight: 500,
        title: "Runback",
        webPreferences: {
          nodeIntegration: true,
        },
      })

      main.webContents.once("dom-ready", () => {
        main.show()
        loading.hide()
        loading.close()
      })

      // It Just Works™.
      setTimeout(() => {
        main.loadURL(url)
      }, 7000)

      main.on("page-title-updated", (evt: any) => {
        evt.preventDefault()
      })
    })

    loading.loadURL(loading_url)
    loading.show()
  })

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
      //createWindow()
    }
  })
}
