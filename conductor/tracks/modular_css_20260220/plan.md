# Implementation Plan - Modularize Component Styling

## Phase 1: Extraction & Implementation
- [ ] Task: Extract styles for the Board and its sub-components.
    - [ ] Create `Board.css`, `Category.css`, `SpiralButton.css`.
    - [ ] Update imports in respective component files.
- [ ] Task: Extract styles for Panels.
    - [ ] Create `LibraryPanel.css`, `HistoryPanel.css`.
    - [ ] Update imports.
- [ ] Task: Extract styles for App Shell & Utils.
    - [ ] Create `AppShell.css` (or keep in reduced `App.css`).
    - [ ] Create `DevTools.css`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Extraction & Implementation' (Protocol in workflow.md)

## Phase 2: Cleanup & Finalization
- [ ] Task: Audit `App.css` for dead code and move global variables to `:root`.
- [ ] Task: Verify responsive design across all extracted files.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Cleanup & Finalization' (Protocol in workflow.md)