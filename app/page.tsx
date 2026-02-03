"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Coffee, Briefcase } from "lucide-react"
import { useTimer } from "@/hooks/useTimer"
import { Button } from "@/components/ui/button"
import { playFinishSound } from "@/lib/sounds"
import {
  requestNotificationPermission,
  showTimerCompleteNotification,
} from "@/lib/notifications"
import { getFocusMessage, getCompleteMessage } from "@/lib/messages"
import { cn } from "@/lib/utils"

const CUSTOMER_UPDATE_INTERVAL = 15000 // 15秒ごとに客数を更新

export default function CafeTimerPage() {
  const {
    mode,
    timeLeft,
    isRunning,
    hasCompleted,
    progress,
    formatTime,
    switchMode,
    toggleTimer,
    resetTimer,
  } = useTimer()

  const [ownerMessage, setOwnerMessage] = useState("")
  const [customerCount, setCustomerCount] = useState(3)
  const [notificationRequested, setNotificationRequested] = useState(false)

  // タブのタイトルを更新
  useEffect(() => {
    document.title = `${formatTime(timeLeft)} | 喫茶店タイマー`
  }, [timeLeft, formatTime])

  // 終了時の処理
  useEffect(() => {
    if (hasCompleted) {
      playFinishSound()
      showTimerCompleteNotification(mode)
      setOwnerMessage(getCompleteMessage())
    }
  }, [hasCompleted, mode])

  // フォーカス時のメッセージ
  useEffect(() => {
    if (!hasCompleted) {
      setOwnerMessage(getFocusMessage())
    }
  }, [mode, hasCompleted])

  // 通知権限のリクエスト
  const handleNotificationRequest = useCallback(async () => {
    if (!notificationRequested) {
      await requestNotificationPermission()
      setNotificationRequested(true)
    }
  }, [notificationRequested])

  useEffect(() => {
    handleNotificationRequest()
  }, [handleNotificationRequest])

  // ランダムな客数の更新
  useEffect(() => {
    const updateCustomerCount = () => {
      setCustomerCount(Math.floor(Math.random() * 12) + 1)
    }
    const interval = setInterval(updateCustomerCount, CUSTOMER_UPDATE_INTERVAL)
    updateCustomerCount() // 初期表示
    return () => clearInterval(interval)
  }, [])

  // 湯気の強さ（進捗が進むほど弱くなる）
  const steamIntensity = Math.max(0, 1 - progress * 1.2)
  const coffeeLevel = Math.max(0, 100 - progress * 100)
  const coffeeSurfaceY = 25 + ((100 - coffeeLevel) / 100) * 70 // カップ内のコーヒー表面のY座標

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950/90 via-stone-900 to-amber-950/95 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 背景の温かみ */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,90,43,0.15)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glassmorphism カード */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl shadow-black/30 p-8">
          {/* 店名 */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif text-amber-100/95 tracking-widest">
              喫茶店タイマー
            </h1>
            <p className="text-amber-200/60 text-sm mt-1">
              現在のお客さんは{customerCount}人です
            </p>
          </div>

          {/* コーヒーカップと湯気 */}
          <div className="flex justify-center mb-6 relative">
            <div className="relative">
              {/* カップ */}
              <svg
                viewBox="0 0 120 140"
                className="w-32 h-40 drop-shadow-lg"
              >
                {/* カップ本体 */}
                <path
                  d="M30 20 L30 100 Q60 115 90 100 L90 20 Z"
                  fill="url(#cupGradient)"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                />
                {/* コーヒーの量（進捗に応じて減少） */}
                <path
                  d={`M35 ${coffeeSurfaceY} L35 95 L85 95 L85 ${coffeeSurfaceY} Z`}
                  fill="url(#coffeeGradient)"
                />
                <defs>
                  <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f5f5dc" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#fff8dc" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#f5f5dc" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6f4e37" />
                    <stop offset="100%" stopColor="#3e2723" />
                  </linearGradient>
                </defs>
              </svg>

              {/* 湯気アニメーション（進捗に応じて透明度変化） */}
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-12 flex justify-center gap-1"
                style={{ opacity: Math.max(0, steamIntensity) }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white/40 rounded-full"
                    animate={{
                      scaleY: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* モード切替 */}
          <div className="flex justify-center gap-2 mb-6">
            <motion.div
              whileTap={{ scale: 0.96 }}
              className="flex bg-white/5 rounded-xl p-1 border border-white/10"
            >
              <button
                onClick={() => switchMode("work")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                  mode === "work"
                    ? "bg-amber-600/80 text-white shadow-lg"
                    : "text-amber-200/70 hover:bg-white/5"
                )}
              >
                <Briefcase className="w-4 h-4" />
                作業
              </button>
              <button
                onClick={() => switchMode("break")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                  mode === "break"
                    ? "bg-amber-600/80 text-white shadow-lg"
                    : "text-amber-200/70 hover:bg-white/5"
                )}
              >
                <Coffee className="w-4 h-4" />
                休憩
              </button>
            </motion.div>
          </div>

          {/* タイマー表示 */}
          <div className="text-center mb-6">
            <motion.p
              key={timeLeft}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-5xl font-mono font-light text-amber-50 tabular-nums tracking-wider"
            >
              {formatTime(timeLeft)}
            </motion.p>
          </div>

          {/* コントロールボタン */}
          <div className="flex justify-center gap-3">
            <motion.div whileTap={{ scale: 0.92 }}>
              <Button
                onClick={toggleTimer}
                size="lg"
                className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl px-8 shadow-lg border-0"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    一時停止
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    開始
                  </>
                )}
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.92 }}>
              <Button
                onClick={resetTimer}
                variant="outline"
                size="lg"
                className="border-amber-400/40 text-amber-100 hover:bg-amber-500/20 rounded-xl"
              >
                <RotateCcw className="w-5 h-5" />
                リセット
              </Button>
            </motion.div>
          </div>

          {/* 店主のひと言 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={ownerMessage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 rounded-xl bg-amber-950/30 border border-amber-700/20"
            >
              <p className="text-amber-100/90 text-sm text-center italic">
                「{ownerMessage}」
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
