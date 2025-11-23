"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type House} from "@/lib/mock-data"
import { changeAge as changeAgeApi } from '../api/changeAge';
import { getHouses as getHousesApi } from '../api/getHouses';

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
    changeAge: (age:number) => Promise<void>
    changeChance: (data: LifeEventData) => Promise<void>
    updateFilters: (filters: Partial<GameState["filters"]>) => Promise<void>
    getHouses: () => Promise<House[]>
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
        const backendHouses = await getHousesApi(AiStateToBackendState({
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
        }))
        setState((prev) => ({ ...prev, houses: houseToArray(backendHouses) }))
    }


    const changeAge = async (age: number) => {
        try {
            const old_state = AiStateToBackendState(state)
            const new_state = await changeAgeApi(age, old_state)
            setState((prev) => BackendStateToAiState(new_state, prev))
            const backendHouses = await getHousesApi(AiStateToBackendState(state))
            setState((prev) => ({ ...prev, houses: houseToArray(backendHouses) }))

        } catch (error) {
            console.error("Fehler beim Aufrufen von changeAgeApi:", error)
        }
    }

    const updateFilters = async (newFilters: Partial<GameState["filters"]>) => {
        await setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, ...newFilters },
        }))
        //await getHouses()
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

        await setState(initialState)

        // Houses nach Reset laden
        const backendHouses = await getHousesApi(AiStateToBackendState(initialState))
        setState((prev) => ({ ...prev, houses: houseToArray(backendHouses) }))
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
