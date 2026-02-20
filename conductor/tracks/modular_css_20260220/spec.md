# Track Specification: Maintainability: Modularize Component Styling

## Overview
This track refactors the project's styling from a monolithic `App.css` to a component-based architecture. Each React component will have its own dedicated `.css` file, improving encapsulation and maintainability.

## Functional Requirements
- **Encapsulation:** Component styles should be collocated with their component logic.
- **Maintainability:** Large, monolithic CSS files must be replaced with smaller, focused files.
- **Consistency:** The application's visual appearance must remain identical after the refactor.

## Technical Requirements
- **Extraction:** Move relevant CSS rules from `App.css` to individual files (e.g., `src/components/Board.css`).
- **Imports:** Import the component-specific CSS directly into the corresponding `.jsx` (or `.tsx`) file.
- **Global Styles:** `App.css` should be reserved for global variables, resets, and layout-level styles.

## Acceptance Criteria
- [ ] `App.css` is significantly reduced in size, containing only global/layout styles.
- [ ] Every major component (`Board`, `Category`, `HistoryPanel`, etc.) has its own `.css` file.
- [ ] No regression in visual appearance or responsiveness.
- [ ] No unused CSS rules remain in `App.css`.