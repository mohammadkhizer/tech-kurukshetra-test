# ⚡ Tech Kurukshetra

> **The Ultimate National Technical Symposium Platform**  
> Built for **Swami Vivekanand Subharti University (SVGU)** — Faculty of Engineering & Technology.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Genkit AI](https://img.shields.io/badge/Genkit-Google_AI-4285F4?style=flat-square&logo=google)](https://firebase.google.com/docs/genkit)

---

## 📌 Overview

**Tech Kurukshetra** is a modern, high-performance web platform designed to power a large-scale national technical symposium. It features full event registration workflows, arena showcases, real-time announcements, interactive timelines, automated email confirmations with retry queueing, Google Sheets synchronization, and a secure administrative dashboard.

---

## ✨ Key Features

### 🌐 Public Portal
- 🏆 **Event Arenas (`/arenas`)**: Interactive showcase of tech competitions (Coding, Robotics, Web Development, Gaming, Hackathons, and Design).
- 📝 **Registration & Payment Flow (`/register`)**: Multi-step registration forms with Zod input validation, automated payment verification uploading, QR generation, and confirmation emails.
- 📅 **Dynamic Timeline (`/timeline`)**: Real-time event schedule, milestone tracking, and schedule highlights.
- 📢 **Live Announcements (`/announcements`)**: Instant updates, arena alerts, and schedule changes.
- 📬 **Contact & Support (`/contact`)**: In-app query submission with automated admin email notifications.
- 📜 **Legal & Compliance**: Dedicated pages for Code of Conduct, Privacy Protocol, and Terms of Entry.

### 🛡️ Admin Suite (`/admin`)
- 🔒 **Secure Authentication**: Admin session token authentication (`ADMIN_SESSION_SECRET`).
- 📊 **Registrations Management**: View, filter, export, and verify participant registrations.
- 📣 **Announcements Engine**: Broadcast and update real-time festival notifications.
- 📋 **Event & Timeline Control**: Create and modify competition details, schedule slots, and rules.
- 🟢 **Google Sheets Sync**: Real-time export and sync of registration data directly to Google Sheets via Google Apps Script integration.

### 🤖 AI & Background Architecture
- 🧠 **Genkit AI Integration**: Powered by `@genkit-ai/google-genai` for intelligent query resolution and dev tooling.
- 📧 **Resilient Email Queue Processor**: Background worker with exponential backoff retries for reliable SMTP notifications (Nodemailer).
- 🛡️ **Production Safety**: MongoDB connection pooling, strict rate limiting, input sanitization, dynamic layout responsiveness, and full SEO metadata.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **State & Forms**: [React Hook Form](https://react-hook-form.com/), [Zod Schema Validation](https://zod.dev/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose 9](https://mongoosejs.com/)
- **AI Engine**: [Google Genkit Framework](https://firebase.google.com/docs/genkit) (`@genkit-ai/google-genai`)
- **Email Service**: [Nodemailer](https://nodemailer.com/) (SMTP with automated queue processor)
- **Third-Party Sync**: Google Apps Script Webhooks (Google Sheets API sync)

---

## 📂 Repository Structure

```text
tech-kurukshetra-test/
├── src/
│   ├── ai/                 # Genkit AI configurations and dev entrypoint
│   ├── app/                # Next.js App Router structure
│   │   ├── (site)/         # Public & Admin pages
│   │   │   ├── admin/      # Admin dashboard & management pages
│   │   │   ├── announcements/ # Live announcements page & views
│   │   │   ├── arenas/     # Competition showcase pages
│   │   │   ├── contact/    # Contact form page
│   │   │   ├── register/   # Event registration flow
│   │   │   └── timeline/   # Schedule & timeline page
│   │   ├── api/            # API Route handlers (Auth, Registration, Sheets, Admin, etc.)
│   │   └── layout.tsx      # Root application layout
│   ├── components/         # Reusable React UI components
│   │   ├── home/           # Landing page sections & heroes
│   │   ├── layout/         # Header, Navbar, Footer
│   │   └── ui/             # Radix & custom UI primitives
│   ├── data/               # Static event defaults and configurations
│   ├── lib/                # Backend utilities, DB connection, Email service, Models
│   │   ├── models/         # Mongoose Schemas (Registration, Admin, Event, Announcement, etc.)
│   │   ├── email-service.ts# SMTP client & automated email template renderer
│   │   ├── queue-processor.ts # Retry queue manager for email dispatch
│   │   ├── admin-auth.ts   # Session auth & token management
│   │   ├── mongodb.ts      # Mongo connection client with pooling
│   │   └── rate-limit.ts   # Middleware API rate limiting
│   └── middleware.ts       # Next.js route protection & security headers
├── public/                 # Static assets, logos, and media files
├── .env.example            # Environment template configuration
├── next.config.ts          # Next.js build & header configuration
├── tailwind.config.ts      # Custom design tokens & theme specs
└── package.json            # Project dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.17` or higher
- **npm** / **pnpm** / **bun** / **yarn**
- **MongoDB Database**: Local MongoDB instance or MongoDB Atlas Connection URI

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mohammadkhizer/tech-kurukshetra-test.git
   cd tech-kurukshetra-test
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and configure your credentials:
   ```bash
   cp .env.example .env
   ```

   Fill in the required parameters in `.env`:
   ```env
   NEXT_PUBLIC_EVENT_DATE=2027-01-23T00:00:00+05:30
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/techkurukshetra
   ADMIN_SESSION_SECRET=a_very_secure_random_32_character_string_here
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=btech_events@svgu.ac.in
   SMTP_PASS=your_app_password
   ADMIN_NOTIFICATION_EMAIL=btech_events@svgu.ac.in
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Start Genkit AI Developer UI (Optional)**:
   ```bash
   npm run genkit:dev
   ```

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on port `3000`. |
| `npm run build` | Builds the production-optimized application. |
| `npm run start` | Runs the compiled production build server. |
| `npm run lint` | Runs ESLint analysis for code quality checks. |
| `npm run typecheck` | Validates TypeScript types (`tsc --noEmit`). |
| `npm run genkit:dev` | Launches Google Genkit AI developer environment. |
| `npm run genkit:watch` | Launches Genkit AI with file watching enabled. |

---

## 🔒 Security & Best Practices

- **Sanitization**: All user submissions are sanitized via `lib/sanitizer.ts` against XSS and injection.
- **Rate Limiting**: API routes feature IP-based rate limiting via `lib/rate-limit.ts` to block spam and DDoS attacks.
- **Admin Shield**: `/admin` routes require validated session tokens verified by HTTP-only headers and secure secrets.
- **Data Integrity**: Database queries utilize Mongoose schemas with strict TypeScript interfaces.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more details.

Developed with ❤️ for **Faculty of Engineering & Technology, SVGU**.

