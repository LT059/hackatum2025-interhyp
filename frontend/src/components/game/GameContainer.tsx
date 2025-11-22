"use client"

import { useGame } from "@/context/GameContext"
import HouseCarousel from "./HouseCarousel"
import InitForm from "../ui/InitForm"
import FilterSidebar from "../ui/FilterSidebar"
import ChanceButtons from "../ui/ChanceButtons"
import HUD from "../HUD"
import { motion } from "framer-motion"
import MonopolyBoard from "./MonopolyBoard"
import OnboardingGuide from "../ui/OnboardingGuide" // Import OnboardingGuide
import { useState } from "react"


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

        {/* Main Action Button (Advance Age) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={changeAge}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-black text-white uppercase tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-white/20 z-50 hover:shadow-[0_0_40px_rgba(79,70,229,0.8)] transition-all pointer-events-auto"
        >
          Advance Timeline
        </motion.button>
      </div>
      <FilterSidebar />
      <ChanceButtons />
      <OnboardingGuide /> {/* Add OnboardingGuide */}
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
      right: 0,
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