# Graph Report - .  (2026-08-18)

## Corpus Check
- Corpus is ~38,023 words - fits in a single context window. You may not need a graph.

## Summary
- 256 nodes · 253 edges · 9 communities detected
- Extraction: 67% EXTRACTED · 33% INFERRED · 0% AMBIGUOUS · INFERRED: 84 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin Dashboard Management|Admin Dashboard Management]]
- [[_COMMUNITY_API Routes & Endpoints|API Routes & Endpoints]]
- [[_COMMUNITY_Authentication & Security|Authentication & Security]]
- [[_COMMUNITY_Id Route Delete|Id Route Delete]]
- [[_COMMUNITY_Event Registration Flow|Event Registration Flow]]
- [[_COMMUNITY_UI Components & Hooks|UI Components & Hooks]]
- [[_COMMUNITY_Contact & Support|Contact & Support]]
- [[_COMMUNITY_Hooks Use Fetch|Hooks Use Fetch]]
- [[_COMMUNITY_Home & Landing Components|Home & Landing Components]]

## God Nodes (most connected - your core abstractions)
1. `toast()` - 27 edges
2. `dbConnect()` - 21 edges
3. `verifyAdminAuth()` - 17 edges
4. `sanitizeString()` - 12 edges
5. `PUT()` - 9 edges
6. `sanitizeObject()` - 9 edges
7. `DELETE()` - 8 edges
8. `POST()` - 5 edges
9. `POST()` - 5 edges
10. `POST()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `sitemap()` --calls--> `dbConnect()`  [INFERRED]
  src\app\sitemap.ts → src\lib\mongodb.ts
- `handleLogin()` --calls--> `toast()`  [INFERRED]
  src\app\(site)\admin\auth\page.tsx → src\hooks\use-toast.ts
- `handleSignup()` --calls--> `toast()`  [INFERRED]
  src\app\(site)\admin\auth\page.tsx → src\hooks\use-toast.ts
- `handleUpdateHero()` --calls--> `toast()`  [INFERRED]
  src\app\(site)\admin\dashboard\page.tsx → src\hooks\use-toast.ts
- `handleUpdateCounters()` --calls--> `toast()`  [INFERRED]
  src\app\(site)\admin\dashboard\page.tsx → src\hooks\use-toast.ts

## Communities

### Community 0 - "Admin Dashboard Management"
Cohesion: 0.07
Nodes (26): fetchRegistrations(), handleAddAnnouncement(), handleAddArchitect(), handleAddDay(), handleAddEvent(), handleAddSponsor(), handleCancelArchitectEdit(), handleCancelEdit() (+18 more)

### Community 1 - "API Routes & Endpoints"
Cohesion: 0.07
Nodes (24): GET(), POST(), sitemap(), handleLogin(), handleSignup(), GET(), GET(), POST() (+16 more)

### Community 2 - "Authentication & Security"
Cohesion: 0.19
Nodes (10): createAdminSessionToken(), getSecretKey(), hashPassword(), verifyAdminSessionToken(), verifyPassword(), checkRateLimit(), getClientIp(), POST() (+2 more)

### Community 3 - "Id Route Delete"
Cohesion: 0.43
Nodes (2): DELETE(), PUT()

### Community 4 - "Event Registration Flow"
Cohesion: 0.4
Nodes (2): handleSubmit(), validate()

### Community 5 - "UI Components & Hooks"
Cohesion: 0.47
Nodes (4): addToRemoveQueue(), dispatch(), genId(), reducer()

### Community 6 - "Contact & Support"
Cohesion: 0.5
Nodes (2): handleSubmit(), validate()

### Community 7 - "Hooks Use Fetch"
Cohesion: 0.5
Nodes (2): useFetch(), AnnouncementDetailPage()

### Community 8 - "Home & Landing Components"
Cohesion: 1.0
Nodes (3): calculateTimeLeft(), getTargetTimestamp(), updateTimer()

## Knowledge Gaps
- **Thin community `Id Route Delete`** (8 nodes): `DELETE()`, `PUT()`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`, `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Event Registration Flow`** (6 nodes): `Field()`, `handleSubmit()`, `set()`, `updateTimer()`, `validate()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Contact & Support`** (5 nodes): `handleSubmit()`, `InputField()`, `set()`, `validate()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Hooks Use Fetch`** (4 nodes): `useFetch()`, `AnnouncementDetailPage()`, `page.tsx`, `use-fetch.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toast()` connect `Admin Dashboard Management` to `API Routes & Endpoints`, `UI Components & Hooks`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `sanitizeString()` connect `API Routes & Endpoints` to `Authentication & Security`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `dbConnect()` connect `API Routes & Endpoints` to `Authentication & Security`, `Id Route Delete`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 24 inferred relationships involving `toast()` (e.g. with `handleLogin()` and `handleSignup()`) actually correct?**
  _`toast()` has 24 INFERRED edges - model-reasoned connections that need verification._
- **Are the 20 inferred relationships involving `dbConnect()` (e.g. with `sitemap()` and `GET()`) actually correct?**
  _`dbConnect()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `verifyAdminAuth()` (e.g. with `GET()` and `POST()`) actually correct?**
  _`verifyAdminAuth()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `sanitizeString()` (e.g. with `handleLogin()` and `handleSignup()`) actually correct?**
  _`sanitizeString()` has 10 INFERRED edges - model-reasoned connections that need verification._