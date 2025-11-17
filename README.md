# Calendar View Component

A sophisticated, fully functional calendar component for date and event management, built with React, TypeScript, and Tailwind CSS. It features month, week, and agenda views, drag-and-drop event handling, and is designed to be responsive and accessible.

## 🚀 Live Storybook

[View the interactive Storybook deployment here.](https://storybook.js.org/showcase)

## 📦 Installation

This project uses `npm` for package management.

```bash
# Install dependencies
npm install

# Run the Storybook development server
npm run storybook
```

## 🏗️ Architecture

The application follows a modern, component-based architecture designed for scalability and maintainability:

-   **Component-Based:** The UI is built with reusable React components located in `src/components/`. This includes primitives like `Button` and `Modal`, and complex view components like `MonthView`, `WeekView`, and the main `CalendarView`.
-   **Custom Hooks:** Core logic is encapsulated in custom hooks to promote separation of concerns. `useCalendar` handles date navigation and view state, while `useEventManager` manages all event-related actions (CRUD, filtering).
-   **TypeScript:** The project uses TypeScript for strong typing, with all shared type definitions located in `src/types.ts`. This ensures code quality and developer confidence.
-   **Utilities:** Pure helper functions, especially for date manipulation, are kept in `src/utils/date.utils.ts` for reusability and easy testing.
-   **Styling:** Styling is handled by [Tailwind CSS](https://tailwindcss.com/) using its utility-first approach, configured via `tailwind.config.js`.

## ✨ Features

-   [x] **Multiple Views:** Seamlessly switch between Month, Week, and Agenda views.
-   [x] **Event Management:** Create, read, update, and delete events through an intuitive, lazy-loaded modal.
-   [x] **Drag & Drop:** Easily reschedule events by dragging them to a new date in the month view.
-   [x] **Responsive Design:** A fully responsive layout that adapts from a touch-friendly mobile list view to a multi-column desktop view.
-   [x] **Accessibility (WCAG 2.1 AA):**
    -   [x] Full keyboard navigation for all views (arrow keys, Home/End, Enter).
    -   [x] ARIA attributes for screen reader support (`role`, `aria-label`, `aria-current`, etc.).
    -   [x] High-contrast colors and visible focus indicators on all interactive elements.
-   [x] **Performance Optimized:**
    -   [x] Memoization (`React.memo`, `useCallback`, `useMemo`) to prevent unnecessary re-renders.
    -   [x] List virtualization in Agenda view to handle thousands of events smoothly.
    -   [x] Debounced search input for efficient event filtering.

## 📖 Storybook Stories

Our Storybook provides an interactive way to develop and test components in isolation.

-   **Default:** Renders the calendar with a default set of sample events.
-   **Empty:** Shows the calendar in its empty state with no events.
-   **WeekView:** Displays the calendar defaulted to the Week view.
-   **LargeDataset:** Demonstrates performance by rendering the calendar with 50+ events.
-   **InteractivePlayground:** A fully functional story with controls to dynamically change props like the initial date and view mode.

## 🛠️ Technologies

-   **React 19**
-   **TypeScript**
-   **Tailwind CSS**
-   **Storybook** (for component development and documentation)
-   **clsx** (for conditional class names)

## 👤 Contact

-   **Name:** GUNJAN KOSTA
