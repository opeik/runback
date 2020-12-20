export class Entrant {
  id: string = ""
  name: string = ""
  gamertag: string = ""
  team: string = ""
  country: string = ""
  twitter: string = ""
}

export class Event {
  id: string = ""
  name: string = ""
  entrants: Array<Entrant> = []
}

export class Tournament {
  id: string = ""
  name: string = ""
  events: Array<Event> = []
}
