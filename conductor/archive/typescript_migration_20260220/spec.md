# Track Specification: Quality: Migrate to TypeScript

## Overview
This track converts the existing JavaScript/JSX codebase to TypeScript to improve type safety, catch potential bugs at compile-time (like the recent "undefined" property access issues), and provide better developer experience through IDE intellisense.

## Functional Requirements
- **Full Type Safety:** All core logic (stores, storage adapters, utility functions) must be strictly typed.
- **Component Props:** All React components must use typed props (via interfaces or types).
- **Maintain Behavior:** The migration must be purely structural; no changes to application behavior are permitted unless to fix existing type-related bugs.

## Technical Requirements
- **Config:** Initialize `tsconfig.json` with strict mode.
- **Vite:** Update `vite.config.js` to support TypeScript if needed (standard in most Vite templates).
- **Phased Migration:**
  1. Setup and Global Types (e.g., `Game`, `LibraryItem`).
  2. Storage Adapters.
  3. Zustand Stores.
  4. UI Components (Bottom-up: SpiralButton -> Category -> Board -> App).
- **Testing:** All existing tests must be converted to `.test.ts/.tsx` and pass.

## Acceptance Criteria
- [ ] `tsconfig.json` exists and strict mode is enabled.
- [ ] No `.js` or `.jsx` files remain in the `src/` directory (excluding configuration).
- [ ] No `any` types remain in the codebase (unless explicitly justified).
- [ ] All 75+ tests pass in TypeScript mode.
- [ ] Build completes successfully with `tsc`.