const FOCUS_MESSAGES = [
  "今は静かな時間です。ごゆっくりどうぞ。",
  "集中の秋、いいですね。",
  "珈琲の香りと共に、ゆっくりと。",
  "今日も一日、お疲れ様です。",
  "心を落ち着けて、ひと呼吸。",
  "当店自慢のブレンド、いかがですか。",
  "静寂の中に、特別な時間を。",
]

const COMPLETE_MESSAGES = [
  "お疲れ様です。淹れたてのコーヒーでもいかがですか？",
  "よく頑張りましたね。一息ついてください。",
  "素敵なひとときでした。リフレッシュどうぞ。",
  "次の一杯はいかがなさいますか？",
  "休憩も大事なお仕事のうち。ごゆっくり。",
]

export function getFocusMessage(): string {
  return FOCUS_MESSAGES[Math.floor(Math.random() * FOCUS_MESSAGES.length)]
}

export function getCompleteMessage(): string {
  return COMPLETE_MESSAGES[Math.floor(Math.random() * COMPLETE_MESSAGES.length)]
}
