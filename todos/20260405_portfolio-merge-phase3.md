# Phase 3: Admin Dashboard (MUI Rewrite)

> **設計文件：** `docs/ADMIN_DASHBOARD_SPEC.md`
> **分支：** `feat/migration-dashboard-merge`（接續 Phase 2）
> **前身：** `dashboard_mongodb`（`/Users/an/Code/portfolio/dashboard_mongodb`）

---

## Task 1: 安裝依賴 + 共用 Hooks

**新增依賴：**

```bash
npm install react-hook-form notistack @tiptap/react @tiptap/starter-kit @tiptap/extension-link
```

（`dayjs`, `@mui/*`, `@tanstack/react-query`, `pinyin-pro` 已安裝）

**Files:**
- Create: `src/shared/hooks/useNotification.ts`
- Create: `src/shared/hooks/useUpload.ts`
- Create: `src/shared/hooks/useDeleteImage.ts`
- Modify: `src/shared/hooks/index.ts`

- [ ] 安裝依賴
- [ ] 建立 `useNotification`（封裝 notistack `useSnackbar` → `notify.success/error/warning/info`）
- [ ] 建立 `useUpload`（呼叫 `POST /api/v1/admin/upload`，回傳 `{ imageId, url }`）
- [ ] 建立 `useDeleteImage`（呼叫 `DELETE /api/v1/admin/images/{id}`）
- [ ] 更新 `src/shared/hooks/index.ts` barrel export
- [ ] Build 驗證
- [ ] Commit: `feat(hooks): add useNotification, useUpload, useDeleteImage`

---

## Task 2: 共用元件（`src/shared/components/common/`）

> 參考設計文件 §7

**Files:**
- Create: `src/shared/components/common/BaseTable.tsx`
- Create: `src/shared/components/common/BaseModal.tsx`
- Create: `src/shared/components/common/ConfirmDialog.tsx`
- Create: `src/shared/components/common/PageHeader.tsx`
- Create: `src/shared/components/common/StatusChip.tsx`
- Create: `src/shared/components/common/FileUpload.tsx`
- Create: `src/shared/components/common/RichTextEditor.tsx`
- Create: `src/shared/components/common/index.ts`

- [ ] 建立 `BaseTable`（MUI Table + ColumnDef + pagination + skeleton + empty state）
- [ ] 建立 `BaseModal`（MUI Dialog + title/close + actions + loading）
- [ ] 建立 `ConfirmDialog`（繼承 BaseModal，warning icon + 紅色 confirm）
- [ ] 建立 `PageHeader`（Typography h5 + Divider + action slot）
- [ ] 建立 `StatusChip`（MUI Chip wrapper）
- [ ] 建立 `FileUpload`（拖放 + 預覽 + 內部呼叫 useUpload/useDeleteImage）
- [ ] 建立 `RichTextEditor`（Tiptap + MUI IconButton toolbar，從 `dashboard_mongodb/src/shared/components/editor/` 遷移重寫）
- [ ] 建立 barrel export `index.ts`
- [ ] Build 驗證
- [ ] Commit: `feat(common): add shared BaseTable, BaseModal, ConfirmDialog, PageHeader, FileUpload, RichTextEditor, StatusChip`

---

## Task 3: Admin Layout（`src/shared/components/layouts/admin/`）

> 參考設計文件 §6

**Files:**
- Create: `src/shared/components/layouts/admin/AdminSidebar.tsx`
- Create: `src/shared/components/layouts/admin/AdminHeader.tsx`
- Create: `src/shared/components/layouts/admin/AdminLayout.tsx`
- Create: `src/shared/components/layouts/admin/index.ts`

- [ ] 建立 `AdminSidebar`（240px fixed，MUI List + ListItemButton，6 個選單項，usePathname 高亮，mobile Drawer）
- [ ] 建立 `AdminHeader`（MUI AppBar，hamburger menu on mobile，右側 email + logout）
- [ ] 建立 `AdminLayout`（組合 Sidebar + Header + Content area）
- [ ] 建立 barrel export `index.ts`
- [ ] Build 驗證
- [ ] Commit: `feat(layout): add admin layout with sidebar and header`

---

## Task 4: Auth + Admin Layout Route

> 參考設計文件 §4, §5

**Files:**
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/app/(auth)/admin/login/page.tsx`
- Create: `src/modules/admin/auth/components/LoginForm.tsx`
- Create: `src/app/(admin)/admin/layout.tsx`
- Create: `src/app/(admin)/admin/dashboard/page.tsx`（先放 placeholder 確認 layout 運作）

- [ ] 建立 `(auth)/layout.tsx`（置中佈局，無 sidebar/header）
- [ ] 建立 `LoginForm`（MUI Card + RHF TextField email/password + Button，`signIn('credentials', {...})`，錯誤顯示 MUI Alert）
- [ ] 建立 `(auth)/admin/login/page.tsx`（渲染 LoginForm）
- [ ] 建立 `(admin)/admin/layout.tsx`：
  - Server component，`auth()` 檢查 session → 無 session redirect `/admin/login`
  - `prefetchQuery(['tags'], ...)` + `prefetchQuery(['stacks'], ...)`
  - Provider stack: `ReactQueryProvider > HydrationBoundary > SnackbarProvider > AdminLayout`
- [ ] 建立 dashboard page placeholder（確認 layout + auth guard 運作）
- [ ] 手動測試：未登入 → redirect login，登入 → 看到 admin layout
- [ ] Build 驗證
- [ ] Commit: `feat(auth): add login page and admin layout with auth guard`

---

## Task 5: Dashboard Module

> 參考設計文件 §9.2

**Files:**
- Create: `src/modules/admin/dashboard/types/index.ts`
- Create: `src/modules/admin/dashboard/services/dashboard.ts`
- Create: `src/modules/admin/dashboard/hooks/useDashboardQuery.ts`
- Create: `src/modules/admin/dashboard/components/DashboardContent.tsx`
- Modify: `src/app/(admin)/admin/dashboard/page.tsx`

- [ ] 建立 types（引用現有 `@/types` 的 `DashboardInitData`）
- [ ] 建立 service `getDashboardInit()` → `GET /api/v1/admin/init`
- [ ] 建立 hook `useDashboardQuery()`
- [ ] 建立 `DashboardContent`（4 張統計 Card in Grid + 最近項目列表）
- [ ] 更新 dashboard page 渲染 DashboardContent
- [ ] Build 驗證
- [ ] Commit: `feat(dashboard): add admin dashboard with stats and recent items`

---

## Task 6: Tags Module

> 參考設計文件 §9.4

**Files:**
- Create: `src/modules/admin/tags/types/index.ts`
- Create: `src/modules/admin/tags/services/tag.ts`
- Create: `src/modules/admin/tags/hooks/useTagQueries.ts`
- Create: `src/modules/admin/tags/components/TagTable.tsx`
- Create: `src/modules/admin/tags/components/TagModal.tsx`
- Create: `src/app/(admin)/admin/tags/page.tsx`

- [ ] 建立 types
- [ ] 建立 services（getTagList / createTag / updateTag / deleteTag）
- [ ] 建立 hooks（useTagList / useCreateTag / useUpdateTag / useDeleteTag）
- [ ] 建立 `TagModal`（BaseModal + RHF，label 欄位，slug 自動產生）
- [ ] 建立 `TagTable`（BaseTable + PageHeader "新增" + Edit/Delete actions + ConfirmDialog）
- [ ] 建立 tags page
- [ ] Build 驗證
- [ ] Commit: `feat(tags): add tag management module`

---

## Task 7: Stacks Module

> 參考設計文件 §9.5（與 Tags 結構相同，端點不同）

**Files:**
- Create: `src/modules/admin/stacks/types/index.ts`
- Create: `src/modules/admin/stacks/services/stack.ts`
- Create: `src/modules/admin/stacks/hooks/useStackQueries.ts`
- Create: `src/modules/admin/stacks/components/StackTable.tsx`
- Create: `src/modules/admin/stacks/components/StackModal.tsx`
- Create: `src/app/(admin)/admin/stacks/page.tsx`

- [ ] 建立 types
- [ ] 建立 services（getStackList / createStack / updateStack / deleteStack）
- [ ] 建立 hooks（useStackList / useCreateStack / useUpdateStack / useDeleteStack）
- [ ] 建立 `StackModal`（BaseModal + RHF，label 欄位）
- [ ] 建立 `StackTable`（BaseTable + CRUD）
- [ ] 建立 stacks page
- [ ] Build 驗證
- [ ] Commit: `feat(stacks): add stack management module`

---

## Task 8: Images Module

> 參考設計文件 §9.6

**Files:**
- Create: `src/modules/admin/images/types/index.ts`
- Create: `src/modules/admin/images/services/image.ts`
- Create: `src/modules/admin/images/hooks/useImageQueries.ts`
- Create: `src/modules/admin/images/components/ImageTable.tsx`
- Create: `src/app/(admin)/admin/images/page.tsx`

- [ ] 建立 types
- [ ] 建立 services（getImageList / updateImage / deleteImage）
- [ ] 建立 hooks（useImageList / useUpdateImage / useDeleteImage）
- [ ] 建立 `ImageTable`（BaseTable + Filter row: isPending Select + model Select + PageHeader "上傳" + FileUpload + 20/page 分頁）
- [ ] 建立 images page
- [ ] Build 驗證
- [ ] Commit: `feat(images): add image management module`

---

## Task 9: Projects Module

> 參考設計文件 §9.3

**Files:**
- Create: `src/modules/admin/projects/types/index.ts`
- Create: `src/modules/admin/projects/services/project.ts`
- Create: `src/modules/admin/projects/hooks/useProjectQueries.ts`
- Create: `src/modules/admin/projects/components/ProjectTable.tsx`
- Create: `src/modules/admin/projects/components/ProjectForm.tsx`
- Create: `src/app/(admin)/admin/projects/page.tsx`
- Create: `src/app/(admin)/admin/projects/create/page.tsx`
- Create: `src/app/(admin)/admin/projects/[id]/page.tsx`

- [ ] 建立 types
- [ ] 建立 services（getProjectList / getProjectDetail / createProject / updateProject / deleteProject）
- [ ] 建立 hooks（useProjectList / useProjectDetail / useCreateProject / useUpdateProject / useDeleteProject / useToggleFeatured / useToggleVisible）
- [ ] 建立 `ProjectTable`（BaseTable，欄位：Cover / Title / Type / Tags / Stacks / Featured Switch / Visible Switch / Actions，PageHeader "新增" → navigate /create）
- [ ] 建立 `ProjectForm`（RHF，欄位：title / slug(pinyin-pro) / description(RichTextEditor) / type(Select) / cover(FileUpload) / gallery(FileUpload multiple) / tags(Autocomplete) / stacks(Autocomplete) / featured / visible / link / partner）
- [ ] 建立 projects list page
- [ ] 建立 create page + edit page（共用 ProjectForm，mode prop 區分）
- [ ] Build 驗證
- [ ] Commit: `feat(projects): add project management module with CRUD`

---

## Task 10: User Module

> 參考設計文件 §9.7

**Files:**
- Create: `src/modules/admin/user/types/index.ts`
- Create: `src/modules/admin/user/services/user.ts`
- Create: `src/modules/admin/user/hooks/useUserQueries.ts`
- Create: `src/modules/admin/user/components/UserPage.tsx`
- Create: `src/modules/admin/user/components/ProfileTab.tsx`
- Create: `src/modules/admin/user/components/ExperienceTab.tsx`
- Create: `src/modules/admin/user/components/ExperienceModal.tsx`
- Create: `src/app/(admin)/admin/user/page.tsx`

- [ ] 建立 types
- [ ] 建立 services（getUser / updateUser / getExperiences / createExperience / updateExperience / deleteExperience / reorderExperiences）
- [ ] 建立 hooks
- [ ] 建立 `ProfileTab`（RHF：name / email(readonly) / title / bio(RichTextEditor) / avatar(FileUpload) / socials(FieldArray: platform + url)）
- [ ] 建立 `ExperienceModal`（BaseModal + RHF：company / companyIcon(FileUpload) / positions(nested FieldArray: title / startAt / endAt / isCurrent / description)）
- [ ] 建立 `ExperienceTab`（BaseTable + ExperienceModal + 排序上下按鈕）
- [ ] 建立 `UserPage`（MUI Tabs: Profile | Experiences，session 取得 userId）
- [ ] 建立 user page
- [ ] Build 驗證
- [ ] Commit: `feat(user): add user and experience management module`

---

## Task 11: Build 驗證 + Lint + 收尾

- [ ] `npx prettier --write` on all new files
- [ ] `npx eslint --fix` on all new files
- [ ] `npm run build` 完整 build
- [ ] 手動測試完整流程：login → dashboard → 各管理頁面 CRUD
- [ ] Commit fix（如有）：`fix: resolve lint and build issues from phase 3`
- [ ] 更新 `todos/20260405_portfolio-merge-phases.md` Phase 3 狀態 → ✅ Complete
- [ ] 更新相關文件（docs/ADMIN_DASHBOARD_SPEC.md 如有差異）
