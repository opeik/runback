import * as Transliteration from "transliteration"
// @ts-ignore
import Kuroshiro from "kuroshiro"
// @ts-ignore
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji"

const kuroshiro = new Kuroshiro()
;(async () => {
  await kuroshiro.init(new KuromojiAnalyzer())
})()

export async function transliterate(s: string): Promise<string> {
  const has_japanese_chars =
    Kuroshiro.Util.hasHiragana(s) || Kuroshiro.Util.hasKatakana(s)

  let latin = ""

  if (has_japanese_chars) {
    latin = await kuroshiro.convert(s, {
      to: "romaji",
      mode: "normal",
      romajiSystem: "hepburn",
    })
  } else {
    latin = Transliteration.transliterate(s, { trim: true })
  }

  return latin
}
