"use client"

import type React from "react"
import { useState } from "react"
// Stellen Sie sicher, dass der Pfad zum Context korrekt ist
import { useGame } from "@/context/GameContext" 
import { motion } from "framer-motion"
import { ArrowRight, HelpCircle, User, Building2 } from "lucide-react"
import * as Tooltip from "@radix-ui/react-tooltip"

export default function InitForm() {
  // Stellen Sie sicher, dass 'initializeGame' und 'updateFilters' die richtigen Signaturen haben.
  const { initializeGame, updateFilters } = useGame() 

  const [name, setName] = useState("")
  const [age, setAge] = useState(25)
  const [income, setIncome] = useState(3500)
  const [capital, setCapital] = useState(10000)
  const [interestRates, setInterestRates] = useState(3.5)

  const [savingsRate, setSavingsRate] = useState(20)
  const [Region, setRegion] = useState("Bayern")
  const [City, setCity] = useState("München")

  // Berechnet die monatlichen Ersparnisse basierend auf dem Einkommen und der Sparrate
  const monthlySavings = Math.round(income * (savingsRate / 100))

  const citiesByRegion: Record<string, string[]> = {
    "Baden-Württemberg": ["Stuttgart", "Karlsruhe", "Mannheim", "Freiburg", "Heidelberg", "Ulm", "Heilbronn", "Pforzheim", "Reutlingen", "Tübingen"],
    Bayern: ["München", "Nürnberg", "Augsburg", "Regensburg", "Ingolstadt", "Würzburg", "Erlangen", "Fürth", "Rosenheim", "Passau"],
    Berlin: ["Berlin"],
    Brandenburg: ["Potsdam", "Cottbus", "Brandenburg an der Havel", "Frankfurt (Oder)"],
    Bremen: ["Bremen", "Bremerhaven"],
    Hamburg: ["Hamburg"],
    Hessen: ["Frankfurt am Main", "Wiesbaden", "Darmstadt", "Kassel", "Offenbach", "Marburg", "Gießen", "Hanau", "Fulda"],
    "Mecklenburg-Vorpommern": ["Rostock", "Schwerin", "Neubrandenburg", "Greifswald", "Stralsund"],
    Niedersachsen: ["Hannover", "Braunschweig", "Osnabrück", "Oldenburg", "Wolfsburg", "Göttingen", "Hildesheim", "Salzgitter", "Celle"],
    "Nordrhein-Westfalen": ["Köln", "Düsseldorf", "Dortmund", "Essen", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Gelsenkirchen", "Mönchengladbach"],
    "Rheinland-Pfalz": ["Mainz", "Ludwigshafen", "Koblenz", "Trier", "Kaiserslautern"],
    Saarland: ["Saarbrücken", "Neunkirchen", "Homburg"],
    Sachsen: ["Leipzig", "Dresden", "Chemnitz", "Zwickau", "Görlitz", "Plauen"],
    "Sachsen-Anhalt": ["Magdeburg", "Halle (Saale)", "Dessau-Roßlau", "Wittenberg"],
    "Schleswig-Holstein": ["Kiel", "Lübeck", "Flensburg", "Neumünster"],
    Thüringen: ["Erfurt", "Jena", "Gera", "Weimar", "Eisenach"]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      // ACHTUNG: Prüfen Sie die Signatur von initializeGame. 
      // Der letzte Parameter scheint ein Duplikat von savingsRate zu sein.
      initializeGame(name, age, income, capital, interestRates, savingsRate, savingsRate)
      updateFilters({ region: Region, city: City })
    }
  }

  const InfoTooltip = ({ text }: { text: string }) => (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <HelpCircle className="w-3 h-3 text-slate-500 cursor-help hover:text-blue-400 transition-colors inline-block align-middle mb-0.5" />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="z-[60] px-3 py-2 text-xs bg-slate-800 text-slate-200 rounded border border-slate-700 shadow-xl max-w-[200px]" sideOffset={5}>
            {text}
            <Tooltip.Arrow className="fill-slate-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg p-8 bg-black/50 border border-blue-500/30 rounded-2xl backdrop-blur-xl shadow-[0_0_50px_rgba(37,99,235,0.2)] max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 shadow-lg border border-blue-400/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-[0.2em] text-white mb-2 drop-shadow-md">
            HOME<span className="text-blue-500">QUEST</span>
          </h1>
          <p className="text-blue-400 text-xs uppercase tracking-[0.3em] font-bold">Financial Journey Simulator</p>
        </div>

<form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Reihe 1: Codename & Age */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Codename</label>
                <InfoTooltip text="Your alias in the simulation." />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Codename..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-white placeholder:text-slate-600 outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Age</label>
                <InfoTooltip text="Your starting age." />
              </div>
              <input
                type="number"
                min="18"
                max="100"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-white outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Reihe 2: Savings Rate & Income/mo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Savings Rate (%)</label>
                <InfoTooltip text="Percentage of monthly income you save." />
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={savingsRate}
                  onChange={(e) => setSavingsRate(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-white outline-none transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-green-400 font-mono bg-green-950/50 px-1.5 py-0.5 rounded">
                  €{monthlySavings}/mo
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Income/mo (€)</label>
                <InfoTooltip text="Your monthly net income." />
              </div>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-white outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Reihe 3 (NEU): Start Capital & Loan Interest */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Capital (€) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Start Capital (€)</label>
                <InfoTooltip text="Money you have right now." />
              </div>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-white outline-none transition-all"
                required
              />
            </div>

            {/* Loan Interest (%) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Loan Interest (%)</label>
                <InfoTooltip text="Estimated mortgage interest rate." />
              </div>
              <input
                type="number"
                step="0.1"
                value={interestRates}
                onChange={(e) => setInterestRates(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-white outline-none transition-all"
                required
              />
            </div>
          </div>
          
          {/* Reihe 4: Region & City */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Region</label>
              <select 
                value={Region} 
                onChange={(e) => { 
                  const newRegion = e.target.value;
                  setRegion(newRegion); 
                  setCity(citiesByRegion[newRegion][0]); 
                }} 
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              >
                {Object.keys(citiesByRegion).map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">City</label>
              <select 
                value={City} 
                onChange={(e) => setCity(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              >
                {citiesByRegion[Region].map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="group w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] uppercase tracking-widest">
            Start Simulation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  )
}