import styles from "./page.module.css";
import Navigation from "./components/Navigation/Navigation";
import Centerblock from "./components/Centerblock/Centerblock";
import Sidebar from "./components/Sidebar/Sidebar";
import Bar from "./components/Bar/Bar";

export default function Home() {
  return (
    <div className={styles.page}>
      
      {/* Хедер во всю ширину */}
      <Navigation />

      {/* Контентная область по центру */}
      <div className={styles.page__content}>
        <Centerblock />
        <Sidebar />
      </div>

      {/* Плеер снизу */}
      <Bar />
    </div>
  );
}
