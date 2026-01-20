"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import PageLayout from "@/app/components/PageLayout/PageLayout";
import TrackItem from "@/app/components/TrackItem/TrackItem";
import Loader from "@/app/components/Loader/Loader";

import { getAllTracks } from "@/app/api/tracks";
import { setPlaylist } from "@/app/store/playerSlice";
import type { Track } from "@/app/types/track";
import type { RootState, AppDispatch } from "@/app/store/store";

type UiTrack = {
  id: number;
  title: string;
  author: string;
  album: string;
  duration: number;
  src: string;
};

function stableStringHashToNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function toNumberId(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;

  const n = Number(raw);
  if (Number.isFinite(n)) return n;

  if (typeof raw === "string" && raw) return stableStringHashToNumber(raw);
  return 0;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function pickString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function pickNumber(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function mapApiTrackToUi(t: Track): UiTrack {
  const obj: Record<string, unknown> = isRecord(t) ? (t as Record<string, unknown>) : {};

  const rawId = obj.id ?? obj._id;
  return {
    id: toNumberId(rawId),
    title: pickString(obj.title ?? obj.name),
    author: pickString(obj.author),
    album: pickString(obj.album),
    duration: pickNumber(obj.duration ?? obj.duration_in_seconds),
    src: pickString(obj.src ?? obj.track_file),
  };
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error && typeof e.message === "string" && e.message) return e.message;
  if (isRecord(e) && typeof e.message === "string") return e.message;
  return "Ошибка запроса к серверу";
}

export default function FavoritesPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const likedMap = useSelector((state: RootState) => state.favorites?.ids || {});

  const [allTracks, setAllTracks] = useState<UiTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("skypro_access");
    if (!token) router.replace("/login");
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setLoading(true);
        setErrorText("");

        const data = await getAllTracks();
        const ui = (data ?? [])
          .map(mapApiTrackToUi)
          .filter((t) => t.id && t.src);

        if (!cancelled) setAllTracks(ui);
      } catch (e: unknown) {
        if (!cancelled) setErrorText(getErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleTracks = useMemo(() => {
    const ids = likedMap || {};
    return allTracks.filter((t) => ids[String(t.id)]);
  }, [allTracks, likedMap]);

  useEffect(() => {
    
    dispatch(setPlaylist(visibleTracks as unknown as Track[]));
  }, [dispatch, visibleTracks]);

  return (
    <PageLayout>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ width: "100%" }}>
          <h2 style={{ fontSize: 64, lineHeight: "72px", color: "#fff", marginBottom: 30 }}>
            Мой плейлист
          </h2>

          {errorText ? <div style={{ color: "#ff4d4f", marginBottom: 16 }}>{errorText}</div> : null}

          {visibleTracks.length === 0 ? (
            <div style={{ color: "#b1b1b1", paddingTop: 24 }}>В моем плейлисте пока нет треков</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {visibleTracks.map((t) => (
                <TrackItem
                  key={t.id}
                  track={{
                    id: t.id,
                    title: t.title,
                    author: t.author,
                    album: t.album,
                    duration: t.duration,
                    src: t.src,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
