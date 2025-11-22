const API_BASE_URL = import.meta.env.BACKEND_URL;
const API_URL = `${API_BASE_URL}/change-filter`;

export async function changeFilter(filter_options, state) {
  try {
    const response = await fetch(API_URL, {
      method: "POST", // pull request to backend
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filter_options: filter_options,
        state: state
      })
    });

    if (!response.ok) {
      throw new Error("Failed to update filters");
    }

    // Get updated filter properties from backend
    const updatedFilters = await response.json();

    console.log("Updated Filters received:", updatedFilters);

    // Show filters in UI
    renderFilters(updatedFilters);

    return updatedFilters;

  } catch (error) {
    console.error("Error in changeFilter:", error);
    return null;
  }
}

// Function to display filters on the page
function renderFilters(filters) {
  const container = document.getElementById("filters-container");

  if (!container) return;

  container.innerHTML = "";

  const filterHTML = `
    <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
      <p><strong>Type:</strong> ${filters.type}</p>
      <p><strong>Sort Type:</strong> ${filters.sort_type}</p>
      <p><strong>Size:</strong> ${filters.size}</p>
      <p><strong>City:</strong> ${filters.city}</p>
    </div>
  `;

  container.innerHTML = filterHTML;
}
