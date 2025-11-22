const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_URL = `${API_BASE_URL}/houses`;

export async function getHouses(gameState) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        game_state: gameState
      })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch houses");
    }

    const houses = await response.json();

    console.log("Houses received:", houses);

    renderHouses(houses);

    return houses;

  } catch (error) {
    console.error("Error in getHouses:", error);
    return [];
  }
}

// UI render function
function renderHouses(houses) {
  const container = document.getElementById("houses-container");

  if (!container) return;

  container.innerHTML = "";

  houses.forEach((house) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <div style="border:1px solid #ddd; padding:10px; margin:10px;">
        <img src="${house.image_url}" style="width:100%; max-width:300px;" />
        <h3>${house.title}</h3>
        <p><strong>Price:</strong> $${house.buying_price}</p>
        <p><strong>Rooms:</strong> ${house.rooms}</p>
        <p><strong>Size:</strong> ${house.squaremeter} m²</p>
      </div>
    `;

    container.appendChild(div);
  });
}
