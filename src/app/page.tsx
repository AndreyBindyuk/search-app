import { SearchBox } from "@/app/components/SearchBox";
import ResultsList from "@/app/components/ResultsList";
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.root}>
      <SearchBox />
      <ResultsList />
    </main>
  );
}
