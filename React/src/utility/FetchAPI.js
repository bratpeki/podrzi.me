const BASE_URL = "http://localhost:8080/api";
// Endpoint example: users/userauth (automatically add / between api i users)
// Parsemethod is set to GET if left empty
export async function apiRequest(endpoint, parseMethod = "GET", token = null, body = null) {
  const config = {
    method : parseMethod,
    headers: {},
  };

  // Only add JSON headers if the body is NOT FormData
  const isFormData = body instanceof FormData;

  if (!isFormData) {
    config.headers["Content-Type"] = "application/json";
  }

  if (token) {
    config.headers["token"] = token;
  }

  if (body && parseMethod !== "GET") {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`, config);

    const contentType = res.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      throw new Error(data.message || "Fetch error");
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}
