const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";
import { withReAuth } from "./withReAuth";

export async function addToFavorite(trackId: number | string) {
  const id = String(trackId);

  try {
    return await withReAuth<unknown>(`${API_URL}/catalog/track/${id}/favorite/`, {
      method: "POST",
    });
  } catch {
    try {
      return await withReAuth<unknown>(`${API_URL}/catalog/track/${id}/like/`, {
        method: "POST",
      });
    } catch (e2: unknown) {
      throw e2;
    }
  }
}

export async function removeFromFavorite(trackId: number | string) {
  const id = String(trackId);

  try {
    return await withReAuth<unknown>(`${API_URL}/catalog/track/${id}/favorite/`, {
      method: "DELETE",
    });
  } catch {
    try {
      return await withReAuth<unknown>(`${API_URL}/catalog/track/${id}/like/`, {
        method: "DELETE",
      });
    } catch (e2: unknown) {
      throw e2;
    }
  }
}
