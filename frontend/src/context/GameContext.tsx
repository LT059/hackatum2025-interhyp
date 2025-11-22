"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { type House, MOCK_HOUSES, LIFE_EVENTS } from "@/lib/mock-data"

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
  changeAge: () => void
  triggerLifeEvent: () => void
  submitLifeEvent: (data: LifeEventData) => void
  resolveChance: (choiceIndex: number) => void
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

  const [userName, setUserName] = useState("")

  const submitLifeEvent = (data: LifeEventData) => {
    setState((prev) => ({
      ...prev,
      finances: {
        ...prev.finances,
        capital: prev.finances.capital - data.oneTimeCost,
        income: prev.finances.income - data.yearlyCost / 12,
      },
    }))
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

  const changeAge = () => {
    setState((prev) => {
      const newAge = prev.age + 1

      const annualSavings = prev.finances.income * 12 * (prev.finances.savings_rate / 100)
      const newCapital = prev.finances.capital + annualSavings
      const newEquity = newCapital

      // Check if capital crossed €5000 threshold
      const capitalGained = newCapital - prev.lastSquareCapital
      const squaresToMove = Math.floor(capitalGained / 5000)
      const newSquareId = prev.square_id + squaresToMove
      const newLastSquareCapital =
        squaresToMove > 0 ? prev.lastSquareCapital + squaresToMove * 5000 : prev.lastSquareCapital

      return {
        ...prev,
        age: newAge,
        square_id: newSquareId,
        equity: newEquity,
        finances: { ...prev.finances, capital: newCapital },
        lastSquareCapital: newLastSquareCapital,
      }
    })
  }

  const triggerLifeEvent = () => {
    const randomEvent = LIFE_EVENTS[Math.floor(Math.random() * LIFE_EVENTS.length)]
    setState((prev) => ({
      ...prev,
      activeChance: randomEvent,
    }))
  }

  const resolveChance = (choiceIndex: number) => {
    if (!state.activeChance) return

    const choice = state.activeChance.options[choiceIndex]
    setState((prev) => ({
      ...prev,
      finances: {
        ...prev.finances,
        income: prev.finances.income + (choice.effect.income || 0),
        capital: prev.finances.capital + (choice.effect.capital || 0),
      },
      activeChance: null,
    }))
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
        triggerLifeEvent,
        resolveChance,
        updateFilters,
        getHouses,
        submitLifeEvent,
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
