"use client"

import type React from "react"

import { useGame } from "@/context/GameContext"
import { Wallet, Clock, TrendingUp, PiggyBank, RefreshCw, User, Building2 } from "lucide-react"

export default function HUD() {
  const { age, finances, userName, restartGame } = useGame()

  // Berechnung der monatlichen Ersparnisse
  const monthlySavings = finances.income * (finances.savings_rate / 100)

  return (
    <div className="absolute top-0 left-0 right-0 p-8 z-40 flex justify-between items-start pointer-events-none select-none">
      
      {/* ------------------------------------- */}
      {/* Left Group: Age, Capital & Username */}
      {/* ------------------------------------- */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        
        {/* Haupt-Anzeigen: Age & Capital */}
        <div className="flex gap-4">
          <HUDItem 
            icon={<Clock className="w-5 h-5 text-blue-300" />} 
            label="Current Age" 
            value={age.toString()} 
            color="blue" 
          />
          <HUDItem
            icon={<Wallet className="w-5 h-5 text-purple-300" />}
            label="Total Capital"
            // Rundet das Kapital, da es der wichtigste Wert ist
            value={`€${finances.capital.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            color="purple"
          />
        </div>
        
        {/* Username Banner */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border-l-4 border-blue-600 rounded-lg backdrop-blur-md w-fit shadow-xl">
          <User className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-slate-300 tracking-wider">
            User: <span className="text-white font-mono font-bold ml-1">{userName || "UNKNOWN"}</span>
          </span>
        </div>
      </div>

      {/* ------------------------------------- */}
      {/* Center: Logo & Restart Trigger */}
      {/* ------------------------------------- */}
      <div className="absolute top-7 left-1/2 -translate-x-1/2 text-center pointer-events-auto">
        <div
          className="relative group cursor-pointer flex flex-col items-center"
          onClick={restartGame}
          title="Click to Restart Simulation"
        >
          {/* Subtle Back Glow */}
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/15 transition-all duration-300" />
          <div className="flex-col p-3">

            <div className="flex items-center gap-2 relative z-10">
              <Building2 className="w-6 h-6 text-blue-400 mt-0.5" />
              <h1 className="text-3xl font-extrabold tracking-[0.3em] uppercase text-white hover:text-blue-200 transition-colors">
                HOME<span className="text-blue-500">QUEST</span>
              </h1>
            </div>
          </div>          
          {/* Separator Line with Gradient */}
          <div className="h-0.5 w-full max-w-xs bg-gradient-to-r from-transparent via-blue-500/60 to-transparent mt-2 opacity-50"></div>
        </div>
      </div>

      {/* ------------------------------------- */}
      {/* Right Group: Income, Savings & Reset */}
      {/* ------------------------------------- */}
      <div className="flex gap-4 pointer-events-auto items-center">
        <HUDItem
          icon={<TrendingUp className="w-5 h-5 text-green-300" />}
          label="Monthly Income"
          value={`€${finances.income.toLocaleString()}`}
          color="green"
        />
        <HUDItem
          icon={<PiggyBank className="w-5 h-5 text-emerald-300" />}
          label="Monthly Savings"
          value={`€${Math.round(monthlySavings).toLocaleString()}`}
          color="emerald"
        />
      </div>
    </div>
  )
}

// -------------------------------------
// HUDItem Component (Optimized)
// -------------------------------------
function HUDItem({
  icon,
  label,
  value,
  color,
}: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorClasses: any = {
    // Stärkere Akzente und Schatten für den Neotech-Look
    blue: "h-fit text-center border-blue-700/50 bg-slate-900/90 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]",
    green: "h-fit text-center  border-green-700/50 bg-slate-900/90 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]",
    purple: "h-fit text-center border-purple-700/50 bg-slate-900/90 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]",
    emerald: "h-fit text-center border-emerald-700/50 bg-slate-900/90 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]",
  }

  return (
    <div
      className={`flex flex-col justify-center px-6 py-3 rounded-xl border-2 transition-all min-w-[160px] ${colorClasses[color] || colorClasses.blue}`}
    >
      <div className="flex items-center gap-2 mb-0.5">
        {icon}
        <span className="text-[10px] uppercase tracking-widest opacity-80 font-bold text-slate-400">{label}</span>
      </div>
      <span className="text-xl font-extrabold font-mono leading-none">{value}</span>
    </div>
  )
}