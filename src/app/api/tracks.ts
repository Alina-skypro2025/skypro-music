import { Track } from "@/app/types/track";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export async function getAllTracks(): Promise<Track[]> {
  const res = await fetch(`${API_URL}/catalog/track/all/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Ошибка загрузки треков");
  }

  const json = await res.json();
  return json.data;
}

export async function getTracksByPlaylist(playlistId: number): Promise<Track[]> {
  const res = await fetch(`${API_URL}/catalog/selection/${playlistId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Ошибка загрузки подборки");
  }

  const json = await res.json();

  const data = json?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.tracks)) return data.tracks;

  return [];
}
