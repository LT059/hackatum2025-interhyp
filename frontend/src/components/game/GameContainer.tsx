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

export default function GameContainer() {
  const { isInitialized, changeAge } = useGame()

  if (!isInitialized) {
    return <InitForm />
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-blue-500/30">
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
