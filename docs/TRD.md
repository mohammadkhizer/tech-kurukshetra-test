# Technical Requirements Document (TRD)
## Tech-Kurukhetra

### 1. Technology Stack
* **Framework:** Next.js 15.5.12
* **Library:** React 19.2.1
* **Language:** TypeScript 5
* **Styling:** Tailwind CSS 3.4.1, `tailwindcss-animate`, `tailwind-merge`, `clsx`
* **UI Components:** Radix UI Primitives, Lucide React (Icons), Embla Carousel, React Day Picker
* **Data Visualization:** Recharts
* **State Management / Forms:** React Hook Form, Zod
* **Backend Services:** Firebase 11.9.1, Firebase Admin 13.0.0
* **AI & Machine Learning:** Genkit (`genkit`), Google GenAI (`@genkit-ai/google-genai`)

### 2. Development Environment
* **Node Version:** >= 20.x
* **Package Manager:** npm / pnpm
* **Linting & Formatting:** ESLint (Next.js preset)
* **Type Checking:** `tsc --noEmit`

### 3. Environment Variables
Required `.env` configurations:
* `NEXT_PUBLIC_FIREBASE_API_KEY`
* `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
* `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
* `FIREBASE_CLIENT_EMAIL` (Admin)
* `FIREBASE_PRIVATE_KEY` (Admin)
* `GOOGLE_GENAI_API_KEY` (For Genkit)

### 4. Key Libraries & Utilities
* **Date Manipulation:** `date-fns`
* **QR Generation:** `qrcode`
* **Animations:** `framer-motion`, `tailwindcss-animate`
* **Genkit Scripts:** Running `genkit:dev` for local AI testing (`src/ai/dev.ts`)

### 5. Deployment Pipeline
* **Build Command:** `NODE_ENV=production next build`
* **Hosting:** Vercel (recommended for Next.js 15) or Firebase App Hosting
* **CI/CD:** GitHub Actions to run `npm run lint` and `npm run typecheck` before deployment.
