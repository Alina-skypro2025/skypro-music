"use client";

import styles from "./Centerblock.module.css";
import { useState, useRef, useEffect } from "react";
import { tracks } from "@/app/data/tracks";
import TrackItem from "@/app/components/TrackItem/TrackItem";

export default function Centerblock() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0 });

  const filterRef = useRef<HTMLDivElement | null>(null);

  const authors = [...new Set(tracks.map((t) => t.author))];
  const albums = [...new Set(tracks.map((t) => t.album))];
  const years = [...new Set(tracks.map((t) => t.duration))];

  // вычисляем позицию кнопки
  const toggleFilter = (name: string, event?: any) => {
    if (activeFilter === name) {
      setActiveFilter(null);
      return;
    }

    if (event) {
      const rect = event.target.getBoundingClientRect();
      const parentRect = filterRef.current!.getBoundingClientRect();

      setDropdownPos({
        left: rect.left - parentRect.left,
      });
    }

    setActiveFilter(name);
  };

  return (
    <div className={styles.centerblock}>
      <div className={styles.centerblock__search}>
        <svg className={styles.search__svg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
        </svg>
        <input
          className={styles.search__text}
          type="search"
          placeholder="Поиск"
        />
      </div>

      <h2 className={styles.centerblock__h2}>Треки</h2>

      {/* Фильтры */}
      <div className={styles.filter__wrapper} ref={filterRef}>
        <div className={styles.centerblock__filter}>
          <span className={styles.filter__title}>Искать по:</span>

          <button
            className={`${styles.filter__button} ${
              activeFilter === "author" ? styles.active : ""
            }`}
            onClick={(e) => toggleFilter("author", e)}
          >
            Исполнителю
          </button>

          <button
            className={`${styles.filter__button} ${
              activeFilter === "year" ? styles.active : ""
            }`}
            onClick={(e) => toggleFilter("year", e)}
          >
            Году
          </button>

          <button
            className={`${styles.filter__button} ${
              activeFilter === "genre" ? styles.active : ""
            }`}
            onClick={(e) => toggleFilter("genre", e)}
          >
            Жанру
          </button>
        </div>

        {/* Dropdown */}
        {activeFilter && (
          <div
            className={styles.filter__list}
            style={{ left: dropdownPos.left }}
          >
            {activeFilter === "author" &&
              authors.map((name) => (
                <span key={name} className={styles.filter__item}>
                  {name}
                </span>
              ))}

            {activeFilter === "year" &&
              years.map((year) => (
                <span key={year} className={styles.filter__item}>
                  {year}
                </span>
              ))}

            {activeFilter === "genre" &&
              albums.map((album) => (
                <span key={album} className={styles.filter__item}>
                  {album}
                </span>
              ))}
          </div>
        )}
      </div>

      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={`${styles.playlistTitle__col} ${styles.col01}`}>
            Трек
          </div>
          <div className={`${styles.playlistTitle__col} ${styles.col02}`}>
            Исполнитель
          </div>
          <div className={`${styles.playlistTitle__col} ${styles.col03}`}>
            Альбом
          </div>
          <div className={`${styles.playlistTitle__col} ${styles.col04}`}></div>
        </div>

        <div className={styles.content__playlist}>
          {tracks.map((track) => (
            <TrackItem key={track.id} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
}
