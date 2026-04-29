Because that version was not clean GitHub-flavored Markdown.

I included extra block metadata like `id="..."` inside fenced code blocks, and that can break rendering in some editors/viewers, so the README looks like it “stops” or formats weirdly.

Use a plain `README.md` with normal markdown only. Here is a clean version you can paste directly:

````md
# Happening App

Happening App is a fullstack event management and discovery platform built to showcase both frontend and backend development. It allows users to browse events, view detailed information, manage favorites, create and edit events, explore statistics, interact with event comments, and visualize live event updates.

The project was developed progressively, starting with a frontend-focused implementation and then evolving into a fullstack application with REST, GraphQL, offline support, live data generation, websockets, and multiple UI interaction modes.

---

## Overview

The application supports:

- browsing events in both **table view** and **cards view**
- **event details** pages with metadata and comment sections
- **add / edit / delete** event functionality
- **favorites** management
- **statistics** and **split-view analytics**
- **offline CRUD support** with synchronization when connection is restored
- **live server-side fake event generation**
- **real-time updates** through websockets
- both **REST API** and **GraphQL API** implementations
- both **classic pagination** and **infinite scroll** modes
- a **1-to-many fullstack relationship** between events and comments

---

## Main Features

### Event management
Users can:
- create new events
- update existing events
- delete events
- browse event collections
- view event details

### Favorites
Users can mark events as favorites and later revisit them in the dedicated Favorites page.

### Pick Your Night
Users can compare favorite events in a face-off style flow until one final winner remains.

### Statistics
The application computes and visualizes:
- events by category
- free vs paid events
- comment counts per event

### Split View
A dedicated live-analysis page shows:
- event list on one side
- charts and statistics on the other side
- real-time updates when the backend generator creates fake events

### Comments system
Each event can have multiple comments.

This introduces a **1-to-many relationship** in the domain model:

- one event
- many comments

Users can:
- view comments for an event
- create comments
- delete comments

### Offline mode
When the network is down or the backend becomes unreachable, the app:
- falls back to local cached data
- allows local create / update / delete operations
- queues unsynced operations
- synchronizes them once the connection is restored

### Dual API support
The project supports both:
- REST
- GraphQL

The frontend can be switched between the two to demonstrate both implementations.

### Dual browsing modes
The cards page supports both:
- classic pagination
- infinite scroll

This allows side-by-side comparison of different frontend loading strategies.

---

## Technology Stack

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **Lucide React**
- **Recharts**
- **Socket.IO Client**
- CSS modules / page-level CSS styling

### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **Socket.IO**
- **Apollo Server**
- **GraphQL**
- **Faker**

### Testing / Tooling
- **Jest**
- **Supertest**
- **Nodemon**
- **TSX**
- **Thunder Client** for API testing

---

## Architecture and Project Organization

The repository is split into two main parts:

```text
backend/
frontend/
````

### Frontend structure

```text
frontend/src/
  assets/
  components/
  config/
  context/
  pages/
  services/
  styles/
  types/
  utils/
```

#### Important frontend folders

* `components/`
  Reusable UI building blocks such as cards, layout sections, navigation, and insight cards.

* `pages/`
  Route-level pages like:

  * `EventsTablePage`
  * `EventsCardsPage`
  * `EventDetailsPage`
  * `AddEventPage`
  * `EditEventPage`
  * `FavoritesPage`
  * `StatisticsPage`
  * `SplitViewPage`
  * `PickYourNightPage`

* `context/`
  Contains `EventsContext`, which coordinates:

  * current event state
  * online/offline mode
  * synchronization logic
  * favorites logic
  * CRUD orchestration

* `services/`
  API abstraction layer. Includes:

  * REST implementation
  * GraphQL implementation
  * a switch file to choose the active API mode

* `types/`
  Shared TypeScript models such as:

  * `EventItem`
  * `CommentItem`

* `utils/`
  Utility modules for:

  * cookies
  * offline queue
  * events cache

* `config/`
  Runtime switching configuration, for example:

  * REST vs GraphQL
  * pagination vs infinite scroll

### Backend structure

```text
backend/src/
  controllers/
  data/
  graphql/
  routes/
  services/
  validators/
  app.ts
  server.ts
  socket.ts
```

#### Important backend folders

* `controllers/`
  Business logic entry points for REST routes:

  * events
  * comments
  * stats
  * generator

* `data/`
  In-memory data stores and domain types:

  * events
  * comments

* `graphql/`
  GraphQL schema, resolvers, and setup.

* `routes/`
  REST route declarations for:

  * `/events`
  * `/comments`
  * `/stats`
  * `/generator`

* `services/`
  Additional backend services such as the fake-event generator.

* `validators/`
  Input validation for events and comments.

* `socket.ts`
  Socket.IO initialization and websocket communication setup.

* `app.ts`
  Express application setup.

* `server.ts`
  HTTP server startup, Socket.IO setup, and GraphQL registration.

---

## API Modes

The frontend can run against either implementation:

* **REST**
* **GraphQL**

This is controlled from the frontend service switch configuration. This allows the same UI to be demonstrated using two backend communication styles.

---

## Browsing Modes

The cards page can run in two loading styles:

* **pagination**
* **infinite scroll**

This is useful for demonstrating:

* traditional pagination UX
* modern incremental-loading UX

---

## Offline and Synchronization Model

The application includes offline support for CRUD operations.

### Behavior

When the backend is unavailable or the connection is lost:

* cached event data is used
* create / update / delete operations are applied locally
* operations are saved in a local offline queue

When connectivity is restored:

* queued operations are replayed to the backend
* data is refreshed from the server

This makes the app resilient and demonstrates progressive enhancement of the frontend state layer.

---

## Real-Time Features

The backend includes a fake data generator that can be started and stopped.

### Generator capabilities

* server creates valid fake events at intervals
* generated events are stored in backend memory
* new events are broadcast to connected clients via Socket.IO

### Frontend behavior

The Split View page listens for websocket events and updates:

* the event list
* event counts
* statistics
* charts

in real time.

---

## 1-to-Many Relationship

The domain model includes:

* **Event**
* **Comment**

One event can have many comments.

This relationship is implemented fullstack:

* backend data model
* REST endpoints
* GraphQL schema and resolvers
* frontend details page
* comment CRUD
* comment-based statistics

---

## How to Set Up the Project

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <your-repository-folder>
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 4. Run the backend

From the `backend` folder:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

### 5. Run the frontend

From the `frontend` folder:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

### 6. Open the application

Visit:

```text
http://localhost:5173
```

---

## Switching Between REST and GraphQL

The frontend can be configured to use either REST or GraphQL.

Depending on your setup, this is controlled through either:

* `frontend/src/services/eventsApi.ts`
* or `.env` config if you implemented environment-based switching

### Example

* `rest` mode -> frontend uses REST endpoints
* `graphql` mode -> frontend uses `/graphql`

After changing the mode, restart the frontend if needed.

---

## Switching Between Pagination and Infinite Scroll

The cards view supports both modes.

This is controlled through:

* `frontend/src/config/eventsDisplayMode.ts`
* or an environment variable if configured that way

### Example

* `"pagination"` -> classic page-by-page navigation
* `"infinite"` -> load more events while scrolling

---

## Available Scripts

### Backend

From `backend/`:

```bash
npm run dev
```

Runs the backend in development mode.

```bash
npm run build
```

Builds the backend TypeScript project.

```bash
npm run start
```

Starts the built backend.

```bash
npm test
```

Runs backend tests.

```bash
npm run test:coverage
```

Runs backend tests with coverage.

### Frontend

From `frontend/`:

```bash
npm run dev
```

Runs the frontend in development mode.

```bash
npm run build
```

Builds the frontend for production.

```bash
npm run preview
```

Previews the production build.

---

## Testing the App

### REST testing

You can test REST endpoints using:

* browser
* Thunder Client
* Postman

### GraphQL testing

You can test GraphQL through:

```text
http://localhost:3000/graphql
```

### Offline mode testing

You can test offline support by:

* disconnecting the backend
* or using browser offline tools
* then performing CRUD operations
* then restoring connectivity and checking sync behavior

### Real-time generator testing

Use the Split View page to:

* start generator
* watch live updates
* stop generator

---

## Notes

* Data is currently stored **in memory**, so restarting the backend resets the dataset.
* Offline data and queued operations may be stored in browser local storage.
* The project is structured to demonstrate multiple architectural approaches in the same application:

  * REST and GraphQL
  * pagination and infinite scroll
  * online and offline workflows
  * static CRUD and live websocket updates

---

## Author

Built as a fullstack academic project to demonstrate frontend, backend, API design, offline resilience, real-time communication, and data relationship modeling.

```

The reason it “stopped” before was just malformed markdown. This version should render normally end to end.
```
