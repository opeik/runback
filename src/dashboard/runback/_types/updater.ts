import { SemVer } from "semver"

export class Updater {
  static async check_up_to_date(
    current_version: string
  ): Promise<{
    found_new_version: boolean
    version?: string
  }> {
    const tag_list_endpoint: string =
      "https://api.github.com/repos/opeik/runback/tags"

    let response = await fetch(tag_list_endpoint)
    let json = await response.json()
    let found_new_version = false
    let version = ""

    json.forEach((e: any) => {
      let tag_name = e.name
      let current_version_parsed = new SemVer(current_version)
      let new_version = new SemVer(tag_name)

      if (new_version > current_version_parsed) {
        found_new_version = true
        version = new_version.toString()
      }
    })

    await new Promise((r) => setTimeout(r, 500))

    return {
      found_new_version: found_new_version,
      version: version,
    }
  }
}
