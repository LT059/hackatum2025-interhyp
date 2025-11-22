const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_URL = `${API_BASE_URL}/change-age`;

export async function changeAge(age, gameState) {
    console.log(API_URL)
  try {
    const response = await fetch(API_URL, {
      method: "POST", // sending data to backend
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        age: age,
        game_state: gameState
      })
    });

    if (!response.ok) {
      throw new Error("Failed to update age");
    }

    // Fetch updated game state from backend
    const updatedGameState = await response.json();

    console.log("Updated Game State received:", updatedGameState);

    return updatedGameState;

  } catch (error) {
    console.error("Error in changeAge:", error);
    return null;
  }
}