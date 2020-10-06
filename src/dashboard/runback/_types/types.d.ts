import {
  Bracket as BracketI,
  Commentator as CommentatorI,
  Commentators as CommentatorsI,
  Player as PlayerI,
  Players as PlayersI,
  PlayerOverride as PlayerOverrideI,
  PlayerScore as PlayerScoreI,
  Scoreboard as ScoreboardI,
  Settings as SettingsI,
} from "Runback/../../schemas"

export class Bracket implements BracketI
export class Commentator implements CommentatorI
export class Commentators implements CommentatorsI
export class Player implements PlayerI
export type Players = Record<string, Player>
export class PlayerOverride implements PlayerOverrideI
export class PlayerScore implements PlayerScoreI
export class Scoreboard implements ScoreboardI
export class Settings implements SettingsI
