# Track Specification: Architecture: Unify Game Persistence

## Overview
This track refactors the application's data model to treat every game session as a persistent `Game` entity. This unifies the concept of "active game" and "history," enabling features like resuming games, multiplayer (future), and robust history tracking.

## Functional Requirements
- **Game Entity:** Define a standard data structure for a game session.
  - `id`: Unique UUID.
  - `status`: 'setup' | 'active' | 'completed'.
  - `createdAt`: ISO Timestamp.
  - `participants`: Array of user IDs (initially just local user).
  - `categories`: The board state (categories and items).
  - `winners`: Array of winning items (if completed).
- **Persistence:**
  - Save every game state change (or at least significant ones) to storage.
  - "History" is simply a query for all games with `status: 'completed'`.
- **Game Management:**
  - Ability to create a new game.
  - Ability to load an existing game by ID.
  - Ability to list past games.

## Technical Requirements
- **Storage:** Create `LocalGameAdapter` to implement the `GameRepository` interface using `localStorage`.
- **Store:** Refactor `gameStore` to:
  - Manage a *current* `Game` entity.
  - Use `LocalGameAdapter` for persistence.
  - Expose actions for `createGame`, `loadGame`, `saveGame`.
- **Testing:** 
  - TDD for all new adapters and store logic.
  - >80% coverage.

## Acceptance Criteria
- [ ] `LocalGameAdapter` is implemented and fully tested.
- [ ] `gameStore` is refactored to use the adapter and `Game` entity.
- [ ] User can complete a game, and it persists as a "completed" game.
- [ ] User can view a list of past games (History) by querying the adapter.
- [ ] Data survives page reload (restores current game or allows new one).