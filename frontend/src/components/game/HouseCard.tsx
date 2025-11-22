"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { House } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { DollarSign, Maximize, BedDouble, Calendar, ExternalLink } from "lucide-react" // Calendar und ExternalLink hinzugefügt

interface HouseCardProps {
  house: House & { // Erweiterung der House-Struktur für die neuen Felder
    finance_duration?: number; // Dauer in Jahren
    link?: string; // Link zur Immobilie
  }
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
      {/* Header Status - Auskommentiert gelassen */}
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

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-blue-500" />
            <span>{house.buying_price.toLocaleString()} €</span> {/* Währung hinzugefügt */}
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-3 h-3 text-blue-500" />
            <span>{house.squaremeter}m²</span>
          </div>
          <div className="flex items-center gap-1">
            <BedDouble className="w-3 h-3 text-blue-500" />
            <span>{house.rooms} Rooms</span>
          </div>
          {/* NEUES FELD: Finance Duration */}
          {house.finance_duration !== undefined && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-500" />
              <span>{house.finance_duration} Years</span>
            </div>
          )}
        </div>

        {/* house.description wurde entfernt */}
        
        {isHighlighted && (
          <div className="mt-auto w-full py-1 bg-green-500/10 border border-green-500/30 text-center text-green-400 text-xs font-bold uppercase tracking-widest animate-pulse rounded">
            Top Match
          </div>
        )}

        {/* NEUES FELD: Link Button */}
        {house.link && (
          <a 
            href={house.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(
                "w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded transition-colors mt-auto",
                isHighlighted 
                  ? "bg-green-600 hover:bg-green-500 text-white" 
                  : "bg-blue-600 hover:bg-blue-500 text-white"
            )}
            // Wenn isHighlighted true ist, überschreibt der Link den Top Match und wird zum Button
            style={{ marginTop: isHighlighted ? '0.5rem' : 'auto' }} 
          >
            View Listing
            <ExternalLink className="w-3 h-3" />
          </a>
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