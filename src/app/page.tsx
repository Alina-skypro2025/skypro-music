"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navigation from "./components/Navigation/Navigation";
import Sidebar from "./components/Sidebar/Sidebar";
import Centerblock from "./components/Centerblock/Centerblock";

import styles from "./page.module.css";

export default function Page() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("skypro_access");
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) return null;

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        
        <aside className={styles.left}>
          <Navigation />
        </aside>

        
        <main className={styles.center}>
          <Centerblock />
        </main>

       
        <aside className={styles.right}>
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
