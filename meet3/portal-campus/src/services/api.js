// Centralised API configuration.
// All fetch calls go through here so the base URL lives in one place.
// When we connect to a real backend later (Meet 8), we only change this file.
export const API_BASE = 'https://6a000e842b7ab34960300690.mockapi.io/softdev'
const QUOTE_API = 'https://api.quotable.kurokeita.dev/api/quotes/random'

export async function fetchCourses() {
  const response = await fetch(`${API_BASE}/course`)
  if (!response.ok) throw new Error(`Server error: ${response.status}`)
  return response.json()
}

export async function createCourse(payload) {
  const response = await fetch(`${API_BASE}/course`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Server error: ${response.status}`)
  return response.json()
}

export async function fetchRandomQuote() {
  const response = await fetch(QUOTE_API)
  if (!response.ok) throw new Error(`Server error: ${response.status}`)

  const result = await response.json()
  if (!result.quote || !result.quote.content) throw new Error('Invalid response')

  return {
    text: result.quote.content,
    author: result.quote.author?.name || 'Anonim',
  }
}
