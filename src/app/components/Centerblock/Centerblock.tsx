"use client";

import styles from "./Centerblock.module.css";
import { useEffect, useMemo, useState } from "react";
import TrackItem from "@/app/components/TrackItem/TrackItem";
import Loader from "@/app/components/Loader/Loader";

import { tracks as myTracks } from "@/app/data/tracks";

type FilterType = "author" | "album" | null;
type SortType = "default" | "old" | "new";


type MyTrack = {
  id: number;
  title: string;    
  author: string;   
  album: string;
  duration: string; 
  src: string;
};

function convertToSeconds(time: string) {
  const [m, s] = time.split(":").map((v) => Number(v));
  if (Number.isNaN(m) || Number.isNaN(s)) return 0;
  return m * 60 + s;
}


function sortByIdOld(a: MyTrack, b: MyTrack) {
  return a.id - b.id;
}
function sortByIdNew(a: MyTrack, b: MyTrack) {
  return b.id - a.id;
}

export default function Centerblock() {
  const [tracks, setTracks] = useState<MyTrack[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<MyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<SortType>("default");

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      setTracks(myTracks as MyTrack[]);
      setFilteredTracks(myTracks as MyTrack[]);
    } catch {
      setError("Не удалось загрузить треки");
    } finally {
      setLoading(false);
    }
  }, []);

  
  const authors = useMemo(
    () => Array.from(new Set(tracks.map((t) => t.title))), 
    [tracks]
  );
  const albums = useMemo(
    () => Array.from(new Set(tracks.map((t) => t.album))),
    [tracks]
  );

  const applyAll = (
    baseTracks: MyTrack[],
    filter: FilterType,
    value: string | null,
    sort: SortType,
    query: string
  ) => {
    let result = [...baseTracks];

    
    if (filter && value) {
      result = result.filter((track) => {
        if (filter === "author") return track.title === value; 
        if (filter === "album") return track.album === value;
        return true;
      });
    }

    
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((t) => {
        const trackName = (t.author ?? "").toLowerCase(); 
        const performer = (t.title ?? "").toLowerCase();  
        const album = (t.album ?? "").toLowerCase();
        return trackName.includes(q) || performer.includes(q) || album.includes(q);
      });
    }

    
    if (sort === "old") result.sort(sortByIdOld);
    if (sort === "new") result.sort(sortByIdNew);

    setFilteredTracks(result);
  };

  const toggleFilter = (type: FilterType) => {
    if (activeFilter === type) {
      setActiveFilter(null);
      setSelectedValue(null);
      setActiveSort("default");
      applyAll(tracks, null, null, "default", searchQuery);
    } else {
      setActiveFilter(type);
      setSelectedValue(null);
      applyAll(tracks, type, null, activeSort, searchQuery);
    }
  };

  const applyFilter = (type: FilterType, value: string) => {
    setSelectedValue(value);
    applyAll(tracks, type, value, activeSort, searchQuery);
  };

  const applySort = (type: SortType) => {
    setActiveSort(type);
    applyAll(tracks, activeFilter, selectedValue, type, searchQuery);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    applyAll(tracks, activeFilter, selectedValue, activeSort, val);
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
          onChange={(e) => handleSearchChange(e.target.value)}
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
                {authors.map((author) => (
                  <div
                    key={author}
                    className={`${styles.filter__item} ${
                      selectedValue === author ? styles.filter__item_active : ""
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
                {albums.map((album) => (
                  <div
                    key={album}
                    className={`${styles.filter__item} ${
                      selectedValue === album ? styles.filter__item_active : ""
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
              activeFilter === "year" ? styles.filter__button_active : ""
            }`}
            onClick={() => toggleFilter(null)}
          >
            жанру
          </button>
        </div>

        <div className={styles.filter__wrapper}>
          <button
            className={`${styles.filter__button} ${
              activeFilter === "year" ? styles.filter__button_active : ""
            }`}
            onClick={() => toggleFilter(null)}
          >
            году выпуска
          </button>

          
          <div className={styles.filter__dropdown} style={{ display: "none" }} />
        </div>

        
      </div>

      <div className={styles.centerblock__content}>
        <div className={styles.content__playlist}>
          {filteredTracks.map((track) => (
            <TrackItem
              key={track.id}
              track={{
                id: track.id,
                title: track.author, 
                author: track.title, 
                album: track.album,
                duration: convertToSeconds(track.duration),
                src: track.src,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
