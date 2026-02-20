# Track Specification: Implement Game History persistence

## Overview
This track focuses on implementing the "Game History" feature as described in the PRD (Phase 1/2). It involves persisting the winning results of each game session to `localStorage` and providing a UI to view this history.

## Functional Requirements
- **Persistence:** After a game is completed (phase is 'result' or 'done' is true), the winning results (category and item name) must be saved to `localStorage`.
- **Data Model:** Each history entry should include:
  - `id`: Unique identifier (UUID).
  - `timestamp`: When the game was completed.
  - `winners`: Array of `{ category, item }`.
- **History View:** A new UI component `HistoryPanel` that displays a scrollable list of past games.
- **Clear History:** Ability for the user to clear their local game history.

## Technical Requirements
- Use `LocalStorageAdapter` (or a dedicated `HistoryAdapter`) for persistence.
- Update `gameStore` to handle the transition to the result phase and trigger history saving.
- React components for displaying the history list.

## Acceptance Criteria
- [ ] Completing a game correctly saves the results to `localStorage`.
- [ ] The history can be viewed in a scrollable list.
- [ ] Each history entry displays the date and the winning items.
- [ ] History is persisted across page reloads.
- [ ] The user can clear their history.