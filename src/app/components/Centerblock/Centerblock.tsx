"use client";

import styles from "./Centerblock.module.css";
import { useEffect, useMemo, useState } from "react";
import TrackItem from "@/app/components/TrackItem/TrackItem";
import Loader from "@/app/components/Loader/Loader";
import { tracks as myTracksRaw } from "@/app/data/tracks";

type DropdownType = "author" | "album" | "genre" | "year" | null;
type SortType = "default" | "old" | "new";

type LocalTrack = {
  _id: number;
  name: string;
  author: string;
  album: string;
  duration_in_seconds: number;
  track_file: string;
  genre?: string[];
  release_date?: number;
};

type Props = {
  playlistId?: number;
};


const playlistMeta: Record<number, { title: string; ids: number[] }> = {
  1: { title: "Плейлист дня", ids: [1] },
  2: { title: "100 танцевальных хитов", ids: [2] },
  3: { title: "Инди заряд", ids: [3] },
};


function normalizeTracks(raw: any[]): LocalTrack[] {
  return (raw ?? [])
    .map((t: any) => {
      const id = Number(t._id ?? t.id);
      return {
        _id: Number.isFinite(id) ? id : Math.random(),
        name: String(t.name ?? t.title ?? ""),
        author: String(t.author ?? ""),
        album: String(t.album ?? ""),
        duration_in_seconds: Number(t.duration_in_seconds ?? t.duration ?? 0),
        track_file: String(t.track_file ?? t.src ?? ""),
        genre: Array.isArray(t.genre) ? t.genre : undefined,
        release_date: typeof t.release_date === "number" ? t.release_date : undefined,
      };
    })
    .filter((t) => t.name && t.author && t.track_file);
}

export default function Centerblock({ playlistId }: Props) {
  const [allTracks, setAllTracks] = useState<LocalTrack[]>([]);
  const [tracks, setTracks] = useState<LocalTrack[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<LocalTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);

  
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  
  const [activeSort, setActiveSort] = useState<SortType>("default");

  
  const [searchQuery, setSearchQuery] = useState("");

 
  useEffect(() => {
    try {
      const normalized = normalizeTracks(myTracksRaw as any[]);
      setAllTracks(normalized);
    } catch {
      setError("Не удалось загрузить треки");
    } finally {
      setLoading(false);
    }
  }, []);

  
  const pageTitle = useMemo(() => {
    if (!playlistId) return "Треки";
    return playlistMeta[playlistId]?.title ?? "Подборка";
  }, [playlistId]);

  useEffect(() => {
    if (loading) return;

    
    let base = allTracks;

    if (playlistId) {
      const ids = playlistMeta[playlistId]?.ids ?? [];
      base = allTracks.filter((t) => ids.includes(t._id));
    }

    setTracks(base);
    setFilteredTracks(base);

    
    setOpenDropdown(null);
    setSelectedAuthor(null);
    setSelectedAlbum(null);
    setSelectedGenre(null);
    setActiveSort("default");
    setSearchQuery("");
  }, [playlistId, allTracks, loading]);

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
    base: LocalTrack[],
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
        const name = (t.name ?? "").toLowerCase();
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
    setOpenDropdown(null);
  };

  const onSelectAlbum = (val: string) => {
    setSelectedAlbum(val);
    applyAll(tracks, selectedAuthor, val, selectedGenre, activeSort, searchQuery);
    setOpenDropdown(null);
  };

  const onSelectGenre = (val: string) => {
    setSelectedGenre(val);
    applyAll(tracks, selectedAuthor, selectedAlbum, val, activeSort, searchQuery);
    setOpenDropdown(null);
  };

  const onSelectSort = (val: SortType) => {
    setActiveSort(val);
    applyAll(tracks, selectedAuthor, selectedAlbum, selectedGenre, val, searchQuery);
    setOpenDropdown(null);
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
          {filteredTracks.map((t) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
