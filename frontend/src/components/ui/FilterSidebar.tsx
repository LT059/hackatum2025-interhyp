"use client"

import { useEffect, useState, useCallback } from "react"
import { useGame } from "@/context/GameContext"
import { motion, AnimatePresence } from "framer-motion"
import {
    SlidersHorizontal,
    Home,
    Building,
    Building2,
    Warehouse,
    Trees,
    X, // X-Icon für Schließen
} from "lucide-react"

// Stadt-Datenbank (unverändert)
const citiesByRegion: Record<string, string[]> = {
    // ... (Ihre citiesByRegion Datenbank) ...
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

// Liste der Bundesländer
const germanStates = Object.keys(citiesByRegion);

export default function FilterSidebar() {
    const { filters, updateFilters, getHouses, equity } = useGame()
    const [isOpen, setIsOpen] = useState(false) // Steuert das Popup

    // Hilfsfunktionen (unverändert)
    useEffect(() => {
        getHouses()
    }, [filters])

    const handleRegionChange = useCallback((newRegion: string) => {
        if (!newRegion) {
            updateFilters({ region: "", city: "" });
            return;
        }
        const availableCities = citiesByRegion[newRegion];
        let newCity = filters.city;
        if (!availableCities.includes(filters.city)) {
            newCity = availableCities[0] || "";
        }
        updateFilters({ region: newRegion, city: newCity });
    }, [filters.city, updateFilters]);

    const handleCityChange = useCallback((newCity: string) => {
        updateFilters({ city: newCity });
    }, [updateFilters]);

    const toggleType = (type: string) => {
        const newType = filters.type === type ? "" : type; 
        updateFilters({ type: newType })
    }

    // Property Types (unverändert)
    const propertyTypes = [
        { value: "APARTMENTBUY", label: "Apt", icon: Building2 },
        { value: "HOUSEBUY", label: "House", icon: Home },
        { value: "LANDBUY", label: "Land", icon: Trees },
        { value: "GARAGEBUY", label: "Garage", icon: Warehouse },
        { value: "OFFICEBUY", label: "Office", icon: Building },
    ]

    return (
        <>
            {/* Öffnungsknopf für das Popup (kann überall platziert werden, hier nur ein Beispiel) */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-10 z-50 p-4 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-500 transition-all flex items-center gap-2 font-bold uppercase tracking-wider"
            >
                <SlidersHorizontal size={18} />
                Filters
            </button>

            {/* AnimatePresence sorgt für Exit-Animationen */}
            <AnimatePresence>
                {isOpen && (
                    // 1. Modales Overlay (Hintergrund)
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)} // Schließt bei Klick außerhalb
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    >
                        {/* 2. Popup-Container */}
                        <motion.div
                            initial={{ y: 50, scale: 0.9 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 50, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()} // Verhindert, dass Klick das Popup schließt
                            // Feste Größe (w-96 = 384px), abgerundete Ecken, Neotech-Stil
                            className="relative w-96 h-fit max-h-[80vh] bg-slate-950 border border-blue-500/50 rounded-xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Neon Glow Akzent */}
                            <div className="absolute inset-0 border-2 border-blue-600/10 rounded-xl pointer-events-none" />
                            
                            {/* Header-Sektion */}
                            <div className="flex items-center justify-between text-blue-400 border-b border-blue-500/30 p-4 bg-black/30">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal size={16} strokeWidth={2} />
                                    <h2 className="text-sm font-bold uppercase tracking-wider">Market Filters</h2>
                                </div>
                                
                                {/* Schließen-Button */}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 rounded-full text-slate-500 hover:text-blue-400 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content-Bereich: Max-Höhe, scrollbar */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                
                                {/* PROPERTY TYPE */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] text-blue-400 uppercase font-bold tracking-wider flex items-center gap-2">
                                        Type Selection
                                        <span className="h-px flex-1 bg-slate-800"></span>
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2"> {/* 4 Spalten für mehr Balance */}
                                        {propertyTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                onClick={() => toggleType(type.value)}
                                                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all ${
                                                    filters.type === type.value
                                                        ? "bg-blue-600/30 border-blue-400 text-blue-200 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                                                        : "bg-slate-900/60 border-slate-700/50 text-slate-500 hover:border-blue-600/50 hover:text-slate-300"
                                                }`}
                                            >
                                                <type.icon size={16} strokeWidth={1.8} />
                                                <span className="text-[9px] font-medium uppercase">{type.label}</span>
                                            </button>
                                        ))}
                                        
                                    </div>
                                </div>

                                {/* LOCATION FELDER */}
                                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                                    <h3 className="text-[10px] text-blue-400 uppercase font-bold tracking-wider flex items-center gap-2">
                                        Location
                                        <span className="h-px flex-1 bg-slate-800"></span>
                                    </h3>
                                    
                                    {/* Region Select (Bundesland) */}
                                    <div className="space-y-1">
                                        <label className="block text-[10px] text-slate-500 uppercase font-medium">Region (State)</label>
                                        <select
                                            value={filters.region}
                                            onChange={(e) => handleRegionChange(e.target.value)}
                                            className="w-full pl-3 pr-2 py-2.5 bg-slate-900/80 border border-slate-800 text-slate-300 text-sm rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="">All Germany</option>
                                            {germanStates.map((state) => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {/* City Select (Dynamisch basierend auf Region) */}
                                    <div className="space-y-1">
                                        <label className="block text-[10px] text-slate-500 uppercase font-medium">City</label>
                                        {filters.region && citiesByRegion[filters.region] ? (
                                            <select
                                                value={filters.city}
                                                onChange={(e) => handleCityChange(e.target.value)}
                                                className="w-full pl-3 pr-2 py-2.5 bg-slate-900/80 border border-slate-800 text-slate-300 text-sm rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            >
                                                <option value="">All Cities in {filters.region}</option> 
                                                {citiesByRegion[filters.region].map((city) => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="text-xs text-slate-600 p-2 border border-slate-800 rounded-lg bg-slate-900/50">
                                                Select a region above.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Footer-Bereich für Buttons (optional) */}
                            <div className="p-4 border-t border-blue-500/20 bg-black/30 flex justify-end">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-2 text-sm font-bold uppercase tracking-wider text-blue-100 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-md"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}