"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useGame } from "@/context/GameContext"

export default function MonopolyBoard() {
  const { square_id, userName } = useGame()
  // We maintain a local list of visible square indices to handle the "enter/exit" animation smoothly
  // The "current" square is always index 0 in this array visually, but logically it corresponds to square_id
  // actually, to support the "shift" animation, we might want to keep the array stable and shift values

  // Let's just render based on the current square_id relative to a fixed window.
  // But the prompt asks for "discrete movement" using AnimatePresence.

  const VISIBLE_COUNT = 12

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black pointer-events-none">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/50 via-black to-black z-0" />

      {/* Grid Floor */}
      <div
        className="absolute inset-0 opacity-30 z-0"
        style={{
          background: `
            radial-gradient(circle at 50% 100%, transparent 20%, rgba(59, 130, 246, 0.1) 120%),
            conic-gradient(from 270deg at 50% 150%, rgba(59, 130, 246, 0) 0deg, rgba(59, 130, 246, 0.4) 15deg, transparent 30deg, transparent 330deg, rgba(59, 130, 246, 0.4) 345deg, rgba(59, 130, 246, 0) 360deg)
          `,
          backgroundSize: "100% 100%",
        }}
      />

      {/* 3D Path Container */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-end h-full overflow-hidden"
        style={{
          perspective: "800px",
          perspectiveOrigin: "50% 100%",
        }}
      >
        {/* The Track - No rotation, just a container for 3D items */}
        <div
          className="relative w-full max-w-md h-full preserve-3d flex flex-col items-center justify-end pb-20"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {Array.from({ length: VISIBLE_COUNT }).map((_, offset) => {
              const absoluteIndex = square_id + offset
              return <Square key={absoluteIndex} index={absoluteIndex} offset={offset} />
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Square({ index, offset }: { index: number; offset: number }) {
  const { userName } = useGame()
  // offset 0 = closest to camera (standing on it)
  // offset increases into distance

  // We simulate distance by scaling down and moving up Y (since we are looking down a track)
  // But we are using 3D transforms.

  // Z position:
  // 0 is closest.
  // -500 is further.

  const zPos = -offset * 400
  // We move them UP as they go back so they don't just pile at the bottom edge
  const yPos = -offset * 50
  
  return (
    <motion.div
      layout // Use layout animation for smooth position shifts when list changes
      initial={{ opacity: 0, scale: 0.5, z: -5000 }}
      animate={{
        rotateX: 30 + 3*offset,
        opacity: offset < 8 ? 1 - offset / 5 : 0, // Fade out
        scale: offset===1?1.25:1.3,
        //x: 700 - offset*50,
        z: zPos - 100*offset,
        y: offset === 1?yPos- offset * 650:( offset === 0? yPos - offset * 750 : yPos - offset * 700), // Move up slightly as we go back to create a "floor" effect leading to horizon?
        // Wait, with perspectiveOrigin at bottom, "up" (negative Y) moves AWAY from the vanishing point?
        // No, perspectiveOrigin is the point where parallel lines converge.
        // If we want them to converge to a point, we align them to that point.
        // If origin is 50% 100%, they converge to bottom center.
        // So if we just use Z, they slide down.
        // To make a path, we probably don't want them to slide ALL the way down.
        // Let's stick to just Z for now as per strict instructions, but adding a slight Y offset might be needed if it looks broken.
        // The instructions say "only placed by their Z coordinate". I will stick to that first.
      }}
      exit={{
        z: 500, // Move towards camera
        opacity: 0,
        y: 500, // Drop down
        transition: { duration: 0.5 },
      }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 20,
        mass: 1,
      }}
      className="absolute bottom-0 w-[600px] h-[200px] flex items-center justify-center origin-bottom"
      style={{
        width: 600,
        height: offset === 0 ? 350 : 500,
        transformStyle: "preserve-3d",
      }}
    >
      {/* The Tile Content */}
      <div
        className={`
        relative w-full h-full rounded-xl border-2 flex flex-col items-center justify-center backdrop-blur-md transition-colors duration-500 shadow-2xl
        ${
          offset === 0
            ? "bg-blue-900/80 border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.5)] z-50"
            : "bg-slate-900/80 border-slate-700/50"
        }
      `}
      >
        {/* Enhanced tile visuals */}
        <div className="absolute inset-2 border border-white/10 rounded-lg" />

        {/* Center Display */}
        <div
          className={`
          transform transition-all duration-500
          ${offset === 0 ? "scale-125" : "scale-100"}
        `}
        >
          <span
            className={`text-5xl font-black tracking-tighter ${offset === 0 ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" : "text-slate-600"}`}
          >
            {index}
          </span>
        </div>

        {/* Side Glows */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500/50 blur-sm" />
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-500/50 blur-sm" />

        {/* Current Step Indicator */}
        {offset === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-12 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest shadow-lg border border-blue-400"
          >
            {`Servus ${userName || "YOU"}`}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
