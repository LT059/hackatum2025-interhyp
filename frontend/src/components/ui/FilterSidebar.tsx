"use client"

import { useEffect, useState, useCallback } from "react" // useCallback hinzugefügt
import { useGame } from "@/context/GameContext"
import { motion } from "framer-motion"
import {
    SlidersHorizontal,
    Home,
    Building,
    Building2,
    Warehouse,
    Trees,
    ChevronRight,
    ChevronLeft,
} from "lucide-react"

// Stadt-Datenbank (vom Ende des ursprünglichen Codes hierher verschoben)
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

// Liste der Bundesländer (keys von citiesByRegion)
const germanStates = Object.keys(citiesByRegion);

export default function FilterSidebar() {
    // Hole Filter und Update-Funktion aus dem Context
    const { filters, updateFilters, getHouses } = useGame()
    const [isOpen, setIsOpen] = useState(false)
    // const [cityInput, setCityInput] = useState("") // Nicht mehr benötigt

    // useEffect zum Abrufen der Häuser, wenn sich die Filter ändern.
    // Die Abhängigkeit 'getHouses' sollte mit useCallback im Context umschlossen werden, 
    // um unnötiges Neuladen zu vermeiden, wenn sie sich oft ändert. 
    // Hier wird davon ausgegangen, dass 'getHouses' stabil ist.
    useEffect(() => {
        getHouses()
    }, [])

    // Hilfsfunktion zur Behandlung der Regionsänderung
    const handleRegionChange = useCallback((newRegion: string) => {
        // Wenn keine Region (All Germany) gewählt ist, wird die Stadt auch zurückgesetzt.
        if (!newRegion) {
            updateFilters({ region: "", city: "" });
            return;
        }

        const availableCities = citiesByRegion[newRegion];
        let newCity = filters.city;

        // Wenn die aktuell gewählte Stadt nicht in der neuen Region existiert, 
        // wird die Stadt auf die erste Stadt der neuen Region oder auf "" gesetzt.
        if (!availableCities.includes(filters.city)) {
            newCity = availableCities[0] || "";
        }
        
        updateFilters({ region: newRegion, city: newCity });
    }, [filters.city, updateFilters]);

    // Hilfsfunktion zur Behandlung der Stadtänderung
    const handleCityChange = useCallback((newCity: string) => {
        updateFilters({ city: newCity });
    }, [updateFilters]);

    const toggleType = (type: string) => {
        const newTypes = filters.type.includes(type)
            ? filters.type.filter((t) => t !== type)
            : [...filters.type, type]
        updateFilters({ type: newTypes })
    }

    // ... (propertyTypes und sortOptions bleiben unverändert)
    const propertyTypes = [
        { value: "APPARTMENTBUY", label: "Apt", icon: Building2 },
        { value: "HOUSEBUY", label: "House", icon: Home },
        { value: "LANDBUY", label: "Land", icon: Trees },
        { value: "GARAGEBUY", label: "Garage", icon: Warehouse },
        { value: "OFFICEBUY", label: "Office", icon: Building },
    ]

    const sortOptions = [
        { value: "buyingPrice", label: "Price" },
        { value: "squareMeter", label: "Size" },
        { value: "rentPricePerSqm", label: "Rent" },
        { value: "grossReturn", label: "Return" },
    ]
    // ...

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-0 top-24 z-40 bg-slate-900 border-l border-t border-b border-blue-900/50 p-2 rounded-l-lg text-blue-400 hover:text-white transition-colors"
                style={{ right: isOpen ? "256px" : "0px", transition: "right 0.3s ease" }}
            >
                {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="absolute right-0 top-36 z-30 bg-slate-950/80 border-l border-y border-blue-900/30 py-4 px-1 rounded-l-lg hover:bg-blue-900/20 transition-colors cursor-pointer"
                >
                    <div className="writing-vertical-rl text-[10px] font-bold uppercase tracking-widest text-blue-400">
                        Filters
                    </div>
                </button>
            )}

            <motion.div
                initial={{ x: 300 }}
                animate={{ x: isOpen ? 0 : 300 }}
                className="absolute right-0 top-24 bottom-24 w-64 bg-slate-950/95 border-l border-blue-900/50 backdrop-blur-xl p-0 z-30 flex flex-col shadow-2xl"
            >
                <div className="flex items-center gap-2 text-blue-400 border-b border-blue-900/50 p-4 bg-black/20">
                    <SlidersHorizontal size={16} />
                    <h2 className="text-xs font-bold uppercase tracking-wider">Market Filters</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-2">
                            Property Type
                            <span className="h-px flex-1 bg-slate-800"></span>
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {propertyTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => toggleType(type.value)}
                                    className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border transition-all ${
                                        filters.type.includes(type.value)
                                            ? "bg-blue-600/20 border-blue-500 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                                            : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                                    }`}
                                >
                                    <type.icon size={16} strokeWidth={1.5} />
                                    <span className="text-[9px] font-medium">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-2">
                            Sort By
                            <span className="h-px flex-1 bg-slate-800"></span>
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {sortOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => updateFilters({ sortKey: opt.value as any })}
                                    className={`px-3 py-2 text-[10px] rounded border transition-all text-left ${
                                        filters.sortKey === opt.value
                                            ? "bg-blue-900/40 border-blue-500 text-blue-200"
                                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-900"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex bg-slate-900 rounded-lg border border-slate-800 p-1">
                            <button
                                onClick={() => updateFilters({ sortBy: "asc" })}
                                className={`flex-1 text-[10px] py-1.5 rounded ${filters.sortBy === "asc" ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                            >
                                Low ↑
                            </button>
                            <button
                                onClick={() => updateFilters({ sortBy: "desc" })}
                                className={`flex-1 text-[10px] py-1.5 rounded ${filters.sortBy === "desc" ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                            >
                                High ↓
                            </button>
                        </div>
                    </div>

                    {/* LOCATION FELDER (ANGEPASST) */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-2">
                            Location
                            <span className="h-px flex-1 bg-slate-800"></span>
                        </h3>
                        {/* Region Select (Bundesland) */}
                        <select
                            value={filters.region}
                            onChange={(e) => handleRegionChange(e.target.value)}
                            className="w-full pl-3 pr-2 py-2.5 bg-slate-900/50 border border-slate-800 text-slate-300 text-xs rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="">All Germany</option>
                            {germanStates.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                        
                        {/* City Select (Dynamisch basierend auf Region) */}
                        <div className="space-y-2">
                            <h3 className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">City</h3>
                            {filters.region && citiesByRegion[filters.region] ? (
                                <select
                                    value={filters.city}
                                    onChange={(e) => handleCityChange(e.target.value)}
                                    className="w-full pl-3 pr-2 py-2.5 bg-slate-900/50 border border-slate-800 text-slate-300 text-xs rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                >
                                    {/* Option zum Zurücksetzen der Stadt */}
                                    <option value="">All Cities in {filters.region}</option> 
                                    {citiesByRegion[filters.region].map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="text-xs text-slate-600 p-2 border border-slate-800 rounded-lg bg-slate-900/50">
                                    Please select a region first to filter by city.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    )
}