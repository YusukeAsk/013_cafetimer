export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false
  if (Notification.permission === "granted") return true
  if (Notification.permission === "denied") return false

  const permission = await Notification.requestPermission()
  return permission === "granted"
}

export function showTimerCompleteNotification(mode: "work" | "break") {
  if (!("Notification" in window) || Notification.permission !== "granted") return

  const message =
    mode === "work"
      ? "お疲れ様です！休憩の時間です。淹れたてのコーヒーでもいかがですか？"
      : "休憩タイム終了！次のセッションを始めましょう。"

  new Notification("ポモドーロタイマー", {
    body: message,
    icon: "/favicon.ico",
  })
}
