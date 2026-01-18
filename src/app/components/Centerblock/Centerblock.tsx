"use client";

import styles from "./Centerblock.module.css";
import { useEffect, useMemo, useState } from "react";
import TrackItem from "@/app/components/TrackItem/TrackItem";
import Loader from "@/app/components/Loader/Loader";
import { getAllTracks, getTracksByPlaylist } from "@/app/api/tracks";
import { Track } from "@/app/types/track";
import { useDispatch } from "react-redux";
import { setPlaylist } from "@/app/store/playerSlice";

type DropdownType = "author" | "album" | "genre" | "year" | null;
type SortType = "default" | "old" | "new";

type UiTrack = {
  id: number;
  title: string;
  author: string;
  album: string;
  duration: number;
  src: string;
  genre?: string[];
  release_date?: number;
};

const playlistTitles: Record<number, string> = {
  1: "Плейлист дня",
  2: "100 танцевальных хитов",
  3: "Инди заряд",
};

const PLAYLIST_MIN = 5;
const PLAYLIST_MAX = 8;

function stableStringHashToNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function toNumberId(raw: any): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  const n = Number(raw);
  if (Number.isFinite(n)) return n;
  if (typeof raw === "string" && raw) return stableStringHashToNumber(raw);
  return 0;
}

function mapApiTrackToUi(t: Track): UiTrack {
  const rawId: any = (t as any).id ?? (t as any)._id;

  return {
    id: toNumberId(rawId),
    title: (t as any).title ?? (t as any).name ?? "",
    author: (t as any).author ?? "",
    album: (t as any).album ?? "",
    duration: (t as any).duration ?? (t as any).duration_in_seconds ?? 0,
    src: (t as any).src ?? (t as any).track_file ?? "",
    genre: (t as any).genre ?? [],
    release_date: (t as any).release_date,
  };
}


function buildFallbackPlaylist(all: UiTrack[], playlistId: number) {
  const list = all.filter((t) => t.id && t.src);

  
  if (list.length < PLAYLIST_MAX * 3) {
    const byMod = list.filter((t) => (t.id % 3) === ((playlistId - 1) % 3));
    const base = byMod.length >= PLAYLIST_MIN ? byMod : list;
    return base.slice(0, Math.min(PLAYLIST_MAX, base.length));
  }

  
  const chunkSize = PLAYLIST_MAX;
  const start = (playlistId - 1) * chunkSize;
  const chunk = list.slice(start, start + chunkSize);

  if (chunk.length === 0) return list.slice(0, chunkSize);
  return chunk;
}

export default function Centerblock({ playlistId }: { playlistId?: number }) {
  const dispatch = useDispatch();

  const [tracks, setTracks] = useState<UiTrack[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<UiTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);

  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const [activeSort, setActiveSort] = useState<SortType>("default");
  const [searchQuery, setSearchQuery] = useState("");

  const pageTitle = useMemo(() => {
    if (!playlistId) return "Треки";
    return playlistTitles[playlistId] ?? "Подборка";
  }, [playlistId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        
        if (playlistId) {
          
          const data = (await getTracksByPlaylist(playlistId)) ?? [];
          const uiFromPlaylist = (data ?? [])
            .map(mapApiTrackToUi)
            .filter((t) => t.id && t.src);

          
          if (uiFromPlaylist.length > 0) {
            if (!cancelled) {
              setTracks(uiFromPlaylist);
              setFilteredTracks(uiFromPlaylist);
              dispatch(setPlaylist(uiFromPlaylist));
            }
            return;
          }

          
          const all = (await getAllTracks()) ?? [];
          const allUi = (all ?? [])
            .map(mapApiTrackToUi)
            .filter((t) => t.id && t.src);

          const fallback = buildFallbackPlaylist(allUi, playlistId);

          if (!cancelled) {
            setTracks(fallback);
            setFilteredTracks(fallback);
            dispatch(setPlaylist(fallback));
          }
          return;
        }

        
        const all = (await getAllTracks()) ?? [];
        const ui = (all ?? [])
          .map(mapApiTrackToUi)
          .filter((t) => t.id && t.src);

        if (!cancelled) {
          setTracks(ui);
          setFilteredTracks(ui);
          dispatch(setPlaylist(ui));
        }
      } catch {
        if (!cancelled) setError("Не удалось загрузить треки");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [playlistId, dispatch]);

  const authors = useMemo(
    () => Array.from(new Set(tracks.map((t) => t.author))).filter(Boolean),
    [tracks]
  );

  const albums = useMemo(
    () => Array.from(new Set(tracks.map((t) => t.album))).filter(Boolean),
    [tracks]
  );

  const genres = useMemo(() => {
    const all = tracks.flatMap((t) => t.genre ?? []);
    return Array.from(new Set(all)).filter(Boolean);
  }, [tracks]);

  const applyAll = (
    base: UiTrack[],
    author: string | null,
    album: string | null,
    genre: string | null,
    sort: SortType,
    query: string
  ) => {
    let result = [...base];

    if (author) result = result.filter((t) => t.author === author);
    if (album) result = result.filter((t) => t.album === album);
    if (genre) result = result.filter((t) => (t.genre ?? []).includes(genre));

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((t) => {
        const name = (t.title ?? "").toLowerCase();
        const a = (t.author ?? "").toLowerCase();
        const al = (t.album ?? "").toLowerCase();
        return name.includes(q) || a.includes(q) || al.includes(q);
      });
    }

    if (sort === "old") {
      result.sort((a, b) => (a.release_date ?? 0) - (b.release_date ?? 0));
    }
    if (sort === "new") {
      result.sort((a, b) => (b.release_date ?? 0) - (a.release_date ?? 0));
    }

    setFilteredTracks(result);
  };

  const toggleDropdown = (type: DropdownType) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  const resetAllFilters = () => {
    setSelectedAuthor(null);
    setSelectedAlbum(null);
    setSelectedGenre(null);
    setActiveSort("default");
    setSearchQuery("");
    setOpenDropdown(null);
    setFilteredTracks(tracks);
  };

  const onSelectAuthor = (val: string) => {
    setSelectedAuthor(val);
    applyAll(tracks, val, selectedAlbum, selectedGenre, activeSort, searchQuery);
  };

  const onSelectAlbum = (val: string) => {
    setSelectedAlbum(val);
    applyAll(tracks, selectedAuthor, val, selectedGenre, activeSort, searchQuery);
  };

  const onSelectGenre = (val: string) => {
    setSelectedGenre(val);
    applyAll(tracks, selectedAuthor, selectedAlbum, val, activeSort, searchQuery);
  };

  const onSelectSort = (val: SortType) => {
    setActiveSort(val);
    applyAll(tracks, selectedAuthor, selectedAlbum, selectedGenre, val, searchQuery);
  };

  const onSearch = (val: string) => {
    setSearchQuery(val);
    applyAll(tracks, selectedAuthor, selectedAlbum, selectedGenre, activeSort, val);
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.centerblock}>
      <div className={styles.centerblock__search}>
        <input
          className={styles.search__text}
          type="search"
          placeholder="Поиск"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <h2 className={styles.centerblock__h2}>{pageTitle}</h2>

      <div className={styles.centerblock__filter}>
        <span className={styles.filter__title}>Искать по:</span>

        <div className={styles.filter__wrapper}>
          <button
            className={`${styles.filter__button} ${
              openDropdown === "author" ? styles.filter__button_active : ""
            }`}
            onClick={() => toggleDropdown("author")}
          >
            исполнителю
          </button>

          {openDropdown === "author" && (
            <div className={styles.filter__dropdown}>
              <div className={styles.filter__list}>
                {authors.map((a) => (
                  <div
                    key={a}
                    className={`${styles.filter__item} ${
                      selectedAuthor === a ? styles.filter__item_active : ""
                    }`}
                    onClick={() => onSelectAuthor(a)}
                  >
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.filter__wrapper}>
          <button
            className={`${styles.filter__button} ${
              openDropdown === "album" ? styles.filter__button_active : ""
            }`}
            onClick={() => toggleDropdown("album")}
          >
            альбому
          </button>

          {openDropdown === "album" && (
            <div className={styles.filter__dropdown}>
              <div className={styles.filter__list}>
                {albums.map((a) => (
                  <div
                    key={a}
                    className={`${styles.filter__item} ${
                      selectedAlbum === a ? styles.filter__item_active : ""
                    }`}
                    onClick={() => onSelectAlbum(a)}
                  >
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.filter__wrapper}>
          <button
            className={`${styles.filter__button} ${
              openDropdown === "genre" ? styles.filter__button_active : ""
            }`}
            onClick={() => toggleDropdown("genre")}
          >
            жанру
          </button>

          {openDropdown === "genre" && (
            <div className={styles.filter__dropdown}>
              <div className={styles.filter__list}>
                {genres.length === 0 ? (
                  <div className={styles.filter__item}>Нет жанров</div>
                ) : (
                  genres.map((g) => (
                    <div
                      key={g}
                      className={`${styles.filter__item} ${
                        selectedGenre === g ? styles.filter__item_active : ""
                      }`}
                      onClick={() => onSelectGenre(g)}
                    >
                      {g}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.filter__wrapper}>
          <button
            className={`${styles.filter__button} ${
              openDropdown === "year" ? styles.filter__button_active : ""
            }`}
            onClick={() => toggleDropdown("year")}
          >
            году выпуска
          </button>

          {openDropdown === "year" && (
            <div className={styles.filter__dropdown}>
              <div className={styles.filter__list}>
                <div
                  className={`${styles.filter__item} ${
                    activeSort === "default" ? styles.filter__item_active : ""
                  }`}
                  onClick={() => onSelectSort("default")}
                >
                  по умолчанию
                </div>
                <div
                  className={`${styles.filter__item} ${
                    activeSort === "old" ? styles.filter__item_active : ""
                  }`}
                  onClick={() => onSelectSort("old")}
                >
                  от старых к новым
                </div>
                <div
                  className={`${styles.filter__item} ${
                    activeSort === "new" ? styles.filter__item_active : ""
                  }`}
                  onClick={() => onSelectSort("new")}
                >
                  от новых к старым
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          className={styles.filter__button}
          onClick={resetAllFilters}
          style={{ marginLeft: 12 }}
        >
          сбросить
        </button>
      </div>

      <div className={styles.centerblock__content}>
        <div className={styles.content__playlist}>
          {filteredTracks.length === 0 ? (
            <div style={{ color: "#b1b1b1", paddingTop: 24 }}>
              В подборке пока нет треков
            </div>
          ) : (
            filteredTracks.map((t) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
