"use client"

import type React from "react"
import { useState } from "react"
import { useGame } from "@/context/GameContext"
import { motion } from "framer-motion"
import { ArrowRight, HelpCircle, User, Building2 } from "lucide-react"
import * as Tooltip from "@radix-ui/react-tooltip"

export default function InitForm() {
  const { initializeGame, updateFilters } = useGame()

  const [name, setName] = useState("")
  const [age, setAge] = useState(25)
  const [income, setIncome] = useState(3500)
  const [capital, setCapital] = useState(10000)
  const [interestRates, setInterestRates] = useState(3.5)

  const [savingsRate, setSavingsRate] = useState(20)
  const [Region, setRegion] = useState("Bayern")
  const [City, setCity] = useState("München")

  const monthlySavings = Math.round(income * (savingsRate / 100))

  const citiesByRegion: Record<string, string[]> = {
  "Baden-Württemberg": [
    "Stuttgart", "Karlsruhe", "Mannheim", "Freiburg", "Heidelberg",
    "Ulm", "Heilbronn", "Pforzheim", "Reutlingen", "Tübingen"
  ],
  Bayern: [
    "München", "Nürnberg", "Augsburg", "Regensburg", "Ingolstadt",
    "Würzburg", "Erlangen", "Fürth", "Rosenheim", "Passau"
  ],
  Berlin: ["Berlin"],
  Brandenburg: [
    "Potsdam", "Cottbus", "Brandenburg an der Havel", "Frankfurt (Oder)"
  ],
  Bremen: ["Bremen", "Bremerhaven"],
  Hamburg: ["Hamburg"],
  Hessen: [
    "Frankfurt am Main", "Wiesbaden", "Darmstadt", "Kassel",
    "Offenbach", "Marburg", "Gießen", "Hanau", "Fulda"
  ],
  "Mecklenburg-Vorpommern": [
    "Rostock", "Schwerin", "Neubrandenburg", "Greifswald", "Stralsund"
  ],
  Niedersachsen: [
    "Hannover", "Braunschweig", "Osnabrück", "Oldenburg", "Wolfsburg",
    "Göttingen", "Hildesheim", "Salzgitter", "Celle"
  ],
  "Nordrhein-Westfalen": [
    "Köln", "Düsseldorf", "Dortmund", "Essen", "Duisburg",
    "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster",
    "Gelsenkirchen", "Mönchengladbach"
  ],
  "Rheinland-Pfalz": [
    "Mainz", "Ludwigshafen", "Koblenz", "Trier", "Kaiserslautern"
  ],
  Saarland: ["Saarbrücken", "Neunkirchen", "Homburg"],
  Sachsen: [
    "Leipzig", "Dresden", "Chemnitz", "Zwickau", "Görlitz", "Plauen"
  ],
  "Sachsen-Anhalt": [
    "Magdeburg", "Halle (Saale)", "Dessau-Roßlau", "Wittenberg"
  ],
  "Schleswig-Holstein": [
    "Kiel", "Lübeck", "Flensburg", "Neumünster"
  ],
  Thüringen: [
    "Erfurt", "Jena", "Gera", "Weimar", "Eisenach"
  ],
}


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      // keep same initialize signature as before: savingsRate is passed where desiredRate used to be
      initializeGame(name, age, income, capital, interestRates, savingsRate, savingsRate)
      updateFilters({ region: Region, city: City })
    }
  }

  const InfoTooltip = ({ text }: { text: string }) => (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <HelpCircle className="w-3 h-3 text-slate-400 cursor-help hover:text-blue-400 transition-colors inline-block align-middle" />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-[60] px-3 py-2 text-xs bg-slate-800 text-slate-200 rounded border border-slate-700 shadow-xl max-w-[220px]"
            sideOffset={5}
          >
            {text}
            <Tooltip.Arrow className="fill-slate-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl p-6 bg-black/50 border border-blue-500/20 rounded-2xl backdrop-blur-xl shadow-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 shadow-sm border border-blue-400/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-widest text-white">HOME <span className="text-blue-400">QUEST</span></h1>
            <p className="text-xs text-blue-300 uppercase tracking-wide">Financial Journey Simulator</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Name (full width on small, left on larger) */}
          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-1">
              Codename
              <InfoTooltip text="Your alias in the simulation." />
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Codename..."
                className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md text-white placeholder:text-slate-600 outline-none transition-all font-mono text-sm"
                required
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-1">
              Age
              <InfoTooltip text="Your starting age." />
            </label>
            <input
              type="number"
              min="18"
              max="100"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md text-white text-sm outline-none"
              required
            />
          </div>

          {/* Savings Rate */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-1">
              Savings Rate (%)
              <InfoTooltip text="Percentage of monthly income you save." />
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={savingsRate}
                onChange={(e) => setSavingsRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md text-white text-sm outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-green-300 font-mono bg-green-950/40 px-2 py-0.5 rounded">
                €{monthlySavings}/mo
              </div>
            </div>
          </div>

          {/* Income */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-1">
              Income/mo (€)
              <InfoTooltip text="Your monthly net income." />
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md text-white text-sm outline-none"
              required
            />
          </div>

          {/* Start Capital */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-1">
              Start Capital (€)
              <InfoTooltip text="Money you have right now." />
            </label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md text-white text-sm outline-none"
              required
            />
          </div>

          {/* Loan Interest - span two cols on small screens */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-1">
              Loan Interest (%)
              <InfoTooltip text="Estimated mortgage interest rate." />
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRates}
              onChange={(e) => setInterestRates(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md text-white text-sm outline-none"
            />
          </div>

          {/* Region + City side-by-side on larger screens */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-1">Region <InfoTooltip text="Select your federal state." /></label>
            <select
              value={Region}
              onChange={(e) => {
                setRegion(e.target.value)
                setCity(citiesByRegion[e.target.value][0])
              }}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            >
              {Object.keys(citiesByRegion).map((reg) => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-1">City <InfoTooltip text="Select the city inside your region." /></label>
            <select
              value={City}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            >
              {citiesByRegion[Region].map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          {/* Submit button spans two columns */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-md uppercase tracking-wide text-sm"
            >
              Start Simulation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
