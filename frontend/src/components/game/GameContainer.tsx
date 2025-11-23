"use client"

import { useGame } from "@/context/GameContext"
import HouseCarousel from "./HouseCarousel"
import InitForm from "../ui/InitForm"
import FilterSidebar from "../ui/FilterSidebar"
import ChanceButtons from "../ui/ChanceButtons"
import HUD from "../HUD"
import { motion } from "framer-motion"
import MonopolyBoard from "./MonopolyBoard"
import OnboardingGuide from "../ui/OnboardingGuide"
import { useState } from "react"
import { ChevronRight } from "lucide-react" // Icons für die Buttons hinzugefügt

export default function GameContainer() {
    const { isInitialized, changeAge } = useGame()

    if (!isInitialized) {
        return <InitForm />
    }

    return (
        <main className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-blue-500/30">
            <GameDebugger />
            <MonopolyBoard />
            <HUD />
            {/* Main Game Stage */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
                {/* Pointer events allow interaction with children but not this container */}
                <div className="mt-20 pointer-events-auto">
                    <HouseCarousel />
                </div>

                {/* Main Action Buttons Container */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 z-50 pointer-events-auto">
                    
                    {/* 1. Advance Timeline (Hauptaktion) */}
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => changeAge(1)}
                        className="flex items-center gap-2 px-12 py-3 bg-gradient-to-r from-blue-500 to-indigo-700 rounded-full font-black text-white uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(79,70,229,0.7)] border border-white/30 hover:shadow-[0_0_40px_rgba(79,70,229,1)] transition-all"
                    >
                        Advance Timeline
                        <ChevronRight size={16} />
                    </motion.button>

                    {/* 2. Fast Forward (Sekundär-/Debug-Aktion: Zurückspulen) */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => changeAge(-1)}
                        // Konturiertes, subtileres Design
                        className="flex items-center gap-2 px-8 py-2 bg-transparent border border-blue-600 rounded-full font-bold text-blue-300 uppercase tracking-wide text-[10px] shadow-[0_0_10px_rgba(37,99,235,0.3)] hover:bg-blue-900/20 hover:text-white transition-all"
                    >
                        Fast Forward
                        <ChevronRight size={14} />
                    </motion.button>
                </div>
            </div>
            <FilterSidebar />
            <ChanceButtons />
            <OnboardingGuide />
        </main>
    )
}


function GameDebugger() {
    const game = useGame()
    const [isVisible, setIsVisible] = useState(true)

    return (
        <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "300px",
            maxHeight: isVisible ? "200px" : "30px",
            background: "#111",
            color: "#0f0",
            padding: "8px",
            fontSize: "12px",
            zIndex: 9999,
            overflowY: "auto",
            border: "1px solid #0f0",
            transition: "max-height 0.3s ease",
        }}>
            <button
                onClick={() => setIsVisible(!isVisible)}
                style={{
                    display: "block",
                    marginBottom: "4px",
                    background: "#000",
                    color: "#0f0",
                    border: "1px solid #0f0",
                    cursor: "pointer",
                    width: "100%",
                }}
            >
                {isVisible ? "Hide" : "Show"} Debug
            </button>
            {isVisible && <pre>{JSON.stringify(game, null, 2)}</pre>}
        </div>
    )
}