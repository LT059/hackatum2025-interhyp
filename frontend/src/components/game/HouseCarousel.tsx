"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useGame } from "@/context/GameContext"
import HouseCard from "./HouseCard"

export default function HouseCarousel() {
  const { houses, finances } = useGame()
  const [activeIndex, setActiveIndex] = useState(0)

  // added 22 Nov - 23.42
  /*
  if (!houses || houses.length === 0) {
  return (
    <div className="w-full h-[600px] flex items-center justify-center text-xl text-white">
      No houses found 🏠❌
    </div>
  )
}
*/
  if (!houses || houses.length === 0) {
  return (
    <div className="w-full h-[600px] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        //className="w-[300px] h-[420px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-blue-500/30 overflow-hidden flex flex-col items-center justify-center relative animate-pulse"
        className="w-[300px] h-[420px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-blue-500/30 overflow-hidden flex flex-col items-center justify-center relative"

      >
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500" />

        {/* Neon Border Glow */}
        <div className="absolute inset-0 border border-blue-500/20 rounded-xl" />

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6">
          <span className="text-4xl">🏠</span>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold uppercase tracking-widest text-blue-400">
          No Houses Found
        </h2>
        <p className="text-xs text-slate-400 mt-2 text-center px-6">
          Try adjusting your filters or advancing your timeline to see available listings!
        </p>

        {/* Fake Button */}
        <div className="mt-6 px-6 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest rounded">
          Awaiting Listings!
        </div>
      </motion.div>
    </div>
  )
}

  // Find the best match based on capital (closest to capital * 5 leverage approx)
  const affordablePrice = finances.capital * 4
  // Simple logic: closest to affordable price is "highlighted"
  const bestMatchId = houses.reduce((prev, curr) => {
    return Math.abs(curr.buying_price - affordablePrice) < Math.abs(prev.buying_price - affordablePrice) ? curr : prev
  }, houses[0])?.id

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % houses.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + houses.length) % houses.length)
  }

  // We show 3 items: active, prev, next for the 3D effect
  // Or simpler for this specific "Carousel" request:
  // Render ALL in a 3D circle, but only show front ones.

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center perspective-container">
      {/* Carousel Container */}
      <div className="relative w-[800px] h-[500px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {houses.map((house, index) => {
            // Calculate offset from active index
            let offset = (index - activeIndex) % houses.length
            if (offset < 0) offset += houses.length
            if (offset > houses.length / 2) offset -= houses.length

            const isActive = offset === 0
            const isVisible = Math.abs(offset) <= 1 // Only show immediate neighbors clearly

            if (!isVisible && !isActive) return null

            return (
              <motion.div
                key={house.id}
                className="absolute"
                initial={false}
                animate={{
                  x: offset * 320, // Spacing
                  z: isActive ? 0 : -200, // Depth
                  scale: isActive ? 1 : 0.8,
                  opacity: isActive ? 1 : 0.5,
                  rotateY: offset * -15, // Rotate slightly towards center
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  zIndex: isActive ? 10 : 5,
                  transformStyle: "preserve-3d",
                }}
              >
                <HouseCard house={house} isHighlighted={house.id === bestMatchId} isActive={isActive} />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-10 top-1/2 -translate-y-1/2 p-3 rounded-full bg-blue-900/50 border border-blue-500 text-blue-200 hover:bg-blue-800 hover:text-white transition-all z-20"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-10 top-1/2 -translate-y-1/2 p-3 rounded-full bg-blue-900/50 border border-blue-500 text-blue-200 hover:bg-blue-800 hover:text-white transition-all z-20"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  )
}
