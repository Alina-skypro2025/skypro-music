"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import TrackItem from "@/app/components/TrackItem/TrackItem";
import styles from "@/app/components/Centerblock/Centerblock.module.css";
import { tracks as myTracks } from "@/app/data/tracks";

const playlistMeta: Record<number, { title: string; ids: number[] }> = {
  1: { title: "Плейлист дня", ids: [1, 2] },
  2: { title: "100 танцевальных хитов", ids: [2, 3] },
  3: { title: "Инди заряд", ids: [3] },
};

export default function PlaylistPage() {
  const params = useParams();

  const playlistId = useMemo(() => {
    const raw = params?.id;
    const idStr = Array.isArray(raw) ? raw[0] : raw;
    return Number(idStr);
  }, [params]);

  const meta = playlistMeta[playlistId] ?? { title: "Подборка", ids: [] };

  const list = myTracks.filter((t: any) => meta.ids.includes(t._id));

  return (
    <div className={styles.centerblock}>
      <h2 className={styles.centerblock__h2}>{meta.title}</h2>

      <div className={styles.centerblock__content}>
        <div className={styles.content__playlist}>
          {list.length === 0 ? (
            <div style={{ color: "#b1b1b1", paddingTop: 24 }}>
              В подборке пока нет треков
            </div>
          ) : (
            list.map((t: any) => (
              <TrackItem
                key={t._id}
                track={{
                  id: t._id,
                  title: t.name,
                  author: t.author,
                  album: t.album,
                  duration: t.duration_in_seconds,
                  src: t.track_file,
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
