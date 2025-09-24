'use client';
import styles from './ResultsList.module.css';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/app/hooks/useSearch';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';

export default function ResultsList() {
  const qLive = useSearchParams().get('q') ?? '';
  const q = useDebouncedValue(qLive, 300);
  const state = useSearch(q);

  if (!qLive) {
    return <p className={styles.muted}>Start typing to see results.</p>;
  }

  if (state.status === 'loading') {
    return (
      <ul className={styles.skeletonList} aria-busy>
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className={styles.skeleton} />
        ))}
      </ul>
    );
  }

  if (state.status === 'error') {
    return (
      <div role="alert" className={styles.error}>
        <div>Something went wrong: {state.error}</div>
        <div className={styles.hint}>Try editing your query or clearing it.</div>
      </div>
    );
  }

  const items = state.data?.items ?? [];
  if (items.length === 0) {
    return <p className={styles.muted}>No results for “{qLive}”.</p>;
    }

  return (
    <ul className={styles.list}>
      {items.map((it) => (
        <li key={it.id} className={styles.card}>
          <h3 className={styles.title}>{it.title}</h3>
          <p className={styles.desc}>{it.description}</p>
        </li>
      ))}
    </ul>
  );
}
