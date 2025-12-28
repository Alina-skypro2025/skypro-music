"use client";

import styles from "./Centerblock.module.css";
import { useEffect, useState } from "react";
import { getAllTracks } from "@/app/api/tracks";
import { Track } from "@/app/types/track";
import TrackItem from "@/app/components/TrackItem/TrackItem";
import Loader from "@/app/components/Loader/Loader";

type FilterType = "author" | "album" | "genre" | "year" | null;
type SortType = "default" | "old" | "new";

export default function Centerblock() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<SortType>("default");

  useEffect(() => {
    async function loadTracks() {
      try {
        const data = await getAllTracks();
        setTracks(data);
        setFilteredTracks(data);
      } catch {
        setError("Не удалось загрузить треки");
      } finally {
        setLoading(false);
      }
    }

    loadTracks();
  }, []);

  
  const authors = Array.from(new Set(tracks.map(t => t.author)));
  const albums = Array.from(new Set(tracks.map(t => t.album)));
  const genres = Array.from(
    new Set(tracks.flatMap(t => t.genre ?? []))
  );

  
  const toggleFilter = (type: FilterType) => {
    if (activeFilter === type) {
      setActiveFilter(null);
      setSelectedValue(null);
      setFilteredTracks(tracks);
    } else {
      setActiveFilter(type);
      setSelectedValue(null);
    }
  };

 
  const applyFilter = (type: FilterType, value: string) => {
    setSelectedValue(value);

    const result = tracks.filter(track => {
      if (type === "author") return track.author === value;
      if (type === "album") return track.album === value;
      if (type === "genre") return track.genre?.includes(value);
      return true;
    });

    setFilteredTracks(result);
  };

 
  const applySort = (type: SortType) => {
    setActiveSort(type);

    let sorted = [...filteredTracks];

    if (type === "old") {
      sorted.sort(
        (a, b) => (a.release_date ?? 0) - (b.release_date ?? 0)
      );
    }

    if (type === "new") {
      sorted.sort(
        (a, b) => (b.release_date ?? 0) - (a.release_date ?? 0)
      );
    }

    if (type === "default") {
      sorted = [...tracks];
    }

    setFilteredTracks(sorted);
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
        />
      </div>

      <h2 className={styles.centerblock__h2}>Треки</h2>

      
      <div className={styles.centerblock__filter}>
        <span className={styles.filter__title}>Искать по:</span>

        <div className={styles.filter__wrapper}>
          <button
            className={`${styles.filter__button} ${
              activeFilter === "author" ? styles.filter__button_active : ""
            }`}
            onClick={() => toggleFilter("author")}
          >
            исполнителю
          </button>

          {activeFilter === "author" && (
            <div className={styles.filter__dropdown}>
              <div className={styles.filter__list}>
                {authors.map(author => (
                  <div
                    key={author}
                    className={`${styles.filter__item} ${
                      selectedValue === author
                        ? styles.filter__item_active
                        : ""
                    }`}
                    onClick={() => applyFilter("author", author)}
                  >
                    {author}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.filter__wrapper}>
          <button
            className={`${styles.filter__button} ${
              activeFilter === "album" ? styles.filter__button_active : ""
            }`}
            onClick={() => toggleFilter("album")}
          >
            альбому
          </button>

          {activeFilter === "album" && (
            <div className={styles.filter__dropdown}>
              <div className={styles.filter__list}>
                {albums.map(album => (
                  <div
                    key={album}
                    className={`${styles.filter__item} ${
                      selectedValue === album
                        ? styles.filter__item_active
                        : ""
                    }`}
                    onClick={() => applyFilter("album", album)}
                  >
                    {album}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.filter__wrapper}>
          <button
            className={`${styles.filter__button} ${
              activeFilter === "genre" ? styles.filter__button_active : ""
            }`}
            onClick={() => toggleFilter("genre")}
          >
            жанру
          </button>

          {activeFilter === "genre" && (
            <div className={styles.filter__dropdown}>
              <div className={styles.filter__list}>
                {genres.map(genre => (
                  <div
                    key={genre}
                    className={`${styles.filter__item} ${
                      selectedValue === genre
                        ? styles.filter__item_active
                        : ""
                    }`}
                    onClick={() => applyFilter("genre", genre)}
                  >
                    {genre}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.filter__wrapper}>
          <button
            className={`${styles.filter__button} ${
              activeFilter === "year" ? styles.filter__button_active : ""
            }`}
            onClick={() => toggleFilter("year")}
          >
            году выпуска
          </button>

          {activeFilter === "year" && (
            <div className={styles.filter__dropdown}>
              <div className={styles.filter__list}>
                <div
                  className={`${styles.filter__item} ${
                    activeSort === "default"
                      ? styles.filter__item_active
                      : ""
                  }`}
                  onClick={() => applySort("default")}
                >
                  по умолчанию
                </div>
                <div
                  className={`${styles.filter__item} ${
                    activeSort === "old"
                      ? styles.filter__item_active
                      : ""
                  }`}
                  onClick={() => applySort("old")}
                >
                  от старых к новым
                </div>
                <div
                  className={`${styles.filter__item} ${
                    activeSort === "new"
                      ? styles.filter__item_active
                      : ""
                  }`}
                  onClick={() => applySort("new")}
                >
                  от новых к старым
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    
      <div className={styles.centerblock__content}>
        <div className={styles.content__playlist}>
          {filteredTracks.map(track => (
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
