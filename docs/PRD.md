# Product Requirements Document (PRD)
## Tech-Kurukhetra

### 1. Introduction
**Project Name:** Tech-Kurukhetra (nextn)
**Vision:** To provide a robust, AI-powered platform tailored for university tech-fests, hackathons, and technology events. It aims to streamline event management, AI-assisted operations, and participant engagement.

### 2. Target Audience
* **Event Organizers:** Need to manage registrations, schedules, and broadcasts efficiently.
* **Participants:** Need to view events, register, use AI for project assistance or queries, and track their progress.
* **Judges & Mentors:** Need to evaluate participants and provide feedback seamlessly.

### 3. Key Features
* **User Authentication:** Secure login using Firebase Auth for participants and admins.
* **Event Dashboard:** Interactive UI built with Radix UI and Recharts to view schedules, leaderboards, and statistics.
* **AI Integration:** Google GenAI-powered assistants to help participants with coding queries, event navigation, and hackathon ideation.
* **Dynamic Forms:** React Hook Form and Zod validation for event registrations.
* **Real-time Updates:** Firebase integration for live updates on schedules, announcements, and results.

### 4. Non-Functional Requirements
* **Performance:** High performance leveraging Next.js 15 Server-Side Rendering (SSR) and Edge networks.
* **Responsiveness:** Mobile-first design using Tailwind CSS.
* **Scalability:** Firebase backend to support traffic spikes during major events.
* **Security:** Secure API endpoints, environment variable protection, and strict Firestore rules.

### 5. Future Roadmap
* Multi-event support
* In-app chat and networking
* Advanced AI auto-evaluation for hackathons
