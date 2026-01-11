"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navigation from "@/app/components/Navigation/Navigation";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import Centerblock from "@/app/components/Centerblock/Centerblock";

import styles from "@/app/page.module.css";

export default function PlaylistPage() {
  const router = useRouter();
  const params = useParams();

  const [checked, setChecked] = useState(false);

  const playlistId = useMemo(() => {
    const raw = (params as any)?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const id = Number(value);
    return Number.isFinite(id) ? id : null;
  }, [params]);

  
  useEffect(() => {
    const token =
      localStorage.getItem("skypro_access") ||
      localStorage.getItem("access") ||
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setChecked(true);
  }, [router]);

  
  useEffect(() => {
    if (!checked) return;
    if (playlistId === null) return; 

    if (playlistId <= 0) {
      router.replace("/");
    }
  }, [checked, playlistId, router]);

  
  if (!checked) return null;

  
  if (playlistId === null) {
    return (
      <div className={styles.page}>
        <div className={styles.main}>
          <aside className={styles.left}>
            <Navigation />
          </aside>

          <main className={styles.center} />

          <aside className={styles.right}>
            <Sidebar />
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <aside className={styles.left}>
          <Navigation />
        </aside>

        <main className={styles.center}>
          <Centerblock playlistId={playlistId} />
        </main>

        <aside className={styles.right}>
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
