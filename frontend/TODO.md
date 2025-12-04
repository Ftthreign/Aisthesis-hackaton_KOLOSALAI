# Frontend TODO List - AISTHESIS

Based on the Hackathon.md requirements.

## ✅ Completed

- [x] Setup Next.js, Tailwind, Shadcn
- [x] Landing Page
- [x] Login Page (Google OAuth via NextAuth)
- [x] Dashboard layout with header
- [x] Upload Page UI
- [x] Setup NextAuth (Google OAuth)
- [x] Setup API client (client + server)
- [x] Setup TanStack React Query

---

## 🚧 In Progress

### Upload Feature

- [ ] Connect upload form to backend `POST /analysis`
- [ ] Show upload progress/loading state
- [ ] Handle upload errors
- [ ] Redirect to analysis result page after success

---

## 📋 TODO

### Dashboard / Analysis Result Page (`/dashboard/[id]`)

- [ ] Create dynamic route `/dashboard/[id]`
- [ ] Fetch analysis data from `GET /history/{id}`
- [ ] Render all analysis sections:
  - [ ] Vision Result (image preview + detected info)
  - [ ] Product Story (name, tagline, descriptions, IG captions)
  - [ ] Taste & Aroma (profiles, sensory persona, pairings)
  - [ ] Smart Pricing (price range, reasoning, promo strategy)
  - [ ] Brand Theme (colors, tone, style suggestions)
  - [ ] SEO (keywords, hashtags) with copy button
  - [ ] Marketplace Descriptions (Shopee, Tokopedia, Instagram) with copy button
  - [ ] Buyer Persona (name, bio, demographics, motivations)
  - [ ] Packaging Tips
  - [ ] 7-Day Action Plan
- [ ] Copy to clipboard functionality for text sections
- [ ] Export PDF button (`GET /export/pdf/{id}`)
- [ ] Export JSON button (`GET /export/json/{id}`)

### History Page (`/history`)

- [ ] Create `/history` route
- [ ] Fetch list from `GET /history`
- [ ] Display analysis cards with:
  - [ ] Image thumbnail
  - [ ] Created date
  - [ ] Link to detail
- [ ] Delete analysis button (`DELETE /history/{id}`)
- [ ] Empty state when no history
- [ ] Pagination (if needed)

### History Detail Page (`/history/[id]`)

- [ ] Create `/history/[id]` route
- [ ] Reuse analysis result components from dashboard
- [ ] Back to history button

### Auth Improvements

- [ ] Verify JWT with backend `GET /auth/verify`
- [ ] Handle auth errors gracefully
- [ ] Session refresh handling

### UI/UX Polish

- [ ] Loading skeletons for data fetching
- [ ] Error boundaries and error states
- [ ] Toast notifications for actions (copy, delete, export)
- [ ] Responsive design testing
- [ ] Dark/Light mode consistency

### State Management

- [ ] React Query hooks for API calls
- [ ] Optimistic updates for delete
- [ ] Cache invalidation strategy

---

## 📁 Route Structure

```
/                     → Landing Page ✅
/login                → Login Page ✅
/dashboard            → Dashboard Home ✅
/dashboard/upload     → Upload Page ✅
/dashboard/[id]       → Analysis Result (TODO)
/history              → History List (TODO)
/history/[id]         → History Detail (TODO)
```

---

## 🔗 API Endpoints to Integrate

| Feature           | Method | Endpoint            | Status |
| ----------------- | ------ | ------------------- | ------ |
| Auth Verify       | GET    | `/auth/verify`      | ⏳     |
| Upload + Analysis | POST   | `/analysis`         | ⏳     |
| List History      | GET    | `/history`          | ⏳     |
| Detail History    | GET    | `/history/{id}`     | ⏳     |
| Delete History    | DELETE | `/history/{id}`     | ⏳     |
| Export PDF        | GET    | `/export/pdf/{id}`  | ⏳     |
| Export JSON       | GET    | `/export/json/{id}` | ⏳     |

---

## 📦 Components to Build

### Analysis Result Components

- [ ] `VisionCard` - Display detected image info
- [ ] `StoryCard` - Product name, tagline, descriptions
- [ ] `TasteCard` - Taste/aroma profiles
- [ ] `PricingCard` - Pricing recommendations
- [ ] `BrandThemeCard` - Color palette, style
- [ ] `SEOCard` - Keywords and hashtags
- [ ] `MarketplaceCard` - Platform-specific descriptions
- [ ] `PersonaCard` - Buyer persona info
- [ ] `PackagingCard` - Packaging suggestions
- [ ] `ActionPlanCard` - 7-day plan

### Shared Components

- [ ] `CopyButton` - Copy text to clipboard
- [ ] `ExportButtons` - PDF/JSON download
- [ ] `HistoryCard` - History list item
- [ ] `LoadingSkeleton` - Loading states
- [ ] `ErrorState` - Error display
- [ ] `ConfirmDialog` - Delete confirmation

---

## 📅 Timeline Reference

- **Dec 1**: Setup ✅
- **Dec 2**: Upload UI + Vision integration
- **Dec 3**: Story, Taste, Pricing render
- **Dec 4**: Branding suite (Theme, SEO, Marketplace, Packaging)
- **Dec 5**: Persona, Action Plan
- **Dec 6**: History + Export
- **Dec 7**: Testing & Submission
