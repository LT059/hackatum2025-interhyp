const API_BASE_URL = import.meta.env.BACKEND_URL;
const API_URL = `${API_BASE_URL}/change-chance`;

export async function changeChance(chance, state) {
  try {
    const response = await fetch(API_URL, {
      method: "POST", // send data to backend
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chance: chance,
        state: state
      })
    });

    if (!response.ok) {
      throw new Error("Failed to change chance");
    }

    // Get updated state from backend
    const updatedState = await response.json();

    console.log("Updated State received:", updatedState);

    return updatedState;

  } catch (error) {
    console.error("Error in changeChance:", error);
    return null;
  }
}
