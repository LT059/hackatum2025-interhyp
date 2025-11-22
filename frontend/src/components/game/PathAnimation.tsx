"use client"

import { motion } from "framer-motion"
import { useGame } from "@/context/GameContext"

export default function PathAnimation() {
  const { square_id } = useGame()

  const renderPath = () => {
    const tiles = []
    const viewDistance = 15 // How many tiles ahead to show

    for (let i = 0; i < viewDistance; i++) {
      const actualSquareId = square_id + i
      // Calculate pseudo-3D position
      // We move tiles along Z axis into the screen
      // We create a slight "winding" effect for visual interest
      const zPos = i * 180 // Distance between tiles
      const xOffset = Math.sin(actualSquareId * 0.5) * 200 // Winding path

      const isPlayerSquare = i === 0

      tiles.push(
        <motion.div
          key={actualSquareId}
          initial={{ opacity: 0 }}
          animate={{
            opacity: Math.max(0, 1 - i / viewDistance),
            z: -zPos,
            x: xOffset,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute left-1/2 top-1/2"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center bottom",
          }}
        >
          {/* The Tile Surface */}
          <div
            className={`
              relative -translate-x-1/2 -translate-y-1/2 w-64 h-48 
              border-4 rounded-xl backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,0.5)]
              flex flex-col items-center justify-center
              transition-all duration-500
              ${
                isPlayerSquare
                  ? "bg-blue-600/40 border-blue-400 shadow-[0_0_60px_rgba(59,130,246,0.4)]"
                  : "bg-slate-800/60 border-slate-600"
              }
            `}
            style={{
              transform: "rotateX(90deg)", // Lay flat on "floor"
            }}
          >
            {/* Tile Content */}
            <div className="transform -rotate-x-90 text-center">
              <span className={`block text-4xl font-black ${isPlayerSquare ? "text-white" : "text-slate-400"}`}>
                #{actualSquareId}
              </span>
              <span className="text-xs uppercase tracking-widest opacity-60 text-white mt-2">Capital Tier</span>
            </div>

            {/* Connection Line to next tile */}
            <div className="absolute top-full left-1/2 w-2 h-[200px] bg-white/10 -translate-x-1/2" />
          </div>

          {/* Player Avatar (Only on first tile/current position) */}
          {isPlayerSquare && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[160px]"
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: -160, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative w-20 h-32">
                {/* Body */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg shadow-[0_0_30px_rgba(59,130,246,0.8)]" />
                {/* Head */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-200 rounded-full shadow-[0_0_20px_rgba(191,219,254,0.6)]" />
                {/* Floating effect */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/50 blur-md rounded-full" />
              </div>

              {/* "You are here" indicator */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-blue-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
              >
                YOU
              </motion.div>
            </motion.div>
          )}
        </motion.div>,
      )
    }
    return tiles
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-slate-950">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />

      {/* Horizon Line */}
      <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-slate-900 to-slate-950" />

      {/* 3D Scene Container */}
      <div
        className="relative w-full h-full flex items-center justify-center perspective-container"
        style={{ perspective: "800px" }}
      >
        <motion.div
          className="relative w-full h-full max-w-4xl"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(20deg) translateY(100px)", // View angle
          }}
        >
          {renderPath()}
        </motion.div>
      </div>
    </div>
  )
}
