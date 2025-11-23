"use client"

import type React from "react"

import { useGame } from "@/context/GameContext"
import { Wallet, Clock, TrendingUp, PiggyBank, RefreshCw, User, Building2 } from "lucide-react" // Updated imports

export default function HUD() {
  const { age, finances, userName, restartGame } = useGame() // Get new context values

  const monthlySavings = finances.income * (finances.savings_rate / 100)

  return (
    <div className="absolute top-0 left-0 right-0 p-6 z-40 flex justify-between items-start pointer-events-none select-none">
      {/* Left Group: Age & Capital */}
      <div className="flex flex-col gap-2 pointer-events-auto">
        <div className="flex gap-4">
          <HUDItem icon={<Clock className="w-4 h-4 text-blue-400" />} label="Age" value={age.toString()} color="blue" />
          <HUDItem
            icon={<Wallet className="w-4 h-4 text-purple-400" />}
            label="Capital"
            value={`€${finances.capital.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            color="purple"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-full backdrop-blur-md w-fit mt-2 shadow-lg">
          <User className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
            QUESTNAME: <span className="text-white font-bold">{userName || "UNKNOWN"}</span>
          </span>
        </div>
      </div>

      {/* Center: Logo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <div
          className="relative group cursor-pointer pointer-events-auto flex flex-col items-center"
          onClick={restartGame}
          title="Click to Restart"
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/30 transition-all" />
          <div className="flex items-center gap-2 relative z-10">
            <Building2 className="w-5 h-5 text-blue-500 mb-1" />
            <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-white neon-text text-shadow-sm">
              HOME<span className="text-blue-500">QUEST</span>
            </h1>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-1"></div>
        </div>
      </div>

      {/* Right Group: Income & Savings */}
      <div className="flex gap-4 pointer-events-auto items-start">
        <HUDItem
          icon={<TrendingUp className="w-4 h-4 text-green-400" />}
          label="Income/mo"
          value={`€${finances.income.toLocaleString()}`}
          color="green"
        />
        <HUDItem
          icon={<PiggyBank className="w-4 h-4 text-emerald-400" />}
          label="Savings/mo"
          value={`€${Math.round(monthlySavings).toLocaleString()}`}
          color="emerald"
        />

        <button
          onClick={restartGame}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/80 border border-red-500/30 text-red-400 hover:bg-red-900/50 hover:text-red-200 hover:border-red-400 transition-all backdrop-blur-md shadow-lg"
          title="Reset Simulation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function HUDItem({
  icon,
  label,
  value,
  color,
}: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorClasses: any = {
    blue: "border-blue-500/30 bg-blue-950/40 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
    green: "border-green-500/30 bg-green-950/40 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
    purple: "border-purple-500/30 bg-purple-950/40 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.1)]",
    emerald: "border-emerald-500/30 bg-emerald-950/40 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
  }

  return (
    <div
      className={`flex flex-col justify-center px-5 py-2 rounded-lg border backdrop-blur-md min-w-[120px] ${colorClasses[color] || colorClasses.blue}`}
    >
      <div className="flex items-center gap-2 mb-0.5">
        {icon}
        <span className="text-[9px] uppercase tracking-widest opacity-70 font-bold">{label}</span>
      </div>
      <span className="text-lg font-bold font-mono leading-none">{value}</span>
    </div>
  )
}
