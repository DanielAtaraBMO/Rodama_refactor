const API_URL = "http://localhost:8080/api";

//Obtener token (puedes cambiar luego a tu storage central)
function getToken() {
  try {
    return JSON.parse(localStorage.getItem("token"));
  } catch {
    return null;
  }
}

//Función base para todas las peticiones
export async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  // Si hay body y no está en string → convertir
  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Manejo de errores HTTP
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error ${response.status}`);
    }

    // Si no hay contenido (ej: DELETE)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("API ERROR:", error.message);
    throw error;
  }
}