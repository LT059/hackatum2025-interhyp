"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { House } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { DollarSign, Maximize, BedDouble } from "lucide-react"

interface HouseCardProps {
  house: House
  isHighlighted?: boolean
  isActive: boolean
}

export default function HouseCard({ house, isHighlighted, isActive }: HouseCardProps) {
  return (
    <motion.div
      className={cn(
        "w-[300px] h-[420px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700 overflow-hidden flex flex-col relative",
        isHighlighted && "neon-green-glow border-green-500/50",
        isActive ? "opacity-100 scale-100 z-10" : "opacity-60 scale-90 z-0 grayscale",
      )}
      whileHover={isActive ? { scale: 1.05, y: -10 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header Status */}
      {/* <div className="absolute top-2 right-2 z-20 bg-black/60 px-2 py-1 rounded text-xs text-blue-400 font-mono border border-blue-500/30">
        ID: {house.id}
      </div> */}

      {/* Image Area */}
      <div className="relative h-48 w-full bg-slate-800 border-b border-slate-700">
        <Image src={house.image_url || "/placeholder.svg"} alt={house.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3
          className={cn(
            "text-xl font-bold uppercase tracking-wider truncate",
            isHighlighted ? "text-green-400" : "text-blue-400",
          )}
        >
          {house.title}
        </h3>

        <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-blue-500" />
            <span>{house.buying_price.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-3 h-3 text-blue-500" />
            <span>{house.squaremeter}m²</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <BedDouble className="w-3 h-3 text-blue-500" />
            <span>{house.rooms} Rooms</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{house.description}</p>

        {isHighlighted && (
          <div className="mt-auto w-full py-1 bg-green-500/10 border border-green-500/30 text-center text-green-400 text-xs font-bold uppercase tracking-widest animate-pulse rounded">
            Top Match
          </div>
        )}
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500" />
    </motion.div>
  )
}
