import { useEffect, useRef, useState } from 'react';
import { SearchResponse } from '@/lib/searchTypes';

export type SearchState =
  | { status: 'initial'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: SearchResponse; error: null }
  | { status: 'error'; data: null; error: string };

export function useSearch(query: string) {
  const [state, setState] = useState<SearchState>({ status: 'initial', data: null, error: null });

  const ctrlRef = useRef<AbortController | null>(null);
  const reqIdRef = useRef(0); // increasing request id

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      // cancel any in-flight when clearing
      ctrlRef.current?.abort();
      setState({ status: 'initial', data: null, error: null });
      return;
    }

    setState({ status: 'loading', data: null, error: null });

    const thisId = ++reqIdRef.current;
    const ctrl = new AbortController();
    ctrlRef.current?.abort();
    ctrlRef.current = ctrl;

    const url = `/api/search?q=${encodeURIComponent(q)}`;

    fetch(url, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as SearchResponse;
        // Only apply if this is the latest request
        if (thisId === reqIdRef.current) {
          setState({ status: 'success', data, error: null });
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return; // ignore aborted
        const message = err instanceof Error ? err.message : 'Unknown error';
        if (thisId === reqIdRef.current) {
          setState({ status: 'error', data: null, error: message });
        }
      });
  }, [query]);

  return state;
}
