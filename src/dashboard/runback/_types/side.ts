export class Side {
  static readonly Unset = new Side(0, "Unset")
  static readonly None = new Side(1, "None")
  static readonly Winners = new Side(2, "Winners")
  static readonly Losers = new Side(3, "Losers")
  static readonly WinnersLosers = new Side(4, "Winners — Losers")
  static readonly LosersWinners = new Side(5, "Losers — Winners")
  static readonly LosersLosers = new Side(6, "Losers — Losers")

  private constructor(public readonly value: number, public readonly text: string) {
  }

  static from_value(value: number): Side {
    return Object.values(this)[value]
  }
}
