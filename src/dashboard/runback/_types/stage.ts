export class Stage {
  static readonly Unset = new Stage(0, "Unset")
  static readonly Pools = new Stage(1, "Pools")
  static readonly Top128 = new Stage(2, "Top 128")
  static readonly Top96 = new Stage(3, "Top 96")
  static readonly Top64 = new Stage(4, "Top 64")
  static readonly Top48 = new Stage(5, "Top 48")
  static readonly Top32 = new Stage(6, "Top 32")
  static readonly Top16 = new Stage(7, "Top 16")
  static readonly Top8 = new Stage(8, "Top 8")
  static readonly Top4 = new Stage(9, "Top 4")
  static readonly QuarterFinal = new Stage(10, "Quarter Final")
  static readonly SemiFinal = new Stage(11, "Semi Final")
  static readonly Final = new Stage(12, "Final")
  static readonly GrandFinal = new Stage(13, "Grand Final")

  private constructor(public readonly value: number, public readonly text: string) {
  }

  static from_value(value: number): Stage {
    return Object.values(this)[value]
  }

  static from_text(text: string): Stage {
    text = text.trim()
    return Object.values(this).find(e => e.text === text)
  }
}
