# System Design Document (SDD)
## Tech-Kurukhetra

### 1. System Architecture Overview
The platform uses a modern, serverless architecture based on Next.js. It follows a decoupled design where the frontend handles presentation and SSR, while Firebase manages data persistence and Google GenAI handles intelligent computations.

### 2. Components
* **Frontend Layer (Client/Server Components):** Next.js 15 App Router using React 19. Handles routing, data fetching, and UI rendering (Radix UI + Tailwind).
* **Backend API Layer:** Next.js Route Handlers (`/app/api/*`) for secure server-side logic and third-party integrations.
* **Database & Auth:** Firebase & Firebase Admin SDK.
* **AI Service:** `@genkit-ai/google-genai` integration for intelligent endpoints.

### 3. Data Flow
1. **User Request:** User accesses the Next.js frontend.
2. **Authentication:** Authenticated via Firebase Auth. Token is passed to Next.js server via cookies.
3. **API Call:** Frontend invokes Next.js API Routes.
4. **Data Retrieval/AI:**
   * Firebase Admin queries Firestore for persistent data.
   * Genkit AI handles processing for AI features.
5. **Response:** Data is formatted and returned to the client, utilizing Next.js caching where applicable.

### 4. Database Schema (Firestore Conceptual)
* `users`: UID, Name, Email, Role (Admin/Participant), CreatedAt
* `events`: EventID, Title, Description, Date, Status
* `registrations`: RegID, UserID, EventID, Status

### 5. Security & Deployment
* **Security:** API keys hidden in `.env`, strict CORS on API, Firebase Security Rules, JWT validation via Firebase Admin.
* **Deployment:** Targeted for Vercel/Firebase Hosting to utilize Edge functions.
