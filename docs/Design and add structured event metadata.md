Design and add structured event metadata for the following events, following
this schema for every entry:

{
  id: string (slug, e.g. "hackathon"),
  name: string,
  category: "TECH" | "NON-TECH",
  type: "solo" | "team",
  teamSize: { min: number, max: number },   // 1,1 for solo
  description: string (2-3 lines),
  rules: string[] (bullet points),
  venue: string,
  date: string (ISO date),
  time: string,
  duration: string,
  entryFee: number | "Free",
  prizePool: string,
  coordinatorContact: { name: string, phone: string, email: string },
  bannerImage: string (path/URL placeholder),
  registrationDeadline: string (ISO date)
}

Populate one entry per event below, using these team-size defaults (adjust if
your actual rules differ — these are standard-competition defaults, not
confirmed for this event):

TECH:
- Hackathon        → team, size 5
- Project Showcase → team, size 1-2
- Workshop         → solo, size 1
- Code Sprint      → solo, size 1
- Digital Forensics Hunt → solo, size 1

NON-TECH:
- BGMI             → team, size 4-4 (squad)
- Free Fire        → team, size 4-4 (squad)
- Night Life Performances → team, size 1-10 (solo or group act)
- Treasure Hunt    → team, size 5 
- Quiz             → team, size 2
- Cricket          → team, size 8-10 (playing 8 + substitutes 2)
- Volleyball       → team, size 6-8 (playing 6 + substitutes 2)

Requirements:
1. Store this as a single source-of-truth data file (JSON/TS/DB seed —
   match whatever the project already uses for the Arenas page), not scattered
   across components.
2. The Arenas page must render both categories (TECH / NON-TECH) as separate
   filterable sections/tabs, pulling from this data — no hardcoded event cards.
3. Each event card links to its detail page (uses dynamic routing from
   task #3 in the other prompt file) using the event's `id`.
4. Leave `rules`, `venue`, `time`, `prizePool`, and `coordinatorContact` as
   clearly marked placeholders for me to fill in real values — do not invent
   fake prize amounts or contact details.
5. Report the final file path and structure so I can review before content
   goes live.



   Investigate the Webpack "Serializing big strings (111-112kiB)" cache warning
appearing during dev compilation of /admin/dashboard. This is a performance
warning, not a functional bug — do not treat it with the same urgency as a
500 error.

1. Identify which module/file is producing the large string(s) — likely
   candidates: the event metadata data file (from task #8, now holding TECH +
   NON-TECH event objects with descriptions/rules), a large embedded SVG/icon
   set, or a bundled JSON import.
2. If it's the event metadata file: confirm this is expected at current size
   (a handful of events with 2-3 line descriptions and rule arrays shouldn't
   hit 111kiB — if it does, check for accidentally duplicated data, base64-
   encoded images stored inline instead of as URLs, or unminified content).
3. If it's legitimately large content (e.g. this is where bannerImage is
   accidentally storing base64 image data instead of a URL string), move it
   out — images/binary data should never live in the same module as
   JSON/text data.
4. This is a dev-only cache warning and does not need a production fix unless
   the root cause (e.g. base64 images inline) is also a real problem for
   production bundle size — if so, fix that as a separate, correctly-scoped
   task.
5. Report what file/data is triggering this and whether it's expected size
   or a genuine bloat issue before making any changes.

Fix the Runtime Error on /admin/dashboard: "Invalid src prop
(https://techaura26.netlify.app/Assets/users.jpg) on `next/image`, hostname
'&' is not configured" — occurring in the sponsors list render
(src/app/(site)/admin/dashboard/page.tsx, ~line 911).

Two separate issues to fix:

1. HTML-entity decoding bug:
   - Find where `sponsor.logoUrl` is stored/fetched and trace why it contains
     literal HTML entities (&#x2F; instead of /) at render time.
   - Check `decodeHtmlEntities()` — confirm it's actually decoding correctly,
     being called on the right value, and not being skipped/bypassed. If the
     source data is double-encoded (encoded once at save-time, then encoded
     again somewhere in the render pipeline), fix the double-encoding at its
     source rather than adding a second decode call as a patch.
   - Sponsor/logo URLs should be stored as plain, valid URL strings in the
     database — encode only at the point of display if truly needed (e.g.
     inside raw HTML), never store pre-encoded.

2. Dummy/foreign data check:
   - The URL "techaura26.netlify.app" is NOT this project's domain — check
     every sponsor record in the database for URLs pointing to this or any
     other unrelated domain. This is very likely leftover seed/template data,
     not a real sponsor.
   - Remove or flag any sponsor entries with logoUrl/data pointing to
     non-project domains — cross-reference with the dummy-data cleanup done
     earlier; this one was missed because sponsors weren't in that audit's
     scope.
   - Confirm with me which sponsor entries are real before deleting anything
     — list them out first.

3. Once only legitimate sponsor logo URLs remain, update next.config.js
   `images.remotePatterns` (or `domains`, depending on Next.js version) to
   explicitly whitelist only the actual hostnames you'll load sponsor logos
   from (e.g. your own CDN/asset host, or specific sponsor-provided domains)
   — do not wildcard all hostnames, that defeats the purpose of the allowlist
   and is a security/cost risk (arbitrary external images proxied through
   your Next.js image optimizer).

4. Add a fallback: if `sponsor.logoUrl` is empty, malformed, or fails to load,
   render a placeholder/default logo box instead of crashing the whole
   dashboard render — one bad sponsor record should not break the entire
   page.

Report: which decoding bug caused the entity issue, the full list of sponsor
records found (real vs. dummy), and the final next.config.js image host
allowlist.







Update the Admin "Add Arena" form so it fully matches the event metadata schema
already used by the Arenas page and Registration form. Current form has:
Event Name, Event Category (bug: only shows "Technical"), Festival Day, Start
Time, Location, Event Description, Event Head, Event Rules (add-list), 
Registration Fee, Event Organiser Contact (optional), Event Logo/Image URL.

Fixes and additions required:

1. Fix Event Category dropdown: must show both "TECH" and "NON-TECH" — currently
   only Technical is selectable, blocking admins from adding non-tech arenas
   (BGMI, Cricket, Volleyball, etc.) entirely.

2. Add slug/id field: auto-generate from Event Name (kebab-case, e.g. "Digital
   Forensics Hunt" → "digital-forensics-hunt") on blur, but keep it editable —
   admin can override before saving. Must be unique; validate against existing
   arena ids and block save with a clear error if duplicate.

3. Add Event Type field: radio/toggle for "Solo" vs "Team". Solo events auto-set
   teamSize to {min:1, max:1} and hide the team-size inputs. Team events reveal:
   - Min Team Size (number input)
   - Max Team Size (number input)
   - Validate max >= min, and both >= 1, before allowing save.

4. Add Duration field (text or number+unit, e.g. "3 hours", "2 days") — separate
   from Start Time.

5. Add Registration Deadline field (date picker) — separate from Festival Day,
   since deadline is typically before the event day.

6. Add Prize Pool field (text, e.g. "₹15,000" or "Certificates only") — currently
   missing entirely from the form.

7. Split "Event Organiser Contact" into three required sub-fields: Contact Name,
   Contact Phone, Contact Email — matching the coordinatorContact schema. Make
   this required, not optional — an arena with no working contact is a support
   gap for participants during the event.

8. Keep existing fields as-is: Event Name, Festival Day (maps to `date`), Start
   Time, Location (maps to `venue`), Event Description, Event Head, Event Rules
   add-list (maps to `rules[]`), Registration Fee (maps to `entryFee` — allow
   either a number or a "Free" toggle), Event Logo/Image URL (maps to
   `bannerImage`).

9. On save, the form must write a complete object matching this exact schema
   (no partial/missing fields silently defaulting to empty):
   { id, name, category, type, teamSize: {min, max}, description, rules,
     venue, date, time, duration, entryFee, prizePool, coordinatorContact:
     {name, phone, email}, bannerImage, registrationDeadline }

10. Add inline validation before submit: required fields cannot be empty,
    teamSize.max >= teamSize.min, registrationDeadline must be on or before
    the Festival Day, email field must be valid email format, phone must be
    valid format.

11. Add a live preview panel (or preview button) showing how the arena card
    will render on the public Arenas page, before the admin commits the save —
    catches bad descriptions/images before they go live.

Report which fields were added, which existing field(s) you fixed (the
category dropdown bug), and confirm the saved object matches the schema
exactly before this is wired to the live Arenas page.