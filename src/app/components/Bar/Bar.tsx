"use client";

import Image from "next/image";
import styles from "./Bar.module.css";
import { usePlayer } from "@/app/context/PlayerContext";

export default function Bar() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    volume,
    changeVolume,
  } = usePlayer() as any;

  return (
    <div className={styles.bar}>
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}></div>

        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div onClick={prevTrack} className={styles.player__btnPrev}>
                <Image
                  src="/img/icon/prev.svg"
                  width={15}
                  height={14}
                  alt="prev"
                  className={styles.player__btnPrevSvg}
                />
              </div>

              <div onClick={togglePlay} className={styles.player__btnPlay}>
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

              <div onClick={nextTrack} className={styles.player__btnNext}>
                <Image
                  src="/img/icon/next.svg"
                  width={15}
                  height={14}
                  alt="next"
                  className={styles.player__btnNextSvg}
                />
              </div>

              <div className={styles.player__btnRepeat}>
                <Image
                  src="/img/icon/repeat.svg"
                  width={18}
                  height={12}
                  alt="repeat"
                  className={styles.player__btnRepeatSvg}
                />
              </div>

              <div className={styles.player__btnShuffle}>
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
                  onChange={(e) => changeVolume(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
