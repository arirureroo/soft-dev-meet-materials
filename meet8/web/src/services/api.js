// Central API service: the single place that knows the backend's base URL.
// All fetch() calls in our Pinia stores go through this helper,
// so if the URL ever changes, we only update it here (and in .env.local).
//
// import.meta.env.VITE_API_URL reads the value from .env.local at build time.
// Vite only exposes variables prefixed with VITE_ to the browser for security.
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * A thin wrapper around fetch() that:
 * 1. Prepends the BASE_URL so callers only specify the path (e.g., '/students').
 * 2. Automatically sets Content-Type: application/json on requests with a body.
 * 3. Throws a descriptive error if the HTTP status is not OK (4xx / 5xx).
 *
 * @param {string} path - The API path, e.g. '/students' or '/students/1'
 * @param {RequestInit} [options] - Standard fetch options (method, body, etc.)
 * @returns {Promise<any>} - The parsed JSON response body
 */
export async function apiFetch(path, options = {}) {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${path}`, config);

  // Even on error responses (4xx, 5xx), fetch() does NOT throw by default.
  // We parse the JSON body to extract the error message, then throw manually.
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || errorBody.errors?.join(', ') || `HTTP ${response.status}`;
    throw new Error(message);
  }

  // Return the parsed JSON body on success.
  return response.json();
}
