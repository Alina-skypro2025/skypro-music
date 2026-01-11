"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getTracksByPlaylist } from "@/app/api/tracks";
import { Track } from "@/app/types/track";
import TrackItem from "@/app/components/TrackItem/TrackItem";
import Loader from "@/app/components/Loader/Loader";
import styles from "@/app/components/Centerblock/Centerblock.module.css";

export default function PlaylistPage() {
  const params = useParams();

  const playlistId = useMemo(() => {
    const raw = params?.id;
    const idStr = Array.isArray(raw) ? raw[0] : raw;
    return Number(idStr);
  }, [params]);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isFinite(playlistId) || playlistId <= 0) return;

    async function loadPlaylist() {
      try {
        const data = await getTracksByPlaylist(playlistId);
        setTracks(data);
      } catch {
        setError("Не удалось загрузить подборку");
      } finally {
        setLoading(false);
      }
    }

    loadPlaylist();
  }, [playlistId]);

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.centerblock}>
      <h2 className={styles.centerblock__h2}>Подборка</h2>

      <div className={styles.centerblock__content}>
        <div className={styles.content__playlist}>
          {tracks.map((track) => (
            <TrackItem
              key={track._id}
              track={{
                id: track._id,
                title: track.name,
                author: track.author,
                album: track.album,
                duration: track.duration_in_seconds,
                src: track.track_file,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
