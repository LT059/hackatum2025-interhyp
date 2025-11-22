const API_BASE_URL = import.meta.env.BACKEND_URL;
const API_URL = `${API_BASE_URL}/initialize-game`;

export async function initializeGame(income, capital, interest_rates, desired_rates) {
  try {
    // Send input data to backend
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        income: income,
        capital: capital,
        interest_rates: interest_rates,
        desired_rates: desired_rates
      })
    });

    if (!response.ok) {
      throw new Error("Failed to initialize game");
    }

    // Receive calculated game state from backend
    const gameState = await response.json();

    console.log("Game State received from backend:", gameState);

    // Return the result so frontend can use it
    return gameState;

  } catch (error) {
    console.error("Oh ohh! Error initializing game:", error);
    return null;
  }
}
