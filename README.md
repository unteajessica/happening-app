# Happening App

Happening App is a fullstack event discovery and management platform built with React, TypeScript, Node.js, Express, PostgreSQL, Prisma, MongoDB, Socket.IO, GraphQL, JWT authentication, HTTPS, and role-based authorization.

The application allows users to browse events, view event details, add comments, manage favorites, use a real-time chat, view statistics, and interact with admin-only monitoring tools. It was developed progressively to demonstrate frontend, backend, database, authentication, authorization, testing, real-time communication, offline support, and secure client-server communication.

---

## Main Features

### Event discovery and management

Users can:

* browse events in table view
* browse events in cards view
* open event details
* search/filter events
* view statistics
* view event comments
* add comments
* mark events as favorites
* play Pick Your Night game
* use the real-time chat

Admins can also:

* create events
* update events
* delete events
* delete comments
* view action logs
* view suspicious users
* delete chat messages

---

### Authentication and authorization

The app implements fullstack authentication and authorization.

Features:

* secure login
* secure register
* password hashing with bcrypt
* JWT token generation on login/register
* JWT token verification on protected backend routes
* role-based permissions
* frontend permission checks
* backend permission middleware
* automatic logout after inactivity

The frontend stores:

```text
happening_current_user
happening_auth_token
```

The backend expects protected requests to send:

```text
Authorization: Bearer <token>
```

---

### Roles and permissions

The app supports two main roles:

```text
ADMIN
USER
```

### Comments system

Each event can have many comments.

This creates a fullstack one-to-many relationship:

```text
Event 1 --- many Comments
```

Users can:

* view comments
* add comments

Admins can also:

* delete comments

---

### Favorites

Users can mark events as favorites and view them on the Favorites page.

---

### Pick Your Night

The Pick Your Night page lets users compare favorite events in a face-off style flow until one final winner remains.

---

### Statistics

The Statistics page shows backend-calculated analytics such as:

* events per category
* free vs paid events
* comment statistics
* most commented events
* comments by user

Statistics are calculated on the backend using Prisma queries.

---

### Split View

The Split View page shows:

* event list
* visual statistics
* real-time updates

It is useful for demonstrating live data behavior together with charts.

---

### Real-time chat

The app includes a real-time chat system.

Chat features:

* Socket.IO real-time communication
* MongoDB persistence
* old messages loaded from MongoDB
* live messages broadcast to all connected clients
* JWT-authenticated socket connection
* admin-only Delete Chat button
* chat clearing broadcast live to connected users

Chat messages are stored in MongoDB.

---

### NoSQL database

MongoDB Atlas is used as the NoSQL database for chat messages.

The chat messages collection stores:

```text
roomId
userId
userName
message
createdAt
```

---

### Action logging

The app stores important user actions in PostgreSQL.

Logged actions include:

```text
LOGIN_SUCCESS
LOGIN_FAILED
REGISTER_SUCCESS
PERMISSION_DENIED
EVENT_CREATED
EVENT_UPDATED
EVENT_DELETED
COMMENT_CREATED
COMMENT_DELETED
CHAT_MESSAGE_SENT
CHAT_CLEARED
```

Logs are stored in:

```text
action_logs
```

---

### Suspicious user detection

The backend detects suspicious behavior based on user action logs.

Detection rules:

```text
3 permission denied attempts in 10 minutes
5 delete actions in 10 minutes
10 chat messages in 1 minute
```

When suspicious behavior is detected, the user is added to:

```text
suspicious_users
```

Admins can view suspicious users in the Observation List page and mark them as:

```text
ACTIVE
REVIEWED
DISMISSED
```

---

### Observation List

The admin-only Observation List page displays:

* suspicious users
* reason for detection
* suspicious score
* status
* recent action logs
* review button
* dismiss button

Only users with the correct permissions can access this page.

---

### HTTPS and two-machine network setup

The app supports HTTPS local development using self-signed certificates.

The project can be demonstrated with:

```text
Laptop/server machine:
- PostgreSQL
- backend
- frontend dev server

Second client machine:
- phone / another laptop
- browser opens the frontend using the server machine LAN IP
```

Example:

```text
https://172.20.10.3:5173
```

The frontend communicates with the backend over HTTPS:

```text
https://172.20.10.3:3000
```

---

### Offline support

The frontend includes offline behavior for event data.

When the backend is unavailable:

* cached data is used
* local changes can be queued
* queued operations synchronize when connectivity is restored

---

### REST and GraphQL support

The project supports both:

* REST API
* GraphQL API

The frontend can be switched between API modes through the service abstraction layer.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Socket.IO Client
* Recharts
* Lucide React
* CSS page-level styling
* LocalStorage for auth/session/offline queue

### Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* MongoDB Atlas
* Mongoose
* Socket.IO
* GraphQL / Apollo Server
* JWT / jsonwebtoken
* bcrypt
* Faker
* HTTPS self-signed certificates

### Testing and tooling

* Jest
* Supertest
* ts-jest
* Nodemon
* TSX
* Prisma Studio
* Thunder Client / Postman

---

## Project Structure

```text
happening-app/
  backend/
  frontend/
  certs/
```

---

## Frontend Structure

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

### Important frontend folders

#### `components/`

Reusable UI components such as:

* Navbar
* Logo
* Event cards
* Insight cards
* layout components
* permission wrapper components

#### `pages/`

Route-level pages such as:

* LoginPage
* RegisterPage
* EventsTablePage
* EventsCardsPage
* EventDetailsPage
* AddEventPage
* EditEventPage
* FavoritesPage
* StatisticsPage
* SplitViewPage
* PickYourNightPage
* ChatPage
* ObservationListPage

#### `context/`

Contains global frontend state providers:

* `AuthContext`
* `EventsContext`

`AuthContext` handles:

* current logged-in user
* JWT token storage
* login
* register
* logout
* permission checks
* role checks
* inactivity logout

`EventsContext` handles:

* event state
* favorites
* online/offline behavior
* CRUD orchestration
* offline queue sync

#### `services/`

Contains API abstraction files, including:

* auth API
* REST events API
* GraphQL events API
* chat API
* logs API

#### `utils/`

Contains helper logic for:

* cookies
* cached events
* offline queue
* local storage utilities

---

## Backend Structure

```text
backend/src/
  controllers/
  db/
  graphql/
  middleware/
  models/
  routes/
  services/
  utils/
  validators/
  app.ts
  server.ts
  socket.ts
```

### Important backend folders

#### `controllers/`

REST controller logic for:

* auth
* events
* comments
* categories
* stats
* generator
* chat
* logs

#### `db/`

Prisma client setup.

#### `graphql/`

GraphQL schema, resolvers, and registration.

#### `middleware/`

Authentication and authorization middleware:

* JWT token authentication
* permission checking

#### `models/`

MongoDB/Mongoose models, including the chat message model.

#### `routes/`

Express route definitions for:

```text
/auth
/events
/comments
/categories
/stats
/generator
/chat
/logs
/graphql
```

#### `services/`

Reusable backend services:

* logging service
* suspicious behavior detection service
* generator service

#### `utils/`

Utility modules such as JWT token creation and verification.

#### `validators/`

Validation logic for:

* event input
* comment input

---

## Database Design

### PostgreSQL

PostgreSQL stores the relational application data.

Main tables:

```text
users
roles
permissions
user_roles
role_permissions
categories
events
comments
action_logs
suspicious_users
```

### MongoDB

MongoDB stores real-time chat messages.

Main collection:

```text
chat_messages
```

---

## Prisma

The project uses Prisma ORM for PostgreSQL.

Important files:

```text
backend/prisma/schema.prisma
backend/prisma/seed.ts
backend/prisma/migrations/
```

Useful commands:

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
npx prisma studio
```

---

## Environment Variables

### Backend `.env`

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/happening_db?schema=public"

MONGO_URL="mongodb+srv://your_mongodb_user:your_password@your_cluster.mongodb.net/happening_chat?appName=happening-chat"

JWT_SECRET="happening_super_secret_dev_key_2026"
```

### Frontend `.env`

Create:

```text
frontend/.env
```

For local laptop-only testing:

```env
VITE_API_URL=https://localhost:3000
```

For LAN/hotspot testing with another device:

```env
VITE_API_URL=https://YOUR_LAPTOP_IP:3000
```

Example:

```env
VITE_API_URL=https://172.20.10.3:3000
```

Every time you change Wi-Fi or hotspot, the laptop IP may change, so update `VITE_API_URL` and restart the frontend.

---

## HTTPS Certificates

The app uses self-signed certificates for local HTTPS development.

Certificates are stored in:

```text
certs/
  happening-key.pem
  happening-cert.pem
```

Generate them from the project root using Git Bash:

```bash
mkdir -p certs

MSYS_NO_PATHCONV=1 openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365 \
  -keyout certs/happening-key.pem \
  -out certs/happening-cert.pem \
  -subj "/CN=localhost"
```

If using Git Bash and path conversion causes problems, use:

```bash
-subj "//CN=localhost"
```

Do not upload real production certificates or private keys publicly.

---

## How to Set Up the Project

### 1. Clone the repository

```bash
git clone https://github.com/unteajessica/happening-app.git
cd happening-app
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

Open a second terminal:

```bash
cd frontend
npm install
```

### 4. Create backend `.env`

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/happening_db?schema=public"
MONGO_URL="your_mongodb_connection_string"
JWT_SECRET="happening_super_secret_dev_key_2026"
```

### 5. Create frontend `.env`

Create:

```text
frontend/.env
```

For local testing:

```env
VITE_API_URL=https://localhost:3000
```

For network testing:

```env
VITE_API_URL=https://YOUR_LAPTOP_IP:3000
```

### 6. Generate Prisma client and run migrations

From `backend/`:

```bash
npx prisma generate
npx prisma migrate dev
```

### 7. Seed the database

From `backend/`:

```bash
npx prisma db seed
```

This creates default data, including:

```text
admin@test.com / admin123
user@test.com / user123
```

### 8. Generate HTTPS certificates

From the project root:

```bash
mkdir -p certs

MSYS_NO_PATHCONV=1 openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365 \
  -keyout certs/happening-key.pem \
  -out certs/happening-cert.pem \
  -subj "/CN=localhost"
```

### 9. Start the backend

From `backend/`:

```bash
npm run dev
```

Backend runs on:

```text
https://localhost:3000
```

or, on the network:

```text
https://YOUR_LAPTOP_IP:3000
```

### 10. Start the frontend

From `frontend/`:

```bash
npm run dev
```

Frontend runs on:

```text
https://localhost:5173
```

or, on the network:

```text
https://YOUR_LAPTOP_IP:5173
```

---

## Browser Certificate Warning

Because the project uses a self-signed HTTPS certificate, the browser may show:

```text
Your connection is not private
```

For local development, click:

```text
Advanced → Proceed
```

Do this once for the backend:

```text
https://localhost:3000/events?page=1&limit=6
```

or:

```text
https://YOUR_LAPTOP_IP:3000/events?page=1&limit=6
```

Then open the frontend:

```text
https://localhost:5173
```

or:

```text
https://YOUR_LAPTOP_IP:5173
```

---

## Running on Two Devices

To demonstrate client/server separation:

### Server machine

Run on the laptop:

```bash
cd backend
npm run dev
```

and:

```bash
cd frontend
npm run dev
```

### Client machine

Open the frontend from a second device, such as a phone:

```text
https://YOUR_LAPTOP_IP:5173
```

Example:

```text
https://172.20.10.3:5173
```

The frontend calls the backend at:

```text
https://YOUR_LAPTOP_IP:3000
```

This demonstrates that the client and server are running on different machines on the same LAN/hotspot.

---

## Default Accounts

After seeding, these accounts are available:

### Admin

```text
Email: admin@test.com
Password: admin123
Role: ADMIN
```

### Regular user

```text
Email: user@test.com
Password: user123
Role: USER
```

---

## Available Scripts

### Backend

From `backend/`:

```bash
npm run dev
```

Starts the backend development server.

```bash
npm run build
```

Builds the TypeScript backend.

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

```bash
npx prisma db seed
```

Resets and seeds the database.

```bash
npx prisma studio
```

Opens Prisma Studio.

---

### Frontend

From `frontend/`:

```bash
npm run dev
```

Starts the Vite frontend development server.

```bash
npm run build
```

Builds the frontend.

```bash
npm run preview
```

Previews the production build.

---

## API Overview

### Auth

```text
POST /auth/login
POST /auth/register
```

### Events

```text
GET    /events
GET    /events/:id
POST   /events
PUT    /events/:id
DELETE /events/:id
```

Protected event mutations require JWT and admin permissions.

### Comments

```text
GET    /comments/event/:eventId
POST   /comments
DELETE /comments/:commentId
```

Comment creation requires authentication.

Comment deletion requires admin permission.

### Statistics

```text
GET /stats/categories
GET /stats/pricing
GET /stats/comments
```

### Chat

```text
GET    /chat/messages
DELETE /chat/messages
```

Chat messages are also sent live through Socket.IO.

### Logs

```text
GET /logs
GET /logs/suspicious-users
PUT /logs/suspicious-users/:id/review
PUT /logs/suspicious-users/:id/dismiss
```

Logs and suspicious users endpoints are admin-only.

---

## API Modes

The frontend can use:

```text
REST
GraphQL
```

The active mode is controlled in the frontend service switch file.

Example:

```ts
const API_MODE = "rest";
// const API_MODE = "graphql";
```

---

## Real-Time Communication

Socket.IO is used for:

* live chat
* chat clearing
* generator/live updates

Chat socket events include:

```text
chat:send-message
chat:new-message
chat:cleared
chat:error
```

The Socket.IO connection is authenticated with the JWT token.

---

## Testing

The backend uses Jest and Supertest.

Run all tests:

```bash
cd backend
npm test
```

Run coverage:

```bash
npm run test:coverage
```

The tests cover:

* authentication
* registration
* JWT-protected routes
* authorization failures
* events
* comments
* categories
* statistics
* validators
* generator
* database behavior

After running tests, reset the database for demo mode:

```bash
npx prisma db seed
```

---

## Test Coverage

Coverage output is printed in the terminal after:

```bash
npm run test:coverage
```

The HTML coverage report is generated in:

```text
backend/coverage/lcov-report/index.html
```

Open this file in the browser to inspect coverage by file.

---

## Demo Checklist

Final Checklist:

```text
1. Start PostgreSQL service.
2. Confirm MongoDB Atlas connection works.
3. Run backend with HTTPS.
4. Run frontend with HTTPS.
5. Open backend HTTPS URL and accept certificate warning.
6. Open frontend HTTPS URL and accept certificate warning.
7. Login as admin.
8. Login as user on a second device.
9. Test chat between both devices.
10. Show admin-only permissions.
11. Show Observation List.
12. Run test coverage.
13. Reset database with npx prisma db seed.
```

---

## Notes

* PostgreSQL must be running locally for the backend to work.
* MongoDB Atlas is cloud-based and does not need to be started manually.
* pgAdmin is optional and only used to inspect the database.
* Prisma Studio can also be used to inspect database tables.
* Because HTTPS uses a self-signed certificate, the browser warning is expected.
* When changing Wi-Fi or hotspot, update `frontend/.env` with the new laptop IP.
* After tests, run `npx prisma db seed` to restore demo data.

---

## Author

Built as a fullstack academic project to demonstrate:

* frontend development
* backend development
* REST and GraphQL APIs
* PostgreSQL with Prisma
* MongoDB NoSQL persistence
* JWT authentication
* role-based authorization
* HTTPS network communication
* two-device LAN/hotspot deployment
* real-time communication
* testing and coverage
* suspicious activity detection
* admin monitoring tools

```
```
