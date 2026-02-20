# Implementation Plan - Architecture: Unify Game Persistence

## Phase 1: Data Layer & Repository
- [x] Task: Create `LocalGameAdapter` (GameRepository). [c9c8229]
    - [x] Define `Game` type/schema (in JSDoc or separate type file).
    - [x] Implement `save(game)`: Upsert game.
    - [x] Implement `get(id)`: Retrieve by ID.
    - [x] Implement `list(filter)`: Retrieve all (with optional status filter).
    - [x] **Verification:** TDD with >80% coverage.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Data Layer & Repository' (Protocol in workflow.md)

## Phase 2: Store Refactor
- [ ] Task: Refactor `gameStore` to use `LocalGameAdapter`.
    - [ ] Inject adapter via factory (like `libraryStore`).
    - [ ] Replace transient state with `currentGame` object.
    - [ ] Implement `createGame()` action.
    - [ ] Implement `finishGame()` action (updates status, persists).
    - [ ] **Verification:** Update existing store tests to match new structure.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Store Refactor' (Protocol in workflow.md)

## Phase 3: UI Integration (History)
- [ ] Task: Create `HistoryPanel` using `GameRepository`.
    - [ ] Fetch completed games from `gameStore` (or adapter directly).
    - [ ] Render list of past games.
- [ ] Task: Update `App.jsx` to mount `HistoryPanel`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Integration (History)' (Protocol in workflow.md)

## Phase 4: Finalization
- [ ] Task: Full Project Coverage Check (>80%).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Finalization' (Protocol in workflow.md)