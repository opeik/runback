import { Bracket, Player, Players, Scoreboard, Rules } from "./"

export class ScoreboardView {
  num_players: number = 0
  bracket = new Bracket()
  players = {} as Players
  scoreboard = new Scoreboard()
  readonly rules = new Rules()

  constructor(
    num_players: number,
    bracket: Bracket,
    players: Players,
    scoreboard: Scoreboard
  ) {
    this.num_players = num_players
    this.bracket = bracket
    this.players = players
    this.scoreboard = scoreboard
  }

  get bracket_stage(): number {
    return this.bracket.bracket_stage
  }

  get progress(): string {
    let progress: string = ""

    if (this.custom_progress_enabled) {
      progress = this.custom_progress
    } else if (
      this.rules.is_grand_final(this.bracket_stage) ||
      this.bracket_side === this.rules.none_side_num
    ) {
      progress = this.rules.stage_list[this.bracket_stage - 1].text
    } else {
      progress =
        this.rules.side_list[this.bracket_side - 1].text +
        " " +
        this.rules.stage_list[this.bracket_stage - 1].text
    }

    return progress
  }

  get custom_progress_enabled(): boolean {
    return this.bracket.custom_progress_enabled
  }

  get custom_progress(): string {
    return this.bracket.custom_progress
  }

  get is_grand_final(): boolean {
    return this.rules.is_grand_final(this.bracket_stage)
  }

  get grand_final_side(): number {
    return this.bracket.grand_final_side
  }

  get bracket_side(): number {
    return this.bracket.bracket_side
  }

  player_from_num(player_num: number): Player {
    return this.players[this.player_id_from_num(player_num)]
  }

  player_id_from_num(player_num: number): string {
    return this.scoreboard.scores[player_num].player_id
  }

  player_score_from_num(player_num: number): number {
    return this.scoreboard.scores[player_num].score
  }

  player_is_winners_from_num(player_num: number): boolean {
    return this.rules.is_winners(this.grand_final_side, player_num)
  }
}
