"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type House} from "@/lib/mock-data"
import { changeAge as changeAgeApi } from '../api/changeAge';
import { getHouses as getHousesApi } from '../api/getHouses';

interface AgeStateCache{
    state: GameState | null
} ;

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
        type: string
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
    changeAge: (age:number) => Promise<void>
    changeChance: (data: LifeEventData) => Promise<void>
    updateFilters: (filters: Partial<GameState["filters"]>) => Promise<void>
    getHouses: () => House[]
    restartGame: () => Promise<void>
    userName: string
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
        houses: [], // leer initialisieren
        activeChance: [],
        filters: {
            type: "",
            sortBy: "asc",
            sortKey: "buyingPrice",
            min_price: 0,
            max_price: 2000000,
            city: "",
            region: "",
        },
        lastSquareCapital: 10000,
    })
    const [stateCache, setStateCache] = useState<AgeStateCache>({state: null})

    const [userName, setUserName] = useState("")

    const changeChance = async (data: LifeEventData) => {
        setState((prev) => ({
            ...prev,
            activeChance: [...(prev.activeChance || []), data],
        }))
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
    }


    // ... inside GameProvider component

    const prefetchNextAgeState = async (currentState: GameState) => {
        try {
            // 1. Hole den Zustand für das nächste Alter (currentState.age + 1) vom Backend
            const backendState = AiStateToBackendState(currentState); 
            // Die Änderung um 1 Jahr wird hier explizit durchgeführt, da wir das nächste Alter vorab laden
            const next_age_state = await changeAgeApi(1, backendState);
            
            // 2. Transformiere den Backend-Zustand in den Frontend-Zustand
            // Wir nutzen den aktuellen Zustand (currentState) als Basis für die Transformation
            const next_ai_state = BackendStateToAiState(next_age_state, currentState);
            
            // 3. Hole die Häuser basierend auf dem zukünftigen Zustand (next_ai_state)
            const backendHouses: any[] = await getHousesApi(AiStateToBackendState(next_ai_state));
            const frontendHouses = houseToArray(backendHouses);

            // 4. Setze den Cache mit dem vollständig aktualisierten Zustand
            setStateCache({
                state: { 
                    ...next_ai_state,
                    houses: frontendHouses,
                }
            });
            console.log("Prefetched state for age", next_ai_state.age);
        } catch (error) {
            console.error("Fehler beim Prefetching:", error);
            // Bei Fehler den Cache zurücksetzen, um keine fehlerhaften Daten zu nutzen
            setStateCache({ state: null }); 
        }
    }

    const changeAge = async (delta_age: number) => {
        console.log("debug", state, stateCache)
        
        const isCacheValid = 
            stateCache.state !== null && 
            delta_age === 1 && 
            stateCache.state.age === state.age + 1 &&
            stateCache.state.activeChance?.length === state.activeChance?.length && 
            // Wichtig: Prüfen, ob Filter gleich sind, um unnötige/falsche Cache-Hits zu vermeiden
            stateCache.state.filters.sortBy === state.filters.sortBy && 
            stateCache.state.filters.sortKey === state.filters.sortKey && 
            stateCache.state.filters.max_price === state.filters.max_price && 
            stateCache.state.filters.city === state.filters.city && 
            stateCache.state.filters.region === state.filters.region;

        if (isCacheValid) {
            // Cache Hit: Den vorgehaltenen Zustand für das aktuelle Update nutzen
            console.log("Cache hit for age", state.age, "->", stateCache.state!.age);
            const nextStateFromCache = stateCache.state!;
            
            // 1. Aktuellen Zustand setzen
            setState(nextStateFromCache);
            
            // 2. Den Cache für den DARAUF FOLGENDEN Schritt vorab laden (neues prefetching)
            // Wir verwenden den Zustand, den wir gerade aus dem Cache geholt haben, als Basis für den nächsten Prefetch
            await prefetchNextAgeState(nextStateFromCache);

        } else {
            // Cache Miss oder delta_age != 1: Regulären API-Aufruf durchführen
            console.log("Cache miss/Direct Age Change for age", state.age);
            setStateCache({ state: null }); // Cache invalidieren, da wir es überspringen oder einen anderen delta_age haben

            try {
                const old_state = AiStateToBackendState(state)
                const new_backend_state = await changeAgeApi(delta_age, old_state)

                // 1. Transformiere und setze den aktuellen Zustand basierend auf Backend-Antwort
                const new_ai_state = BackendStateToAiState(new_backend_state, state);
                
                // 2. Hole Häuser für den NEUEN Zustand
                const backendHouses :any[] = await getHousesApi(AiStateToBackendState(new_ai_state))
                const frontendHouses = houseToArray(backendHouses)
                
                // 3. Setze den endgültigen Zustand
                setState(() => ({ 
                    ...new_ai_state, 
                    houses: frontendHouses 
                }));
                
                // 4. Den Cache für das nächste Alter (age + 1) nachladen, 
                //    aber nur, wenn wir gerade um 1 Jahr gesprungen sind, 
                //    um nicht unnötig zu prefetch-en.
                if (delta_age === 1) {
                    await prefetchNextAgeState({ ...new_ai_state, houses: frontendHouses });
                }

            } catch (error) {
                console.error("Fehler beim Aufrufen von changeAgeApi:", error)
            }
        }
    }
    useEffect(() => {
        // Führe das Prefetching aus, wenn sich state.filters oder state.activeChance ändert
        // oder direkt nach der Initialisierung (da state.age sich ändert oder state.isInitialized auf true gesetzt wird)
        
        // Wir übergeben den aktuellen 'state' an die Prefetch-Funktion
        if (state.isInitialized) prefetchNextAgeState(state);
        
        // Abhängigkeiten:
        // state.age: Löst Prefetch nach jedem erfolgreichen changeAge aus.
        // state.filters: Löst Prefetch aus, wenn der Benutzer die Filter ändert.
        // state.activeChance.length: Löst Prefetch aus, wenn eine neue Chance hinzugefügt/entfernt wird.
        // state.isInitialized: Löst Prefetch nach der ersten Initialisierung aus.
    }, [
        state.age, 
        state.isInitialized,
        state.filters.type,
        state.filters.sortBy,
        state.filters.sortKey,
        state.filters.min_price,
        state.filters.max_price,
        state.filters.city,
        state.filters.region,
        state.activeChance?.length, // Nur die Länge prüfen ist ein guter Kompromiss
    ]);

    const updateFilters = async (newFilters: Partial<GameState["filters"]>) => {
        await setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, ...newFilters },
        }))
    }

    const getHouses = async () => {
        const backendHouses = await getHousesApi(AiStateToBackendState(state))
        const frontendHouses = houseToArray(backendHouses)
        setState((prev) => ({ ...prev, houses: frontendHouses }))
        return frontendHouses
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
                type: "",
                sortBy: "asc",
                sortKey: "buyingPrice",
                min_price: 0,
                max_price: 2000000,
                city: "",
                region: "",
            },
            lastSquareCapital: 10000,
        }

        await setState(initialState)
    }


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

// Hilfsfunktionen

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
            type: state.filters.type,
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
        type: backendHouses.type,
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
