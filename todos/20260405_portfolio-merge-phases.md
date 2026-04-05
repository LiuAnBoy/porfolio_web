# Portfolio Merge — Phase Status

> 分支: `feat/migration-dashboard-merge` | 基於 spec: `docs/superpowers/specs/2026-04-05-portfolio-merge-design.md`

---

## Phase 1: Backend Integration ✅ Complete

- [x] 安裝 backend 依賴（mongoose, next-auth, cloudinary, bcryptjs, jose, pinyin-pro, react-query）
- [x] Shared types (`src/types/`)
- [x] Lib utilities (`src/lib/` — mongodb, auth, cloudinary, cors, rate-limit, transaction, admin-auth）
- [x] Axios client wrapper (`src/services/client.ts`)
- [x] Providers（MuiProvider, ReactQueryProvider, EmotionCacheProvider）
- [x] Config（next.config.ts, robots.ts, theme.ts）
- [x] Mongoose models (`src/models/`)
- [x] Codex review fixes（8 items: types, cloudinary, admin-auth, User model）
- [x] NextAuth route handler
- [x] Public API routes（`/api/v1/projects`, `/api/v1/user/me`）
- [x] Admin API routes（`/api/v1/admin/*` — 14 route files）
- [x] Proxy / rate limiting（`src/proxy.ts`，Next.js 16 naming）
- [x] Public services client（`src/services/projects/`, `src/services/user/`）
- [x] Build verification ✅

**Commits:** `3ca37e8..da8b2f6`（13 commits）

---

## Phase 2: Public Frontend Refactor ✅ Complete

目標：將公開頁面的檔案結構對齊 spec，遷移到 modules/ 架構。

- [x] Route group: `(main)` → `(public)`
- [x] 遷移 `src/components/` → `src/modules/public/*/components/`
- [x] 重整 `src/shared/layouts/` → `src/shared/components/layouts/public/`
- [x] 清理無用檔案（`src/components/`、`src/stores/`、`src/shared/layouts/`）
- [x] Build verification ✅

**詳細 plan:** `docs/superpowers/plans/2026-04-05-portfolio-merge-phase2.md`

---

## Phase 3: Admin Dashboard (MUI Rewrite) ✅ Complete

目標：用 MUI 重寫整個 admin 後台，使用 React Query。

- [x] Admin layout + sidebar + header（`src/shared/components/layouts/admin/`）
- [x] Login page（`src/app/(auth)/admin/login/`）
- [x] Dashboard module（`src/modules/admin/dashboard/`）
- [x] Projects module — list, create, edit（`src/modules/admin/projects/`）
- [x] Tags module（`src/modules/admin/tags/`）
- [x] Stacks module（`src/modules/admin/stacks/`）
- [x] Images module（`src/modules/admin/images/`）
- [x] User / Experiences module（`src/modules/admin/user/`）
- [x] Build verification ✅ (0 errors, 3 lint warnings only)

---

## Phase 4: Cleanup

目標：移除所有過渡期殘留，驗證完整流程。

- [x] 移除不再需要的依賴
- [x] 清理 dead code
- [x] 更新環境變數文件
- [x] 更新 README
- [ ] Full flow test（public + admin）
