export function playFinishSound() {
  try {
    const audio = new Audio("/sounds/finish.mp3")
    audio.volume = 0.7
    audio.play().catch(() => {
      // ファイルが存在しない場合、Web Audio APIでシンプルなベルの音を生成
      playFallbackBell()
    })
  } catch {
    playFallbackBell()
  }
}

function playFallbackBell() {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 880
    oscillator.type = "sine"
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch {
    // 音声再生が完全に失敗した場合
  }
}
