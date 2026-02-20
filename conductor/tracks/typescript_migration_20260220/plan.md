# Implementation Plan - Migrate to TypeScript

## Phase 1: Environment Setup [checkpoint: 3895cd0]
- [x] Task: Initialize TypeScript configuration. [b423700]
    - [x] Run `npx tsc --init`.
    - [x] Configure `tsconfig.json` for React/Vite/Vitest.
    - [x] Install `@types/react`, `@types/react-dom`, `@types/uuid`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Environment Setup' (Protocol in workflow.md)

## Phase 2: Core Logic Migration (Data & Storage)
- [x] Task: Create global type definitions (e.g., `src/types/index.ts`).
- [x] Task: Convert storage adapters to TypeScript. [6f60596]
    - [x] `LocalLibraryAdapter.ts`
    - [x] `LocalGameAdapter.ts`
- [x] Task: Convert Zustand stores to TypeScript. [a1f21dc]
    - [x] `libraryStore.ts`
    - [x] `gameStore.ts`
- [x] Task: Conductor - User Manual Verification 'Phase 2: Core Logic Migration' (Protocol in workflow.md) [checkpoint: 3895cd0]

## Phase 3: UI Component Migration [checkpoint: b32e0d5]
- [x] Task: Convert components to `.tsx`. [2064d78]
    - [x] `SpiralButton.tsx`, `Category.tsx`.
    - [x] `Board.tsx`, `HistoryPanel.tsx`.
    - [x] `App.tsx`, `main.tsx`.
- [x] Task: Conductor - User Manual Verification 'Phase 3: UI Component Migration' (Protocol in workflow.md)

## Phase 4: Test Suite Migration & Finalization [checkpoint: fb9ae30]
- [x] Task: Convert all `.test.js/.jsx` files to `.ts/.tsx`. [c0949e3]
- [x] Task: Run `tsc` to verify zero type errors. [c0949e3]
- [x] Task: Conductor - User Manual Verification 'Phase 4: Test Suite Migration' (Protocol in workflow.md)