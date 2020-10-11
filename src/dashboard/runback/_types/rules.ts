import {Stage, Side} from "./"

export class Rules {
  readonly winners_abbreviation: string = "W"
  readonly losers_abbreviation: string = "L"

  readonly stage_list = Object.values(Stage)
  readonly side_list = Object.values(Side).filter(
    e => e.value === Side.None.value || e.value < Side.WinnersLosers.value)
  readonly grand_final_side_list = Object.values(Side).filter(
    e => e.value === Side.None.value || e.value >= Side.WinnersLosers.value)

  readonly winner_table = [
    [true, false],
    [false, true],
    [false, false]
  ]

  is_winner(player_num: number, side: Side): boolean {
    if (!(side.value >= Side.WinnersLosers.value && side.value <= Side.LosersLosers.value)) {
      return false
    }

    return this.winner_table[side.value - Side.WinnersLosers.value][player_num]
  }

  side_abbreviation(side: Side): string {
    if (side.value === Side.Winners.value) {
      return this.winners_abbreviation
    } else if (side.value === Side.Losers.value) {
      return this.losers_abbreviation
    }

    return ""
  }
}
