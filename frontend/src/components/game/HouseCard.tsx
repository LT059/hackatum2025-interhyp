"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { House } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { DollarSign, Maximize, BedDouble, Calendar, ExternalLink } from "lucide-react"

interface HouseCardProps {
    house: House & { // Erweiterung der House-Struktur für die neuen Felder
        finance_duration?: number; // Dauer in Jahren
        link?: string; // Link zur Immobilie
    }
    isHighlighted?: boolean // Bleibt als Prop, wird aber im Styling ignoriert
    isActive: boolean
}

export default function HouseCard({ house, isHighlighted, isActive }: HouseCardProps) {
    return (
        <motion.div
            className={cn(
                "w-[300px] h-[420px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700 overflow-hidden flex flex-col relative",
                // isHighlighted Styling entfernt: Keine neon-green-glow oder border-green-500/50
                isActive ? "opacity-100 scale-100 z-10" : "opacity-60 scale-90 z-0 grayscale",
            )}
            // Anpassung der Hover-Animation: Karte wird breiter und leicht nach links verschoben
            whileHover={isActive ? { scale: 1.05, x: -10, width: 340, height: 440 } : {}}
            transition={{ type: "spring", stiffness: 300, duration: 0.3 }}
        >
            {/* Image Area */}
            <div className="relative h-48 w-full bg-slate-800 border-b border-slate-700">
                <Image src={house.image_url || "/placeholder.svg"} alt={house.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col gap-3">
                
                <motion.h3
                    className={cn(
                        "text-xl font-bold uppercase tracking-wider overflow-hidden whitespace-nowrap",
                        // isHighlighted Text-Farbe entfernt. Nur die blaue Standardfarbe bleibt.
                        "text-blue-400", 
                    )}
                    initial={{ x: 0, opacity: 1 }}
                    whileHover={{ 
                        x: -5,
                        transition: { type: "tween", duration: 0.5, delay: 0.2 } 
                    }}
                >
                    {house.title}
                </motion.h3>

                {/* Property Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-blue-500" />
                        <span>{house.buying_price.toLocaleString()} €</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Maximize className="w-3 h-3 text-blue-500" />
                        <span>{house.squaremeter}m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BedDouble className="w-3 h-3 text-blue-500" />
                        <span>{house.rooms} Rooms</span>
                    </div>
                    
                    {/* Finance Duration */}
                    {house.finance_duration !== undefined && (
                        <div className="flex items-center justify-center gap-1 col-span-2 py-1 px-2 border border-slate-700 bg-slate-800/50 rounded-md mt-1">
                            <Calendar className="w-3 h-3 text-blue-400" />
                            <span className="text-xs font-semibold text-slate-300">
                                Financed for {house.finance_duration} Years
                            </span>
                        </div>
                    )}
                </div>

                {/* Das "Top Match" Banner wurde entfernt. */}
                {/* {isHighlighted && (...) } */}

                {/* Link Button - Styling auf blau vereinheitlicht */}
                {house.link && (
                    <a
                        href={house.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded transition-colors mt-auto",
                            // Styling ist nun immer BLAU, unabhängig von isHighlighted
                            "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
                        )}
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