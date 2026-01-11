import { Track } from "@/app/types/track";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export async function getAllTracks(): Promise<Track[]> {
  const res = await fetch(`${API_URL}/catalog/track/all/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Ошибка загрузки треков");

  const json = await res.json();
  return json.data;
}

function extractTracks(json: any): Track[] {
  
  if (Array.isArray(json?.data)) return json.data;

  
  if (Array.isArray(json?.data?.items)) return json.data.items;
  if (Array.isArray(json?.data?.tracks)) return json.data.tracks;
  if (Array.isArray(json?.data?.data)) return json.data.data;

  
  if (Array.isArray(json?.items)) return json.items;
  if (Array.isArray(json?.tracks)) return json.tracks;
  if (Array.isArray(json?.results)) return json.results;

  return [];
}

export async function getTracksByPlaylist(playlistId: number): Promise<Track[]> {
  const res = await fetch(`${API_URL}/catalog/selection/${playlistId}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Ошибка загрузки подборки");
  }

  const json = await res.json();
  return extractTracks(json);
}
