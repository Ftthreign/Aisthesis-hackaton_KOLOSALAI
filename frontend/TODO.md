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

## ✅ Upload Feature (Completed)

- [x] Connect upload form to backend `POST /analysis` (using dummy data)
- [x] Show upload progress/loading state
- [x] Handle upload errors
- [x] Redirect to analysis result page after success

---

## ✅ Dashboard / Analysis Result Page (`/dashboard/[id]`) (Completed)

- [x] Create dynamic route `/dashboard/[id]`
- [x] Fetch analysis data from `GET /history/{id}` (using dummy data)
- [x] Render all analysis sections:
  - [x] Vision Result (image preview + detected info)
  - [x] Product Story (name, tagline, descriptions, IG captions)
  - [x] Taste & Aroma (profiles, sensory persona, pairings)
  - [x] Smart Pricing (price range, reasoning, promo strategy)
  - [x] Brand Theme (colors, tone, style suggestions)
  - [x] SEO (keywords, hashtags) with copy button
  - [x] Marketplace Descriptions (Shopee, Tokopedia, Instagram) with copy button
  - [x] Buyer Persona (name, bio, demographics, motivations)
  - [x] Packaging Tips
  - [x] 7-Day Action Plan
- [x] Copy to clipboard functionality for text sections
- [x] Export PDF button (`GET /export/pdf/{id}`) - using dummy
- [x] Export JSON button (`GET /export/json/{id}`) - using dummy

## ✅ History Page (`/history`) (Completed)

- [x] Create `/history` route
- [x] Fetch list from `GET /history` (using dummy data)
- [x] Display analysis cards with:
  - [x] Image thumbnail
  - [x] Created date
  - [x] Link to detail
- [x] Delete analysis button (`DELETE /history/{id}`)
- [x] Empty state when no history
- [ ] Pagination (if needed) - Deferred

## ✅ History Detail Page (`/history/[id]`) (Completed)

- [x] Create `/history/[id]` route
- [x] Reuse analysis result components from dashboard
- [x] Back to history button

## ✅ State Management (Completed)

- [x] React Query hooks for API calls
- [x] Optimistic updates for delete
- [x] Cache invalidation strategy

## ✅ Components Built

### Analysis Result Components

- [x] `VisionCard` - Display detected image info
- [x] `StoryCard` - Product name, tagline, descriptions
- [x] `TasteCard` - Taste/aroma profiles
- [x] `PricingCard` - Pricing recommendations
- [x] `BrandThemeCard` - Color palette, style
- [x] `SEOCard` - Keywords and hashtags
- [x] `MarketplaceCard` - Platform-specific descriptions
- [x] `PersonaCard` - Buyer persona info
- [x] `PackagingCard` - Packaging suggestions
- [x] `ActionPlanCard` - 7-day plan

### Shared Components

- [x] `CopyButton` - Copy text to clipboard
- [x] `CopyBlock` - Copy block with hover button
- [x] `ExportButtons` - PDF/JSON download
- [x] `HistoryCard` - History list item
- [x] `LoadingSkeleton` - Loading states (multiple variants)
- [x] `ErrorState` - Error display
- [x] `ConfirmDialog` - Delete confirmation
- [x] `Badge` - Tags and labels
- [x] `Tabs` - Tab navigation

---

## 📋 TODO (Pending Backend Integration)

### Backend Integration

- [ ] Connect upload form to real backend `POST /analysis`
- [ ] Connect history list to real `GET /history`
- [ ] Connect analysis detail to real `GET /history/{id}`
- [ ] Connect delete to real `DELETE /history/{id}`
- [ ] Connect PDF export to real `GET /export/pdf/{id}`
- [ ] Connect JSON export to real `GET /export/json/{id}`
- [ ] Remove `USE_DUMMY_DATA` flag in hooks.ts

### Auth Improvements

- [ ] Verify JWT with backend `GET /auth/verify`
- [ ] Handle auth errors gracefully
- [ ] Session refresh handling

### UI/UX Polish

- [ ] Toast notifications for actions (copy, delete, export)
- [ ] Responsive design testing
- [ ] Dark/Light mode consistency

### Localization (ID/EN)

- [ ] Setup i18n library (next-intl)
- [ ] Create translation files for Indonesian (id)
- [ ] Create translation files for English (en)
- [ ] Language switcher component in header
- [ ] Translate all UI text (buttons, labels, messages)
- [ ] Translate analysis result sections
- [ ] Persist language preference (localStorage/cookie)

---

## 📁 Route Structure

```
/                     → Landing Page ✅
/login                → Login Page ✅
/dashboard            → Dashboard Home ✅
/dashboard/upload     → Upload Page ✅
/dashboard/[id]       → Analysis Result ✅
/history              → History List ✅
/history/[id]         → History Detail ✅
```

---

## 🔗 API Endpoints to Integrate

| Feature           | Method | Endpoint            | Status |
| ----------------- | ------ | ------------------- | ------ |
| Auth Verify       | GET    | `/auth/verify`      | ⏳     |
| Upload + Analysis | POST   | `/analysis`         | 🔶 Dummy |
| List History      | GET    | `/history`          | 🔶 Dummy |
| Detail History    | GET    | `/history/{id}`     | 🔶 Dummy |
| Delete History    | DELETE | `/history/{id}`     | 🔶 Dummy |
| Export PDF        | GET    | `/export/pdf/{id}`  | 🔶 Dummy |
| Export JSON       | GET    | `/export/json/{id}` | 🔶 Dummy |

Legend: ✅ Done | 🔶 Using Dummy Data | ⏳ Pending

---

## 📅 Timeline Reference

- **Dec 1**: Setup ✅
- **Dec 2**: Upload UI + Vision integration ✅
- **Dec 3**: Story, Taste, Pricing render ✅
- **Dec 4**: Branding suite (Theme, SEO, Marketplace, Packaging) ✅
- **Dec 5**: Persona, Action Plan ✅
- **Dec 6**: History + Export ✅
- **Dec 7**: Testing & Submission

---

## 📝 Notes

- All API calls currently use dummy data via the `USE_DUMMY_DATA` flag in `src/lib/api/hooks.ts`
- To switch to real backend, set `USE_DUMMY_DATA = false` in hooks.ts
- Dummy data is defined in `src/lib/api/dummy-data.ts`
