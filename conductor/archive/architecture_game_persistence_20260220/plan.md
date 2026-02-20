# Implementation Plan - Architecture: Unify Game Persistence

## Phase 1: Data Layer & Repository [checkpoint: 0268ac4]
- [x] Task: Create `LocalGameAdapter` (GameRepository). [c9c8229]
    - [x] Define `Game` type/schema (in JSDoc or separate type file).
    - [x] Implement `save(game)`: Upsert game.
    - [x] Implement `get(id)`: Retrieve by ID.
    - [x] Implement `list(filter)`: Retrieve all (with optional status filter).
    - [x] **Verification:** TDD with >80% coverage.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Data Layer & Repository' (Protocol in workflow.md)

## Phase 2: Store Refactor [checkpoint: 5adf00e]
- [x] Task: Refactor `gameStore` to use `LocalGameAdapter`. [5c16eaa]
    - [x] Inject adapter via factory (like `libraryStore`).
    - [x] Replace transient state with `currentGame` object.
    - [x] Implement `createGame()` action.
    - [x] Implement `finishGame()` action (updates status, persists).
    - [x] **Verification:** Update existing store tests to match new structure.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Store Refactor' (Protocol in workflow.md)

## Phase 3: UI Integration (History) [checkpoint: 952473d]
- [x] Task: Create `HistoryPanel` using `GameRepository`. [952473d]
    - [x] Fetch completed games from `gameStore` (or adapter directly).
    - [x] Render list of past games.
- [x] Task: Update `App.jsx` to mount `HistoryPanel`. [952473d]
- [x] Task: Conductor - User Manual Verification 'Phase 3: UI Integration (History)' (Protocol in workflow.md) [checkpoint: 3c7f819]

## Phase 4: Finalization [checkpoint: 194c98d]
- [x] Task: Full Project Coverage Check (>80%). [194c98d]
- [x] Task: Conductor - User Manual Verification 'Phase 4: Finalization' (Protocol in workflow.md)