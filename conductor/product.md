# Initial Concept
DATE is a web application that digitizes the classic childhood fortune-telling game MASH to help couples and friend groups make decisions on meals, activities, and entertainment. It combines a nostalgic, gamified interface with practical decision-making tools.

# Product Definition: DATE (Dinner, Activity, Treat, Entertainment)

## 1. Vision & Goals
The primary goal of DATE is to eliminate the "what do you want to do?" indecision for couples and friend groups in a playful, low-stakes way.

- **MVP Goal:** A functional single-page app (SPA) for two people sharing one screen, requiring no login and storing data locally.
- **Long-term Goal:** A collaborative, multi-device platform with persistent identities, real-time sync, and smart, time-aware recommendations.

## 2. Target Audience
- **Primary (MVP):** Couples (Millennials/Gen Z) who need a quick, fun way to plan a casual evening together on one device.
- **Secondary (Phase 2+):** Friend groups (3–6 people) planning outings across multiple devices.

## 3. Core Features (Phased)

### Phase 1: Date Night MVP (Local Only)
- **The Board:** 4 default categories (Dinner, Activity, Treat, Entertainment) with 4 input slots each.
- **Spiral Mechanic:** Press-and-hold interaction to generate a "Magic Number" (3-15).
- **Elimination Animation:** Gamified counting and crossing out of items until one remains per category.
- **Time Context:** Basic input for start time and duration to orient choices.
- **Local Storage:** Data persistence via `localStorage`.

### Phase 2: The Connected Group (Backend Integration)
- **Authentication:** Google OAuth login.
- **Real-time Sync:** Group "Lobbies" for collaborative input across devices.
- **Libraries:** Personal and Group idea databases.
- **Game Logs:** History tracking for individuals and groups.
- **LLM Time Estimates:** Automatic inference of time requirements for library items.

### Phase 3: The Decision Engine
- **Voting/Drafting:** Pre-game selection phase with ranked-choice or voting.
- **Advanced Stats:** Tracking "Times Played" vs. "Times Won" for items.
- **Customization:** Editable category headers and support for 5+ categories.
- **Smart Filtering:** Total duration warnings and time-based recommendations.

## 4. Key Terminology
- **The Board:** The active game screen for a session.
- **The Library:** Persistent database of user-saved ideas.
- **The Magic Number:** The integer used for elimination counting.
- **The Result:** The final surviving item in each category.

## 5. UI/UX Principles
- **Aesthetic:** Nostalgic "handwritten" feel with a notebook paper background.
- **Interaction:** Tactile, thumb-friendly, and playful (e.g., the spiral mechanic).
- **Simplicity:** Minimal friction from opening the app to seeing a result.