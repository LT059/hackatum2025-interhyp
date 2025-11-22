"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { type House, MOCK_HOUSES, LIFE_EVENTS } from "@/lib/mock-data"
import { get } from "http"
import { changeAge as changeAgeApi } from '../api/changeAge';
import { set } from "react-hook-form"
import { printTreeView } from "next/dist/build/utils"

interface GameState {
  isInitialized: boolean
  age: number
  equity: number
  square_id: number
  finances: {
    income: number
    capital: number
    interest_rates: number
    desired_rates: number
    savings_rate: number // Added savings_rate
  }
  houses: House[]
  activeChance: any | null
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
    geoSearchQuery: string
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
    age: number, // Added age
    income: number,
    capital: number,
    interestRates: number,
    desiredRates: number,
    savingsRate: number, // Added savingsRate
  ) => void
  changeAge: (age:number) => Promise<void>
  changeChance: (data: LifeEventData) => void
  updateFilters: (filters: Partial<GameState["filters"]>) => void
  getHouses: () => void
  restartGame: () => void // Added restartGame
  userName: string
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    isInitialized: false,
    age: 25,
    equity: 10000,
    square_id: 0,
    finances: {
      income: 3500,
      capital: 10000,
      interest_rates: 3.5,
      desired_rates: 7.0,
      savings_rate: 20, // Default savings rate
    },
    houses: MOCK_HOUSES,
    activeChance: [],
    filters: {
      type: [],
      sortBy: "asc",
      sortKey: "buyingPrice",
      min_price: 0,
      max_price: 2000000,
      geoSearchQuery: "",
    },
    lastSquareCapital: 10000,
  })

  const [userName, setUserName] = useState("")

  const changeChance = (data: LifeEventData) => {
    setState((prev) => ({
      ...prev,
      activeChance: [
        ...prev.activeChance,
        data
      ],
    }))
    getHouses()
  }

  const initializeGame = (
    name: string,
    age: number, // Added age param
    income: number,
    capital: number,
    interestRates: number,
    desiredRates: number,
    savingsRate: number, // Added savingsRate param
  ) => {
    setUserName(name)
    setState((prev) => ({
      ...prev,
      isInitialized: true,
      age: age, // Set initial age
      finances: {
        income,
        capital,
        interest_rates: interestRates,
        desired_rates: desiredRates,
        savings_rate: savingsRate, // Set savings rate
      },
      equity: capital,
      lastSquareCapital: capital,
    }))
  }

  const changeAge = async (age: number) => {
  console.log("debug: changeAge gestartet...");
  try {
    let old_state = AiStateToBackendState(state);
    console.log("debug: alter State für Backend:", old_state);

    const new_state = await changeAgeApi(age, old_state); // <-- Wahrscheinlichster Fehlerpunkt

    console.log("debug: neuen State vom Backend erhalten:", new_state);
    setState((prev) => BackendStateToAiState(new_state, prev));

  } catch (error) {
    // HIER siehst du den Fehler, der von changeAgeApi geworfen wird
    console.error("Fehler beim Aufrufen von changeAgeApi:", error); 
  }
}


  const updateFilters = (newFilters: Partial<GameState["filters"]>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }))
    getHouses()
  }

  const getHouses = () => {
    let filtered = [...MOCK_HOUSES]

    // Filter by type
    if (state.filters.type.length > 0) {
      filtered = filtered.filter((house) => state.filters.type.includes(house.type))
    }

    // Filter by price range
    filtered = filtered.filter(
      (house) => house.buying_price >= state.filters.min_price && house.buying_price <= state.filters.max_price,
    )

    // Filter by geo search (simple title/description search)
    if (state.filters.geoSearchQuery) {
      const query = state.filters.geoSearchQuery.toLowerCase()
      filtered = filtered.filter(
        (house) => house.title.toLowerCase().includes(query) || house.description.toLowerCase().includes(query),
      )
    }

    // Sort by selected key and direction
    const { sortKey, sortBy } = state.filters
    filtered.sort((a, b) => {
      let aVal: any = a.buying_price
      let bVal: any = b.buying_price

      if (sortKey === "buyingPrice") {
        aVal = a.buying_price
        bVal = b.buying_price
      } else if (sortKey === "squareMeter") {
        aVal = a.squaremeter
        bVal = b.squaremeter
      } else if (sortKey === "publishDate") {
        aVal = new Date(a.publishDate).getTime()
        bVal = new Date(b.publishDate).getTime()
      } else if (sortKey === "rentPricePerSqm") {
        aVal = a.rentPricePerSqm || 0
        bVal = b.rentPricePerSqm || 0
      } else if (sortKey === "grossReturn") {
        aVal = a.grossReturn || 0
        bVal = b.grossReturn || 0
      } else if (sortKey === "constructionYear") {
        aVal = a.constructionYear || 0
        bVal = b.constructionYear || 0
      } else if (sortKey === "pricePerSqm") {
        aVal = a.pricePerSqm
        bVal = b.pricePerSqm
      }

      return sortBy === "asc" ? aVal - bVal : bVal - aVal
    })

    setState((prev) => ({ ...prev, houses: filtered }))
  }

  const restartGame = () => {
    setState({
      isInitialized: false,
      age: 25,
      equity: 10000,
      square_id: 0,
      finances: {
        income: 3500,
        capital: 10000,
        interest_rates: 3.5,
        desired_rates: 7.0,
        savings_rate: 20,
      },
      houses: MOCK_HOUSES,
      activeChance: null,
      filters: {
        type: [],
        sortBy: "asc",
        sortKey: "buyingPrice",
        min_price: 0,
        max_price: 2000000,
        geoSearchQuery: "",
      },
      lastSquareCapital: 10000,
    })
    setUserName("")
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
        restartGame, // Exposed restartGame
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


// Extrahiert die Daten, die das Backend erwartet
function AiStateToBackendState(state: GameState) {
  console.log(1)
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
      type: state.filters.type.join(","), // Backend erwartet evtl. String
      sort_type: state.filters.sortBy,
      size: 0, // optional, je nach Backend
      city: state.filters.geoSearchQuery,
    },
    chance: state.activeChance?.map(c => ({
      chance_type: c.type,
      yearly_cost: c.yearlyCost,
      onetime_cost: c.oneTimeCost,
      age: state.age,
    })) || [],
  }
}

function BackendStateToAiState(backendState: any, aiState: GameState): GameState {
  console.log(2)
  return {
    ...aiState,
    age: backendState.age,
    equity: backendState.equity,
    square_id: backendState.square_id,
    finances: {
      ...aiState.finances, // behalte local savings_rate
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
      ...aiState.filters, // behalte eventuell andere lokale Filter-Einstellungen
      type: backendState.filter_option.type.split(","),
      sortBy: backendState.filter_option.sort_type,
      max_price: backendState.filter_option.max_budget,
      geoSearchQuery: backendState.filter_option.city,
    },
  }
}


