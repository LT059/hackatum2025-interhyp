"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useRef } from "react"
import type { House } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
// Clock für die Finanzierungsdauer hinzugefügt, Calendar für das Baujahr beibehalten
import { DollarSign, Maximize, BedDouble, Calendar, ExternalLink, Clock } from "lucide-react" 

interface HouseCardProps {
    house: House & { 
        finance_duration?: number; // Dauer in Jahren
        link?: string; // Link zur Immobilie
        constructionYear?: number; // NEUES FELD: Baujahr
    }
    isHighlighted?: boolean
    isActive: boolean
}

export default function HouseCard({ house, isActive }: HouseCardProps) {
    const [isHovering, setIsHovering] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)

    const getAnimationDistance = () => {
        if (!containerRef.current || !titleRef.current) return 0
        
        const containerWidth = containerRef.current.clientWidth
        const titleWidth = titleRef.current.scrollWidth
        
        return titleWidth > containerWidth ? -(titleWidth - containerWidth) - 10 : 0
    }

    const getAnimationDuration = () => {
        if (!titleRef.current) return 3
        const titleLength = titleRef.current.scrollWidth
        return Math.max(3, titleLength / 50) 
    }

    const titleVariants = {
        initial: { x: 0 },
        animate: {
            x: getAnimationDistance(),
            transition: {
                repeat: Infinity,
                repeatType: "reverse" as const,
                duration: getAnimationDuration(),
                ease: "linear",
            },
        },
    }

    return (
        <motion.div
            className={cn(
                "w-[300px] h-[420px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700 overflow-hidden flex flex-col relative",
                isActive ? "opacity-100 scale-100 z-10" : "opacity-60 scale-90 z-0 grayscale",
            )}
            onHoverStart={() => isActive && setIsHovering(true)}
            onHoverEnd={() => isActive && setIsHovering(false)}
            whileHover={isActive ? { scale: 1.05, y: -10 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {/* Image Area */}
            <div className="relative h-48 w-full bg-slate-800 border-b border-slate-700">
                <Image src={house.image_url || "/placeholder.svg"} alt={house.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col gap-3">
                
                {/* Titel mit Marquee-Animation */}
                <div 
                    ref={containerRef} 
                    className="overflow-hidden whitespace-nowrap"
                >
                    <motion.h3
                        ref={titleRef}
                        className={cn(
                            "text-xl font-bold uppercase tracking-wider text-blue-400",
                            "whitespace-nowrap inline-block",
                        )}
                        animate={isHovering ? "animate" : "initial"}
                        variants={titleVariants}
                    >
                        {house.title}
                    </motion.h3>
                </div>

                {/* Property Details Grid (Angepasst) */}
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-blue-500" />
                        <span>{house.buying_price.toLocaleString()} €</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Maximize className="w-3 h-3 text-blue-500" />
                        <span>{house.squaremeter}m²</span>
                    </div>
                    
                    {/* Baujahr (NEU) */}
                    {house.constructionYear !== undefined && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-500" />
                            <span>Built {house.constructionYear}</span>
                        </div>
                    )}
                    
                    {/* Rooms */}
                    <div className="flex items-center gap-1">
                        <BedDouble className="w-3 h-3 text-blue-500" />
                        <span>{house.rooms} Rooms</span>
                    </div>
                    
                    {/* Finance Duration (Angepasst) */}
                    {house.finance_duration !== undefined && (
                        <div className="flex items-center justify-center gap-1 col-span-2 py-1 px-2 border border-slate-700 bg-slate-800/50 rounded-md mt-1">
                            {/* Icon zu Clock geändert */}
                            <Clock className="w-3 h-3 text-blue-400" /> 
                            <span className="text-xs font-semibold text-slate-300">
                                Mortgage Duration {house.finance_duration} Years
                            </span>
                        </div>
                    )}
                </div>

                {/* Link Button */}
                {house.link && (
                    <a
                        href={house.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded transition-colors mt-auto",
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