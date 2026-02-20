# Tech Stack: DATE

## Core Framework
- **React (v19):** Modern component-based architecture with powerful state management.
- **Vite (v8 beta):** Fast dev server and build tool with hot module replacement (HMR).

## Tooling & Quality
- **TypeScript (TSX):** Strictly typed superset of JavaScript for enhanced reliability and developer experience.
- **ESLint:** Enforces code quality and consistent styling.
- **Vitest:** Unit and component testing framework for fast, reliable feedback loops.
- **Code Quality:** Mandatory TypeScript strict mode and >80% code coverage enforced via @vitest/coverage-v8.

## State Management & Storage
- **Zustand (v5):** Lightweight, scalable state management for game board and library data.
- **LocalStorage:** Persistent, browser-based storage for user-saved ideas (Phase 1).

## Styling & UI
- **Vanilla CSS:** Maximum flexibility for creating the nostalgic "notebook paper" aesthetic and complex animations.
- **Mobile First:** Responsive design prioritized for thumb-friendly interaction.

## Future Phases (Backend/Infrastructure)
- **Authentication:** Google OAuth.
- **Backend:** Firebase or Supabase (real-time sync & group libraries).
- **AI Integration:** LLM for automatic time estimation of library items.