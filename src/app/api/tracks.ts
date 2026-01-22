import { Track } from "@/app/types/track";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export async function getAllTracks(): Promise<Track[]> {
  const res = await fetch(`${API_URL}/catalog/track/all/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Ошибка загрузки треков");
  }

  const json: unknown = await res.json();

  if (
    typeof json === "object" &&
    json !== null &&
    "data" in json &&
    Array.isArray((json as { data?: unknown }).data)
  ) {
    return (json as { data: Track[] }).data;
  }

  return [];
}

function extractTracks(json: unknown): Track[] {
  if (typeof json !== "object" || json === null) return [];

  const obj = json as Record<string, unknown>;

  const tryArray = (v: unknown): Track[] | null =>
    Array.isArray(v) ? (v as Track[]) : null;

  
  let result = tryArray(obj.data);
  if (result) return result;

  
  if (typeof obj.data === "object" && obj.data !== null) {
    const dataObj = obj.data as Record<string, unknown>;

    result = tryArray(dataObj.items);
    if (result) return result;

    result = tryArray(dataObj.tracks);
    if (result) return result;

    result = tryArray(dataObj.data);
    if (result) return result;
  }

  
  result = tryArray(obj.items);
  if (result) return result;

  result = tryArray(obj.tracks);
  if (result) return result;

  result = tryArray(obj.results);
  if (result) return result;

  return [];
}

export async function getTracksByPlaylist(
  playlistId: number
): Promise<Track[]> {
  const res = await fetch(`${API_URL}/catalog/selection/${playlistId}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Ошибка загрузки подборки");
  }

  const json: unknown = await res.json();
  return extractTracks(json);
}
