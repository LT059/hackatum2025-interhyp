import { createContext, useContext, useReducer } from "react";

// ---------- Initial State ----------
export const initialState = {
  age: 0,
  equity: 0,
  square_id: null,

  filter_options: {
    type: "",
    sort_type: "",
    size: "",
    city: ""
  },

  chance: {
    chance_type: "",
    age: 0,
    yearly_cost: 0,
    onetime_cost: 0
  },

  finance: {
    income: 0,
    capital: 0,
    interest_rates: [],
    desired_rates: []
  }
};

// ---------- Reducer ----------
function gameReducer(state, action) {
  switch (action.type) {
    case "SET_STATE":
      return {
        ...state,
        ...action.payload
      };

    case "UPDATE_FILTER_OPTIONS":
      return {
        ...state,
        filter_options: {
          ...state.filter_options,
          ...action.payload
        }
      };

    case "UPDATE_CHANCE":
      return {
        ...state,
        chance: {
          ...state.chance,
          ...action.payload
        }
      };

    case "UPDATE_FINANCE":
      return {
        ...state,
        finance: {
          ...state.finance,
          ...action.payload
        }
      };

    case "UPDATE_EQUITY":
      return {
        ...state,
        equity: action.payload
      };

    case "UPDATE_AGE":
      return {
        ...state,
        age: action.payload
      };

    case "UPDATE_SQUARE_ID":
      return {
        ...state,
        square_id: action.payload
      };

    default:
      return state;
  }
}

// ---------- Context ----------
const GameContext = createContext();

// ---------- Provider ----------
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// ---------- Custom Hook ----------
export function useGameContext() {
  return useContext(GameContext);
}
