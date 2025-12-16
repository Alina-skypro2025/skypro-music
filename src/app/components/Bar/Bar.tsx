"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Bar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { togglePlay, setVolume } from "@/app/store/playerSlice";

export default function Bar() {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, volume } = useSelector(
    (state: any) => state.player
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Обновляем громкость
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  // При смене трека — меняем src и запускаем при isPlaying = true
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.src = currentTrack.src;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [currentTrack, isPlaying]);

  const handleTogglePlay = () => {
    if (!currentTrack) return;
    dispatch(togglePlay());
  };

  const handlePrevClick = () => {
    alert("Еще не реализовано");
  };

  const handleNextClick = () => {
    alert("Еще не реализовано");
  };

  const handleShuffleClick = () => {
    alert("Еще не реализовано");
  };

  const handleVolumeChange = (e: any) => {
    dispatch(setVolume(Number(e.target.value)));
  };

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.bar__content}>
          <div className={styles.bar__playerProgress}></div>

          <div className={styles.bar__playerBlock}>
            <div className={styles.bar__player}>
              <div className={styles.player__controls}>
                <div
                  onClick={handlePrevClick}
                  className={styles.player__btnPrev}
                >
                  <Image
                    src="/img/icon/prev.svg"
                    width={15}
                    height={14}
                    alt="prev"
                    className={styles.player__btnPrevSvg}
                  />
                </div>

                <div
                  onClick={handleTogglePlay}
                  className={styles.player__btnPlay}
                >
                  {isPlaying ? (
                    <Image
                      src="/img/icon/pause.svg"
                      width={22}
                      height={20}
                      alt="pause"
                    />
                  ) : (
                    <Image
                      src="/img/icon/play.svg"
                      width={22}
                      height={20}
                      alt="play"
                    />
                  )}
                </div>

                <div
                  onClick={handleNextClick}
                  className={styles.player__btnNext}
                >
                  <Image
                    src="/img/icon/next.svg"
                    width={15}
                    height={14}
                    alt="next"
                    className={styles.player__btnNextSvg}
                  />
                </div>

                <div
                  onClick={handleShuffleClick}
                  className={styles.player__btnRepeat}
                >
                  <Image
                    src="/img/icon/repeat.svg"
                    width={18}
                    height={12}
                    alt="repeat"
                    className={styles.player__btnRepeatSvg}
                  />
                </div>

                <div
                  onClick={handleShuffleClick}
                  className={styles.player__btnShuffle}
                >
                  <Image
                    src="/img/icon/shuffle.svg"
                    width={19}
                    height={12}
                    alt="shuffle"
                    className={styles.player__btnShuffleSvg}
                  />
                </div>
              </div>

              <div className={styles.player__trackPlay}>
                <div className={styles.trackPlay__contain}>
                  <div className={styles.trackPlay__image}>
                    <Image
                      src="/img/icon/note.svg"
                      width={18}
                      height={17}
                      alt="note"
                      className={styles.trackPlay__svg}
                    />
                  </div>

                  <div className={styles.trackPlay__author}>
                    <span className={styles.trackPlay__authorLink}>
                      {currentTrack?.author}
                    </span>
                  </div>

                  <div className={styles.trackPlay__album}>
                    <span className={styles.trackPlay__albumLink}>
                      {currentTrack?.title}
                    </span>
                  </div>
                </div>

                <div className={styles.trackPlay__likeDis}>
                  <div className={styles.trackPlay__like}>
                    <Image
                      src="/img/icon/like.svg"
                      width={14}
                      height={12}
                      alt="like"
                      className={styles.trackPlay__likeSvg}
                    />
                  </div>

                  <div className={styles.trackPlay__dislike}>
                    <Image
                      src="/img/icon/dislike.svg"
                      width={14}
                      height={12}
                      alt="dislike"
                      className={styles.trackPlay__dislikeSvg}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.bar__volumeBlock}>
              <div className={styles.volume__content}>
                <div className={styles.volume__image}>
                  <Image
                    src="/img/icon/volume.svg"
                    width={18}
                    height={18}
                    alt="volume"
                    className={styles.volume__svg}
                  />
                </div>

                <div className={styles.volume__progress}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    className={styles.volume__progressLine}
                    onChange={handleVolumeChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Скрытый audio-элемент */}
      <audio ref={audioRef} />
    </>
  );
}
