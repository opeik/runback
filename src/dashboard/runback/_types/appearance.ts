export class Appearance {
  static readonly Light = new Appearance(0, "Light")
  static readonly Dark = new Appearance(1, "Dark")
  static readonly Auto = new Appearance(2, "Automatic")

  private constructor(
    public readonly value: number,
    public readonly text: string
  ) {}

  static from_value(value: number): Appearance {
    return Object.values(this)[value]
  }
}
