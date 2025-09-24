'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import styles from './SearchBox.module.css';

export function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const initial = params.get('q') ?? '';
  const [value, setValue] = useState(initial);

  // URL synchronization for each input
  const updateUrl = (next: string) => {
    const sp = new URLSearchParams(Array.from(params.entries()));
    if (next) sp.set('q', next); else sp.delete('q');
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    updateUrl(next);
  };

  // Reverse sync: URL -> input (browser history/Back/Forward)
  useEffect(() => {
    const q = params.get('q') ?? '';
    setValue((prev) => (prev !== q ? q : prev));
  }, [params]);

  const onClear = () => {
    setValue('');
    updateUrl('');
    inputRef.current?.focus();
  };

  return (
    <div className={styles.root}>
      <label htmlFor="search" className={styles.label}>Movie search</label>
      <input
        id="search"
        ref={inputRef}
        className={styles.input}
        type="search"
        placeholder="Type to search..."
        value={value}
        onChange={onChange}
        autoComplete="off"
        autoFocus
        aria-label="Search"
      />
      {value && (
        <button className={styles.clear} onClick={onClear} aria-label="Clear search">×</button>
      )}
    </div>
  );
}
