# Portfolio 後台管理系統設計文件

> **類型：** 後台設計文件
> **分支：** `feat/migration-dashboard-merge`
> **前身：** `dashboard_mongodb`（Ant Design）→ 用 MUI 全面改寫
> **參考：** 完整遷移 spec 見 `docs/superpowers/specs/2026-04-05-portfolio-merge-design.md`

---

## 1. 技術架構

| 項目 | 決策 |
|------|------|
| UI 框架 | MUI（與前台共用） |
| 表單管理 | React Hook Form |
| 表格 | MUI Table（非 DataGrid） |
| 通知系統 | notistack → `useNotification` hook |
| 富文本編輯器 | Tiptap（toolbar 用 MUI IconButton 重寫） |
| 日期處理 | dayjs |
| 狀態管理 | React Query（TanStack Query） |
| 認證 | NextAuth v5 server-side `auth()` |
| HTTP Client | 沿用 `src/services/client.ts`（axios, baseURL: `/api`） |

### 新增依賴

```
react-hook-form
notistack
dayjs
@tiptap/react
@tiptap/starter-kit
@tiptap/extension-link
```

---

## 2. 配色策略

**前後台共用 MUI dark mode 色盤，元件樣式各自獨立。**

Root layout 的 `MuiProvider` 提供統一 theme，後台元件透過 `sx` 或 `styled()` 做局部覆寫。

| Token | Value | 用途 |
|-------|-------|------|
| `background.default` | `#0a0a0a` | 頁面背景 |
| `background.paper` | `#121212` | 卡片、Sidebar、Dialog |
| `text.primary` | `#fff` | 主要文字 |
| `text.secondary` | `rgba(255,255,255,0.7)` | 次要文字 |
| `primary.main` | `#90caf9` | 按鈕、連結、active 狀態 |
| `divider` | `rgba(255,255,255,0.12)` | 分隔線 |

Phase 3 不修改 `src/styles/theme.ts`。

---

## 3. 路由結構

```
src/app/
├── (auth)/
│   ├── layout.tsx                         # 置中佈局，無 sidebar/header
│   └── admin/login/page.tsx               # 登入頁
│
├── (admin)/admin/
│   ├── layout.tsx                         # Auth guard + Providers + Prefetch
│   ├── dashboard/page.tsx                 # 儀表板
│   ├── projects/
│   │   ├── page.tsx                       # 作品列表
│   │   ├── create/page.tsx                # 新增作品
│   │   └── [id]/page.tsx                  # 編輯作品
│   ├── tags/page.tsx                      # 標籤管理
│   ├── stacks/page.tsx                    # 技術棧管理
│   ├── images/page.tsx                    # 圖片管理
│   └── user/page.tsx                      # 使用者/經歷管理
```

所有後台頁面設定 `robots: 'noindex, nofollow'`。

---

## 4. Provider 堆疊

```
(admin)/admin/layout.tsx（server component）
  ├── auth() → 無 session → redirect('/admin/login')
  ├── prefetchQuery(['tags'], getTagList)
  ├── prefetchQuery(['stacks'], getStackList)
  └── <ReactQueryProvider>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            <AdminLayout>
              {children}
            </AdminLayout>
          </SnackbarProvider>
        </HydrationBoundary>
      </ReactQueryProvider>
```

`MuiProvider` 已在 root `layout.tsx`，無需重複包裝。

---

## 5. 認證流程

1. 使用者訪問 `/admin/*`
2. `(admin)/admin/layout.tsx` 呼叫 `auth()`（NextAuth v5 server-side）
3. 無 session → `redirect('/admin/login')`
4. 登入頁：`signIn('credentials', { email, password, redirect: false })`
5. 成功 → `router.push('/admin/dashboard')`
6. API routes 用 `auth()` 驗證 session，無 session → 401

不使用 Authorization header（與 `dashboard_mongodb` 的 JWT header 不同，NextAuth cookie 由瀏覽器自動帶上）。

---

## 6. 後台佈局

```
┌──────────────────────────────────────────────┐
│  AdminHeader (AppBar, h=64)                  │
├────────┬─────────────────────────────────────┤
│        │                                     │
│ Sidebar│  Content area                       │
│ (240px)│  (scrollable, padding)              │
│        │                                     │
│  Logo  │  <PageHeader title="..." />         │
│  Menu  │  {children}                         │
│  items │                                     │
│        │                                     │
└────────┴─────────────────────────────────────┘
```

### AdminSidebar

- 固定寬度 240px，mobile 用 MUI Drawer 收合
- 頂部 Logo/標題：「Portfolio Admin」
- MUI List + ListItemButton 導航
- 選單項目：
  - 儀表板（Dashboard）— DashboardIcon
  - 作品管理（Projects）— WorkIcon
  - 標籤管理（Tags）— LabelIcon
  - 技術棧管理（Stacks）— LayersIcon
  - 圖片管理（Images）— ImageIcon
  - 使用者管理（User）— PersonIcon
- `usePathname()` 偵測當前路由高亮

### AdminHeader

- MUI AppBar（fixed，offset sidebar 寬度）
- 左側：hamburger menu（mobile 才顯示）
- 右側：使用者 email + Logout IconButton
- Logout 呼叫 `signOut({ callbackUrl: '/admin/login' })`

---

## 7. 共用元件（`src/shared/components/common/`）

### 7.1 BaseTable

封裝 MUI Table，統一分頁、loading skeleton、空狀態。

```typescript
interface BaseTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

interface ColumnDef<T> {
  key: string;
  label: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => ReactNode;
}
```

功能：TableHead + TableBody（或 skeleton 3 rows）+ 空狀態 Typography + TablePagination。

### 7.2 BaseModal

封裝 MUI Dialog，統一標題、內容、操作按鈕。

```typescript
interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;       // 預設 '確認'
  cancelText?: string;        // 預設 '取消'
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}
```

功能：DialogTitle（含關閉 IconButton）+ DialogContent（scrollable）+ DialogActions（loading 時 confirm 按鈕顯示 CircularProgress）。

### 7.3 ConfirmDialog

繼承 BaseModal，用於刪除/破壞性操作確認。

```typescript
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;             // 預設 '確認刪除'
  message: string;
  loading?: boolean;
}
```

功能：Warning icon + 紅色 confirm 按鈕。

### 7.4 PageHeader

頁面標題列 + 可選操作按鈕。

```typescript
interface PageHeaderProps {
  title: string;
  action?: ReactNode;
}
```

功能：Typography h5 + Divider + action 靠右對齊。

### 7.5 FileUpload

圖片上傳元件，內部使用 `useUpload` hook。

```typescript
interface FileUploadProps {
  value: ImageValue | ImageValue[] | null;
  onChange: (value: ImageValue | ImageValue[] | null) => void;
  multiple?: boolean;
  module: 'projects' | 'user' | 'experiences';
  maxFiles?: number;
}

interface ImageValue {
  imageId: string;
  url: string;
}
```

功能：拖放區域 + 點擊選檔 + 預覽縮圖 + 移除按鈕 + CircularProgress + 檔案驗證（image/*, size limit）。
內部呼叫 `useUpload()` 處理上傳、`useDeleteImage()` 處理移除。

### 7.6 RichTextEditor

Tiptap 編輯器 + MUI 風格 toolbar。

```typescript
interface RichTextEditorProps {
  value: string;              // HTML 內容
  onChange: (html: string) => void;
  placeholder?: string;
}
```

Toolbar：Bold, Italic, Strikethrough, Link, Heading, BulletList, OrderedList, Undo, Redo — 全部用 MUI IconButton + MUI Icons。
從 `dashboard_mongodb/src/shared/components/editor/` 遷移並重寫。

### 7.7 StatusChip

標準化 MUI Chip。

```typescript
interface StatusChipProps {
  label: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
}
```

用於：作品類型、圖片 model、featured/visible 狀態。

### Barrel Export

```typescript
// src/shared/components/common/index.ts
export { BaseTable } from './BaseTable';
export type { ColumnDef } from './BaseTable';
export { BaseModal } from './BaseModal';
export { ConfirmDialog } from './ConfirmDialog';
export { PageHeader } from './PageHeader';
export { FileUpload } from './FileUpload';
export { RichTextEditor } from './RichTextEditor';
export { StatusChip } from './StatusChip';
```

---

## 8. 共用 Hooks（`src/shared/hooks/`）

### 8.1 useNotification

封裝 notistack `useSnackbar`。

```typescript
function useNotification(): { notify: NotifyMethods };

interface NotifyMethods {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// 使用方式
const { notify } = useNotification();
notify.success('建立成功');
notify.error('刪除失敗');
```

### 8.2 useUpload

封裝圖片上傳邏輯。

```typescript
interface UseUploadOptions {
  module: 'projects' | 'user' | 'experiences';
  onSuccess?: (image: ImageValue) => void;
  onError?: (error: Error) => void;
}

function useUpload(options: UseUploadOptions): {
  upload: (file: File) => Promise<ImageValue>;
  isUploading: boolean;
};
```

呼叫 `POST /api/v1/admin/upload`（FormData），回傳 `{ imageId, url }`。

### 8.3 useDeleteImage

封裝圖片刪除。

```typescript
function useDeleteImage(): {
  deleteImage: (imageId: string) => Promise<void>;
  isDeleting: boolean;
};
```

呼叫 `DELETE /api/v1/admin/images/{id}`。

---

## 9. 功能模組

每個模組統一結構：

```
src/modules/admin/{module}/
├── components/     # 頁面元件 + 子元件
├── hooks/          # React Query hooks
├── services/       # API 呼叫函式
└── types/          # 模組專用型別
```

### 9.1 Login（`src/modules/admin/auth/`）

| 項目 | 說明 |
|------|------|
| Route | `(auth)/admin/login/page.tsx` |
| 元件 | `LoginForm` — Card + TextField(email, password) + Button |
| 表單 | React Hook Form 驗證 |
| 認證 | `signIn('credentials', { ... })` |
| 錯誤顯示 | MUI Alert |
| 成功 | redirect `/admin/dashboard` |

### 9.2 Dashboard（`src/modules/admin/dashboard/`）

| 項目 | 說明 |
|------|------|
| Route | `(admin)/admin/dashboard/page.tsx` |
| Service | `getDashboardInit()` → `GET /api/v1/admin/init` |
| Hook | `useDashboardQuery()` |
| 元件 | `DashboardContent` — 4 張統計卡片（Grid）+ 最近項目列表 |

統計卡片：Projects / Tags / Stacks / Images，各含數量 + icon + 連結到管理頁。

### 9.3 Projects（`src/modules/admin/projects/`）

| Route | 說明 |
|-------|------|
| `/admin/projects` | 作品列表（ProjectTable） |
| `/admin/projects/create` | 新增作品（ProjectForm） |
| `/admin/projects/[id]` | 編輯作品（ProjectForm 預填） |

**Services:**

| 函式 | 端點 |
|------|------|
| `getProjectList(params)` | `GET /api/v1/admin/projects` |
| `getProjectDetail(id)` | `GET /api/v1/admin/projects/{id}` |
| `createProject(payload)` | `POST /api/v1/admin/projects` |
| `updateProject(id, payload)` | `PATCH /api/v1/admin/projects/{id}` |
| `deleteProject(id)` | `DELETE /api/v1/admin/projects/{id}` |

**Hooks:** `useProjectList`, `useProjectDetail`, `useCreateProject`, `useUpdateProject`, `useDeleteProject`, `useToggleFeatured`, `useToggleVisible`

**ProjectTable 欄位：** Cover（縮圖）、Title、Type（StatusChip）、Tags（Chip list）、Stacks（Chip list）、Featured（Switch）、Visible（Switch）、Actions（Edit/Delete）

**ProjectForm 欄位（React Hook Form）：**
- title, slug（pinyin-pro 自動產生）, description（RichTextEditor）
- type（Select: WEB/APP/HYBRID）
- cover（FileUpload 單張）, gallery（FileUpload 多張）
- tags（Autocomplete multi）, stacks（Autocomplete multi）
- featured（Switch）, visible（Switch）
- link, partner（TextField）

### 9.4 Tags（`src/modules/admin/tags/`）

| 項目 | 說明 |
|------|------|
| Route | `/admin/tags` |
| 元件 | `TagTable`（BaseTable）+ `TagModal`（BaseModal + RHF） |
| CRUD | getTagList / createTag / updateTag / deleteTag |
| 欄位 | label（slug 自動產生） |

### 9.5 Stacks（`src/modules/admin/stacks/`）

與 Tags 結構相同，端點為 `/api/v1/admin/stacks`。

### 9.6 Images（`src/modules/admin/images/`）

| 項目 | 說明 |
|------|------|
| Route | `/admin/images` |
| 元件 | `ImageTable`（BaseTable + Filter row） |
| 功能 | 上傳（FileUpload）、篩選（isPending / model）、編輯 alt、刪除 |
| 分頁 | 20 / page |
| Hooks | `useImageList(params)`, `useUpdateImage`, `useDeleteImage` |

Filter row：isPending Select（待使用/已使用）+ model Select（USER/EXPERIENCE/PROJECT）。

### 9.7 User（`src/modules/admin/user/`）

| 項目 | 說明 |
|------|------|
| Route | `/admin/user` |
| 元件 | `UserPage`（MUI Tabs: Profile / Experiences） |

**ProfileTab（React Hook Form）：**
- name, email（readonly）, title
- bio（RichTextEditor）
- avatar（FileUpload 單張）
- socials（動態 FieldArray: platform Select + url TextField）

**ExperienceTab：**
- BaseTable：company, companyIcon, positions count, sn, actions
- `ExperienceModal`（BaseModal + RHF）：company, companyIcon（FileUpload）, positions（nested FieldArray: title, startAt, endAt, isCurrent, description）
- 排序：上下移動按鈕

**Services:** getUser / updateUser / getExperiences / createExperience / updateExperience / deleteExperience / reorderExperiences

---

## 10. 檔案結構總覽

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   └── admin/login/page.tsx
│   ├── (admin)/admin/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── tags/page.tsx
│   │   ├── stacks/page.tsx
│   │   ├── images/page.tsx
│   │   └── user/page.tsx
│
├── modules/admin/
│   ├── auth/components/LoginForm.tsx
│   ├── dashboard/
│   │   ├── components/DashboardContent.tsx
│   │   ├── hooks/useDashboardQuery.ts
│   │   ├── services/dashboard.ts
│   │   └── types/index.ts
│   ├── projects/
│   │   ├── components/{ProjectTable, ProjectForm}.tsx
│   │   ├── hooks/useProjectQueries.ts
│   │   ├── services/project.ts
│   │   └── types/index.ts
│   ├── tags/
│   │   ├── components/{TagTable, TagModal}.tsx
│   │   ├── hooks/useTagQueries.ts
│   │   ├── services/tag.ts
│   │   └── types/index.ts
│   ├── stacks/
│   │   ├── components/{StackTable, StackModal}.tsx
│   │   ├── hooks/useStackQueries.ts
│   │   ├── services/stack.ts
│   │   └── types/index.ts
│   ├── images/
│   │   ├── components/ImageTable.tsx
│   │   ├── hooks/useImageQueries.ts
│   │   ├── services/image.ts
│   │   └── types/index.ts
│   └── user/
│       ├── components/{UserPage, ProfileTab, ExperienceTab, ExperienceModal}.tsx
│       ├── hooks/useUserQueries.ts
│       ├── services/user.ts
│       └── types/index.ts
│
├── shared/
│   ├── components/
│   │   ├── common/
│   │   │   ├── BaseTable.tsx
│   │   │   ├── BaseModal.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── StatusChip.tsx
│   │   │   └── index.ts
│   │   └── layouts/
│   │       ├── admin/
│   │       │   ├── AdminLayout.tsx
│   │       │   ├── AdminSidebar.tsx
│   │       │   ├── AdminHeader.tsx
│   │       │   └── index.ts
│   │       └── public/ (既有)
│   └── hooks/
│       ├── useNotification.ts
│       ├── useUpload.ts
│       ├── useDeleteImage.ts
│       └── index.ts
│
├── providers/
│   └── ReactQueryProvider.tsx  (既有)
│
└── styles/
    └── theme.ts               (不修改)
```
