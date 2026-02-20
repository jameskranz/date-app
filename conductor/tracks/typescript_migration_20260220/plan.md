# Implementation Plan - Migrate to TypeScript

## Phase 1: Environment Setup
- [x] Task: Initialize TypeScript configuration. [b423700]
    - [x] Run `npx tsc --init`.
    - [x] Configure `tsconfig.json` for React/Vite/Vitest.
    - [x] Install `@types/react`, `@types/react-dom`, `@types/uuid`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Environment Setup' (Protocol in workflow.md)

## Phase 2: Core Logic Migration (Data & Storage)
- [ ] Task: Create global type definitions (e.g., `src/types/index.ts`).
- [ ] Task: Convert storage adapters to TypeScript.
    - [ ] `LocalLibraryAdapter.ts`
    - [ ] `LocalGameAdapter.ts`
- [ ] Task: Convert Zustand stores to TypeScript.
    - [ ] `libraryStore.ts`
    - [ ] `gameStore.ts`
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Core Logic Migration' (Protocol in workflow.md)

## Phase 3: UI Component Migration
- [ ] Task: Convert components to `.tsx`.
    - [ ] `SpiralButton.tsx`, `Category.tsx`.
    - [ ] `Board.tsx`, `HistoryPanel.tsx`.
    - [ ] `App.tsx`, `main.tsx`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Component Migration' (Protocol in workflow.md)

## Phase 4: Test Suite Migration & Finalization
- [ ] Task: Convert all `.test.js/.jsx` files to `.ts/.tsx`.
- [ ] Task: Run `tsc` to verify zero type errors.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Test Suite Migration' (Protocol in workflow.md)