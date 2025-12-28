"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Navigation from "./components/Navigation/Navigation";
import Sidebar from "./components/Sidebar/Sidebar";
import Centerblock from "./components/Centerblock/Centerblock";
import Bar from "./components/Bar/Bar";

import styles from "./page.module.css";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className={styles.page}>
      
      <Navigation />

     
      <div className={styles.main}>
        
        <div />

        
        <main className={styles.center}>
          <Centerblock />
        </main>

        
        <aside className={styles.right}>
          <Sidebar />
        </aside>
      </div>

     
      <div className={styles.player}>
        <Bar />
      </div>
    </div>
  );
}
