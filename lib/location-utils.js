import { State, City } from "country-state-city";

// /**
//  * Parse and validate location slug (format: city-state)
//  * @param {string} slug - The URL slug (e.g., "gurugram-haryana")
//  * @returns {Object} - { city, state, isValid }
//  */
export function parseLocationSlug(slug) {
  if (!slug || typeof slug !== "string") {
    return { city: null, state: null, isValid: false };
  }

  const parts = slug.split("-");
  if (parts.length < 2) {
    return { city: null, state: null, isValid: false };
  }

  const cityRaw = parts[0];
  const stateRaw = parts.slice(1).join(" ");

  const city = cityRaw.replace(/-/g, " ");
  const stateName = stateRaw.replace(/-/g, " ");

  // Normalize casing
  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  const stateFormatted =
    stateName.charAt(0).toUpperCase() + stateName.slice(1).toLowerCase();

  // Validate ONLY state name (not city)
  const allStates = State.getStatesOfCountry("IN");
  const stateObj = allStates.find(
    (s) => s.name.toLowerCase() === stateFormatted.toLowerCase()
  );

  if (!stateObj) {
    return { city: null, state: null, isValid: false };
  }

  return {
    city: cityName,
    state: stateFormatted,
    isValid: true,
  };
}


/**
 * Create location slug from city and state
 * @param {string} city - City name
 * @param {string} state - State name
 * @returns {string} - URL slug (e.g., "gurugram-haryana")
 */
export function createLocationSlug(city, state) {
  if (!city || !state) return "";

  const citySlug = city.toLowerCase().replace(/\s+/g, "-");
  const stateSlug = state.toLowerCase().replace(/\s+/g, "-");

  return `${citySlug}-${stateSlug}`;
}