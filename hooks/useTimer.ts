"use client"

import { useState, useEffect, useCallback } from "react"

export type TimerMode = "work" | "break"

const WORK_DURATION = 25 * 60 // 25分（秒）
const BREAK_DURATION = 5 * 60 // 5分（秒）

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>("work")
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  const totalTime = mode === "work" ? WORK_DURATION : BREAK_DURATION
  const progress = 1 - timeLeft / totalTime

  const switchMode = useCallback((targetMode?: TimerMode) => {
    const newMode: TimerMode = targetMode ?? (mode === "work" ? "break" : "work")
    setMode(newMode)
    setTimeLeft(newMode === "work" ? WORK_DURATION : BREAK_DURATION)
    setHasCompleted(false)
  }, [mode])

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev)
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(mode === "work" ? WORK_DURATION : BREAK_DURATION)
    setHasCompleted(false)
  }, [mode])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          setHasCompleted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  return {
    mode,
    timeLeft,
    isRunning,
    hasCompleted,
    progress,
    formatTime,
    switchMode,
    toggleTimer,
    resetTimer,
  }
}
