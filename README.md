## How to run
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## What’s implemented
- Debounced search, URL sync (`?q=`)
- Race-safe fetch: `AbortController` + request ids
- Mock API
- Error/empty/loading states
- Minimal CSS Modules and consistent TS types

## Possible improvements
- Highlight matched substrings
- Virtualized list for large data
- Add tests (React Testing Library)

