"use client";

import Navigation from "@/app/components/Navigation/Navigation";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import styles from "@/app/page.module.css";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <aside className={styles.left}>
          <Navigation />
        </aside>

        <main className={styles.center}>{children}</main>

        <aside className={styles.right}>
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
