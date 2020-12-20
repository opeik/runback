export class ApiProvider {
  static readonly Unset = new ApiProvider(0, "Unset")
  static readonly Smash = new ApiProvider(1, "smash.gg")

  private constructor(
    public readonly value: number,
    public readonly text: string
  ) {}

  static from_value(value: number): ApiProvider {
    return Object.values(this)[value]
  }
}

export class Api {
  static validate_tourney_url(tourney_url: string): boolean {
    const api_provider = this.get_api_provider_from_url(tourney_url)

    if (api_provider !== undefined) {
      const tourney_id = this.get_tourney_id_from_url(api_provider, tourney_url)

      if (tourney_id !== undefined) {
        return true
      }
    }

    return false
  }

  static get_api_provider_from_url(
    tourney_url: string
  ): ApiProvider | undefined {
    try {
      const hostname = new URL(tourney_url).hostname

      switch (hostname) {
        case "smash.gg":
          return ApiProvider.Smash
      }
    } catch (e) {}

    return undefined
  }

  static get_tourney_id_from_url(
    api_provider: ApiProvider,
    tourney_url: string
  ): string | undefined {
    try {
      const url_components = new URL(tourney_url).pathname.split("/")

      // smash.gg URL format: https://smash.gg/tournament/${tourney_url}
      switch (api_provider.value) {
        case ApiProvider.Smash.value:
          if (url_components[1] !== "tournament") {
            return undefined
          } else {
            return url_components[2] || undefined
          }
      }
    } catch (error) {}

    return undefined
  }
}
