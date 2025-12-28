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
