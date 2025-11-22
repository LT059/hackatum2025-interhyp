"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGame } from "@/context/GameContext"
import { AlertTriangle, Zap, Car, Baby, Plane, Stethoscope, HelpCircle, X } from "lucide-react"

export default function ChanceButtons() {
  const { submitLifeEvent } = useGame()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [customName, setCustomName] = useState("")
  const [oneTimeCost, setOneTimeCost] = useState("")
  const [yearlyCost, setYearlyCost] = useState("")

  const eventTypes = [
    { id: "car", label: "Car", icon: Car },
    { id: "child", label: "Child", icon: Baby },
    { id: "vacation", label: "Vacation", icon: Plane },
    { id: "medical", label: "Medical", icon: Stethoscope },
    { id: "other", label: "Custom", icon: HelpCircle },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType) return

    submitLifeEvent({
      type: selectedType,
      customName: selectedType === "other" ? customName : undefined,
      oneTimeCost: Number(oneTimeCost) || 0,
      yearlyCost: Number(yearlyCost) || 0,
    })
    setIsOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedType(null)
    setCustomName("")
    setOneTimeCost("")
    setYearlyCost("")
  }

  return (
    <>
      {/* Right Sidebar Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-full p-4 shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all duration-300 group"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 fill-white/20" />
          <span className="hidden group-hover:inline-block text-sm font-bold uppercase tracking-wider pr-2">
            Life Event
          </span>
        </div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-3 text-yellow-500">
                  <AlertTriangle className="w-6 h-6" />
                  <h2 className="text-xl font-bold uppercase tracking-wider">Trigger Life Event</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Event Type Selection */}
                <div className="grid grid-cols-5 gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                        selectedType === type.id
                          ? "bg-yellow-500/20 border-yellow-500 text-yellow-100"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      <type.icon className="w-6 h-6" />
                      <span className="text-[10px] font-bold uppercase">{type.label}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Name Input */}
                {selectedType === "other" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Event Name</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g., Wedding"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                )}

                {/* Cost Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">One-time Cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">€</span>
                      <input
                        type="number"
                        value={oneTimeCost}
                        onChange={(e) => setOneTimeCost(e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Yearly Cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">€</span>
                      <input
                        type="number"
                        value={yearlyCost}
                        onChange={(e) => setYearlyCost(e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedType}
                  className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-yellow-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                >
                  Confirm Event
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
