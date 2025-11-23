"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react" // useCallback hinzugefügt
import { type House} from "@/lib/mock-data"
import { changeAge as changeAgeApi } from '../api/changeAge';
import { getHouses as getHousesApi } from '../api/getHouses';

// Caching State Typ
type HouseCache = Record<number, House[]>;

interface GameState {
    isInitialized: boolean
    age: number
    equity: number[]
    square_id: number
    finances: {
        income: number
        capital: number
        interest_rates: number
        desired_rates: number
        savings_rate: number
    }
    houses: House[]
    activeChance: any[] | null
    filters: {
        type: string[]
        sortBy: "desc" | "asc"
        sortKey:
            | "buyingPrice"
            | "publishDate"
            | "squareMeter"
            | "rentPricePerSqm"
            | "grossReturn"
            | "constructionYear"
            | "pricePerSqm"
        min_price: number
        max_price: number
        city: string
        region: string
    }
    lastSquareCapital: number
}

interface LifeEventData {
    type: string
    customName?: string
    oneTimeCost: number
    yearlyCost: number
}

interface GameContextType extends GameState {
    initializeGame: (
        name: string,
        age: number,
        income: number,
        capital: number,
        interestRates: number,
        desiredRates: number,
        savingsRate: number,
    ) => void
    changeAge: (age: number) => Promise<void>
    changeChance: (data: LifeEventData) => Promise<void>
    updateFilters: (filters: Partial<GameState["filters"]>) => Promise<void>
    getHouses: () => Promise<House[]>
    restartGame: () => Promise<void>
    userName: string
    // NEU: Preloading Funktion für den GameContainer
    preloadNextAge: () => void 
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<GameState>({
        isInitialized: false,
        age: 25,
        equity: [],
        square_id: 0,
        finances: {
            income: 3500,
            capital: 10000,
            interest_rates: 3.5,
            desired_rates: 7.0,
            savings_rate: 20,
        },
        houses: [], 
        activeChance: [],
        filters: {
            type: [],
            sortBy: "asc",
            sortKey: "buyingPrice",
            min_price: 0,
            max_price: 2000000,
            city: "",
            region: "",
        },
        lastSquareCapital: 10000,
    })

    const [userName, setUserName] = useState("")
    // NEU: State für den House-Cache
    const [houseCache, setHouseCache] = useState<HouseCache>({});


    // Hilfsfunktion zum Laden der Häuser (wird in changeAge und preloadNextAge verwendet)
    const loadHouses = async (gameState: GameState) => {
        const backendHouses = await getHousesApi(AiStateToBackendState(gameState));
        return houseToArray(backendHouses);
    }
    
    // NEU: Funktion zum Vorladen des nächsten Alters
    const preloadNextAge = useCallback(async () => {
        const nextAge = state.age + 1;

        if (houseCache[nextAge] === undefined) {
            // Temporären State erstellen, der das nächste Alter simuliert, um die API korrekt aufzurufen
            const tempState = { ...state, age: nextAge };
            const nextHouses = await loadHouses(tempState);
            
            // Speichern im Cache
            setHouseCache(prev => ({ ...prev, [nextAge]: nextHouses }));
            console.log(`[Cache] Preloaded houses for age: ${nextAge}`);
        }
    }, [state.age, state.filters, houseCache]); // Dependencies sind wichtig für korrekte Daten

    
    const changeAge = async (amount: number) => {
        const newAge = state.age + amount;
        
        // 1. Backend API aufrufen, um den neuen Spielstatus (finances, equity etc.) zu berechnen
        try {
            const old_state = AiStateToBackendState(state);
            const new_state_from_api = await changeAgeApi(amount, old_state);
            
            // Aktualisiere den State mit den neuen Finanzdaten
            const updatedState = BackendStateToAiState(new_state_from_api, state);
            
            // 2. Häuser laden (mit oder ohne Cache)
            let newHouses: House[] = [];

            if (amount === 1 && houseCache[newAge]) {
                // CACHE HIT: Verwende die vorgeladenen Daten
                newHouses = houseCache[newAge];
                setHouseCache(prev => {
                    const next = { ...prev };
                    delete next[newAge]; // Entferne die Daten, da sie jetzt verwendet werden
                    return next;
                });
                console.log(`[Cache] Used houses from cache for age: ${newAge}`);
            } else {
                // CACHE MISS oder Rückwärtsbewegung: Lade die Häuser neu vom Backend
                newHouses = await loadHouses(updatedState);
                console.log(`[Cache] Loaded houses directly for age: ${newAge}`);
            }
            
            // 3. Finalen State setzen
            setState({
                ...updatedState,
                houses: newHouses,
            });

        } catch (error) {
            console.error("Fehler beim Aufrufen von changeAgeApi:", error);
        }
    }
    
    // ... andere Funktionen (initializeGame, updateFilters, getHouses, restartGame) bleiben unverändert
    // Der Code für initializeGame, updateFilters, getHouses und restartGame wurde weggelassen,
    // um die Übersichtlichkeit zu erhöhen. Bitte fügen Sie ihn unterhalb des changeAge-Blocks ein.
    // Achten Sie darauf, dass `getHouses` die neue `loadHouses`-Hilfsfunktion verwendet.

    // ********** Hier die unveränderten Funktionen einfügen **********

    const changeChance = async (data: LifeEventData) => {
        setState((prev) => ({
            ...prev,
            activeChance: [...(prev.activeChance || []), data],
        }))
        await getHouses()
    }

    const initializeGame = async (
        name: string,
        age: number,
        income: number,
        capital: number,
        interestRates: number,
        desiredRates: number,
        savingsRate: number,
    ) => {
        setUserName(name)

        await setState((prev) => ({
            ...prev,
            isInitialized: true,
            age,
            finances: {
                income,
                capital,
                interest_rates: interestRates,
                desired_rates: desiredRates,
                savings_rate: savingsRate,
            },
            equity: [],
            lastSquareCapital: capital,
        }))

        // Houses nach Initialisierung laden
        const initState = {
            ...state,
            age,
            finances: {
                income,
                capital,
                interest_rates: interestRates,
                desired_rates: desiredRates,
                savings_rate: savingsRate,
            },
            isInitialized: true
        }
        const frontendHouses = await loadHouses(initState);
        setState((prev) => ({ ...prev, houses: frontendHouses }))
    }

    const updateFilters = async (newFilters: Partial<GameState["filters"]>) => {
        // Zuerst Filter aktualisieren
        const updatedState = {
            ...state,
            filters: { ...state.filters, ...newFilters },
        };
        setState(updatedState);

        // Dann Häuser neu laden, da Filteränderungen die Häuserliste beeinflussen
        const frontendHouses = await loadHouses(updatedState);
        setState((prev) => ({ ...prev, houses: frontendHouses }));
    }

    const getHouses = async () => {
        const frontendHouses = await loadHouses(state);
        setState((prev) => ({ ...prev, houses: frontendHouses }));
        return frontendHouses;
    }

    const restartGame = async () => {
        setUserName("")

        const initialState: GameState = {
            isInitialized: false,
            age: 25,
            equity: [],
            square_id: 0,
            finances: {
                income: 3500,
                capital: 10000,
                interest_rates: 3.5,
                desired_rates: 7.0,
                savings_rate: 20,
            },
            houses: [],
            activeChance: [],
            filters: {
                type: [],
                sortBy: "asc",
                sortKey: "buyingPrice",
                min_price: 0,
                max_price: 2000000,
                city: "",
                region: "",
            },
            lastSquareCapital: 10000,
        }

        setState(initialState)
        setHouseCache({}); // Cache leeren

        // Houses nach Reset laden
        const frontendHouses = await loadHouses(initialState)
        setState((prev) => ({ ...prev, houses: frontendHouses }))
    }

    // *************************************************************
    
    return (
        <GameContext.Provider
            value={{
                ...state,
                userName,
                initializeGame,
                changeAge,
                updateFilters,
                getHouses,
                changeChance,
                restartGame,
                preloadNextAge, // NEU: Funktion bereitstellen
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

export function useGame() {
    const context = useContext(GameContext)
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider")
    }
    return context
}

// Hilfsfunktionen (unverändert)

function AiStateToBackendState(state: GameState) {
    return {
        age: state.age,
        equity: state.equity,
        square_id: state.square_id,
        finance: {
            income: state.finances.income,
            capital: state.finances.capital,
            interest_rates: state.finances.interest_rates,
            desired_rates: state.finances.desired_rates,
        },
        filter_option: {
            max_budget: state.filters.max_price,
            type: state.filters.type.join(","),
            sort_type: state.filters.sortBy,
            size: 0,
            city: state.filters.city,
            region: state.filters.region,
        },
        chance: state.activeChance?.map(c => ({
            chance_type: c.type,
            yearly_cost: c.yearlyCost,
            onetime_cost: c.oneTimeCost,
            age: state.age,
        })) || [],
    }
}

function houseToArray(houses: any[]) {
    return houses.map(BackendHousesToFrontend)
}

function BackendHousesToFrontend(backendHouses: any) {
    return {
        id: backendHouses.id,
        title: backendHouses.title,
        type: "real estate",
        buying_price: backendHouses.buying_price,
        rooms: backendHouses.rooms,
        squaremeter: backendHouses.square_meter,
        image_url: backendHouses.image_url,
        description: backendHouses.link,
        publishDate: "1999-12-31",
        rentPricePerSqm: 0,
        grossReturn: 0,
        constructionYear: backendHouses.construction_year,
        pricePerSqm: 0,
        link: backendHouses.link,
        finance_duration: backendHouses.finance_duration,
    }
}

function BackendStateToAiState(backendState: any, aiState: GameState): GameState {
    return {
        ...aiState,
        age: backendState.age,
        equity: backendState.equity,
        square_id: backendState.square_id,
        finances: {
            ...aiState.finances,
            income: backendState.finance.income,
            capital: backendState.finance.capital,
            interest_rates: backendState.finance.interest_rates,
            desired_rates: backendState.finance.desired_rates,
        },
        activeChance: (backendState.chance || []).map((c: any) => ({
            type: c.chance_type,
            oneTimeCost: c.onetime_cost,
            yearlyCost: c.yearly_cost,
        })),
        filters: {
            ...aiState.filters,
            type: backendState.filter_option.type.split(","),
            sortBy: backendState.filter_option.sort_type,
            max_price: backendState.filter_option.max_budget,
            city: backendState.filter_option.city,
            region: backendState.filter_option.region,
        },
    }
}