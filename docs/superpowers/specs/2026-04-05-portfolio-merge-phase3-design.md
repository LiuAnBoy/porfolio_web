# Portfolio Merge Phase 3: Admin Dashboard (MUI Rewrite)

## Goal

Build the complete admin dashboard by rewriting the `dashboard_mongodb` Ant Design UI into MUI, using React Query for server state, React Hook Form for forms, and notistack for notifications. Reuse the frontend's dark color palette for visual consistency.

## Technical Decisions

| Item | Decision |
|------|----------|
| UI library | MUI (already installed) |
| Form management | React Hook Form |
| Table | MUI Table (not DataGrid) |
| Notification | notistack, wrapped in `useNotification` hook |
| Rich text editor | Tiptap (restyle toolbar with MUI IconButton) |
| Date library | dayjs |
| State management | React Query (TanStack Query) |
| Auth | NextAuth v5 server-side `auth()` check |

## New Dependencies

```
react-hook-form
notistack
dayjs
@tiptap/react
@tiptap/starter-kit
@tiptap/extension-link
```

## Theme Strategy

**Shared color palette, independent component styles.**

The admin dashboard reuses the frontend's MUI dark mode palette defined in `src/styles/theme.ts`. Both `(public)` and `(admin)` route groups share the same `MuiProvider` in the root layout, so they inherit the same palette.

Admin-specific component overrides (sidebar, header, tables, etc.) are handled via `sx` props or `styled()` — NOT by creating a separate theme. The palette (background, text, primary, secondary colors) stays unified.

**Palette reference (dark mode):**

| Token | Value | Usage |
|-------|-------|-------|
| background.default | `#0a0a0a` | Page background |
| background.paper | `#121212` | Cards, sidebar, dialogs |
| text.primary | `#fff` | Primary text |
| text.secondary | `rgba(255,255,255,0.7)` | Secondary text |
| primary.main | MUI dark default `#90caf9` | Buttons, links, active states |
| divider | `rgba(255,255,255,0.12)` | Borders, dividers |

No theme file changes needed for Phase 3.

---

## Route Architecture

```
src/app/
├── (auth)/admin/login/page.tsx          # Login (no auth required)
├── (admin)/admin/
│   ├── layout.tsx                       # Auth guard + providers + prefetch
│   ├── dashboard/page.tsx
│   ├── projects/
│   │   ├── page.tsx                     # List
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx               # Edit
│   ├── tags/page.tsx
│   ├── stacks/page.tsx
│   ├── images/page.tsx
│   └── user/page.tsx
```

All admin pages set `robots: 'noindex, nofollow'` via Next.js metadata.

---

## Provider Stack

```
(admin)/admin/layout.tsx (server component)
  ├── auth() → no session → redirect('/admin/login')
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

**Note:** `MuiProvider` is already in root `layout.tsx`, no need to wrap again.

---

## Shared Components (`src/shared/components/common/`)

### BaseTable

Wraps MUI Table with standardized pagination, loading skeleton, and empty state.

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
```

**ColumnDef:**

```typescript
interface ColumnDef<T> {
  key: string;
  label: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => ReactNode;
}
```

**Features:**
- TableHead with column headers
- TableBody with rows or loading skeleton (3 rows)
- Empty state: centered Typography with configurable message
- TablePagination (MUI) at bottom
- Consistent styling across all admin tables

### BaseModal

Wraps MUI Dialog with standardized title, content, and action buttons.

```typescript
interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;       // default: '確認'
  cancelText?: string;        // default: '取消'
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}
```

**Features:**
- DialogTitle with close IconButton
- DialogContent (scrollable)
- DialogActions with cancel/confirm buttons
- Confirm button shows CircularProgress when loading
- Consistent padding and spacing

### ConfirmDialog

Specialized BaseModal for delete/destructive confirmations.

```typescript
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;             // default: '確認刪除'
  message: string;
  loading?: boolean;
}
```

**Features:**
- Warning icon in title
- Red-tinted confirm button
- Renders `message` in DialogContent

### PageHeader

Page title bar with optional action button.

```typescript
interface PageHeaderProps {
  title: string;
  action?: ReactNode;         // e.g., <Button>新增</Button>
}
```

**Features:**
- Typography variant h5 + Divider below
- Action slot aligned right (Flexbox)

### FileUpload

Image upload component that uses `useUpload` hook internally.

```typescript
interface FileUploadProps {
  value: ImageValue | ImageValue[] | null;
  onChange: (value: ImageValue | ImageValue[] | null) => void;
  multiple?: boolean;
  module: 'projects' | 'user' | 'experiences';
  maxFiles?: number;          // only for multiple
}

interface ImageValue {
  imageId: string;
  url: string;
}
```

**Features:**
- Drag-and-drop zone (MUI Box with dashed border)
- Click to select file
- Image preview thumbnails
- Remove button per image
- Uses `useUpload()` hook for upload logic + `useDeleteImage()` for removal
- CircularProgress during upload
- File type validation (image/*) and size limit

### RichTextEditor

Tiptap editor with MUI-styled toolbar.

```typescript
interface RichTextEditorProps {
  value: string;              // HTML content
  onChange: (html: string) => void;
  placeholder?: string;
}
```

**Features:**
- Toolbar: Bold, Italic, Strikethrough, Link, Heading, BulletList, OrderedList, Undo, Redo
- All toolbar buttons are MUI IconButton with MUI icons
- Editor area with border, min-height, and focus ring
- Migrated from `dashboard_mongodb/src/shared/components/editor/`

### StatusChip

Standardized MUI Chip for displaying typed status values.

```typescript
interface StatusChipProps {
  label: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
}
```

Used in: project type badges, image model tags, featured/visible indicators.

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

## Shared Hooks (`src/shared/hooks/`)

### useNotification

Wraps notistack's `useSnackbar` with a cleaner API.

```typescript
// src/shared/hooks/useNotification.ts
interface NotifyMethods {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

function useNotification(): { notify: NotifyMethods };

// Usage:
const { notify } = useNotification();
notify.success('建立成功');
notify.error('刪除失敗');
```

### useUpload

Encapsulates the image upload API call and state.

```typescript
// src/shared/hooks/useUpload.ts
interface UseUploadOptions {
  module: 'projects' | 'user' | 'experiences';
  onSuccess?: (image: ImageValue) => void;
  onError?: (error: Error) => void;
}

interface UseUploadReturn {
  upload: (file: File) => Promise<ImageValue>;
  isUploading: boolean;
}

function useUpload(options: UseUploadOptions): UseUploadReturn;
```

Calls `POST /api/v1/admin/upload` with FormData. Returns `{ imageId, url }`.

### useDeleteImage

Wraps the image delete API call.

```typescript
// src/shared/hooks/useDeleteImage.ts
function useDeleteImage(): {
  deleteImage: (imageId: string) => Promise<void>;
  isDeleting: boolean;
};
```

Calls `DELETE /api/v1/admin/images/{id}`.

---

## Admin Layout (`src/shared/components/layouts/admin/`)

### AdminLayout

Composes Sidebar + Header + Content area.

```typescript
// src/shared/components/layouts/admin/AdminLayout.tsx
interface AdminLayoutProps {
  children: ReactNode;
}
```

**Structure:**

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

```typescript
// src/shared/components/layouts/admin/AdminSidebar.tsx
```

**Features:**
- Fixed width 240px (collapsible on mobile → MUI Drawer)
- Logo/title at top: "Portfolio Admin"
- MUI List with ListItemButton for navigation
- Menu items:
  - 儀表板 (Dashboard) — DashboardIcon
  - 作品管理 (Projects) — WorkIcon
  - 標籤管理 (Tags) — LabelIcon
  - 技術棧管理 (Stacks) — LayersIcon
  - 圖片管理 (Images) — ImageIcon
  - 使用者管理 (User) — PersonIcon
- Active item highlighted with `selected` prop
- `usePathname()` for current route detection

### AdminHeader

```typescript
// src/shared/components/layouts/admin/AdminHeader.tsx
```

**Features:**
- MUI AppBar (position fixed, offset by sidebar width)
- Left: hamburger menu (mobile only, toggles Drawer)
- Right: user email display + Logout IconButton
- Logout calls NextAuth `signOut({ callbackUrl: '/admin/login' })`

### Barrel Export

```typescript
// src/shared/components/layouts/admin/index.ts
export { AdminLayout } from './AdminLayout';
```

---

## Admin Feature Modules

Each module follows the same pattern:

```
src/modules/admin/{module}/
├── components/     # Page-level and sub-components
├── hooks/          # React Query hooks
├── services/       # API call functions
└── types/          # Module-specific types
```

### Module: Login (`src/modules/admin/auth/`)

**Route:** `src/app/(auth)/admin/login/page.tsx`

**Components:**
- `LoginForm.tsx` — MUI Card + TextField (email, password) + Button
  - Uses React Hook Form for validation
  - Calls NextAuth `signIn('credentials', { ... })`
  - Error display with MUI Alert
  - Redirect to `/admin/dashboard` on success

**Layout:** `src/app/(auth)/layout.tsx` — centered on screen, no sidebar/header

### Module: Dashboard (`src/modules/admin/dashboard/`)

**Route:** `src/app/(admin)/admin/dashboard/page.tsx`

**Services:**
- `getDashboardInit()` → `GET /api/v1/admin/init`

**Hooks:**
- `useDashboardQuery()` — fetches dashboard stats

**Types:**
```typescript
interface DashboardData {
  projectCount: number;
  tagCount: number;
  stackCount: number;
  imageCount: number;
  recentProjects: ProjectSummary[];
  recentImages: ImageSummary[];
}
```

**Components:**
- `DashboardContent.tsx` — Stats cards (4x MUI Card in Grid) + recent items lists
- Stats cards: Projects, Tags, Stacks, Images — each with count + icon + link to management page

### Module: Projects (`src/modules/admin/projects/`)

**Routes:**
- `/admin/projects` → ProjectListPage
- `/admin/projects/create` → CreateProjectPage
- `/admin/projects/[id]` → EditProjectPage

**Services:**
- `getProjectList(params)` → `GET /api/v1/admin/projects`
- `getProjectDetail(id)` → `GET /api/v1/admin/projects/{id}`
- `createProject(payload)` → `POST /api/v1/admin/projects`
- `updateProject(id, payload)` → `PATCH /api/v1/admin/projects/{id}`
- `deleteProject(id)` → `DELETE /api/v1/admin/projects/{id}`

**Hooks:**
- `useProjectList(params)` — paginated query
- `useProjectDetail(id)` — single project query
- `useCreateProject()` — mutation + invalidate list
- `useUpdateProject()` — mutation + invalidate list & detail
- `useDeleteProject()` — mutation + invalidate list
- `useToggleFeatured()` — PATCH isFeatured
- `useToggleVisible()` — PATCH isVisible

**Components:**
- `ProjectTable.tsx` — BaseTable with columns:
  - Cover (image thumbnail)
  - Title
  - Type (StatusChip)
  - Tags (Chip list)
  - Stacks (Chip list)
  - Featured (Switch)
  - Visible (Switch)
  - Actions (Edit IconButton, Delete IconButton → ConfirmDialog)
  - PageHeader with "新增" button → navigate to /create
- `ProjectForm.tsx` — React Hook Form
  - Fields: title, slug (auto-generated from title via pinyin-pro), description (RichTextEditor), type (Select), cover (FileUpload single), gallery (FileUpload multiple), tags (Autocomplete multi from query), stacks (Autocomplete multi from query), featured (Switch), visible (Switch), link (TextField), partner (TextField)
  - Submit calls create or update based on mode prop
  - Uses `useNotification` for success/error feedback

### Module: Tags (`src/modules/admin/tags/`)

**Route:** `/admin/tags`

**Services:**
- `getTagList()` → `GET /api/v1/admin/tags`
- `createTag(payload)` → `POST /api/v1/admin/tags`
- `updateTag(id, payload)` → `PATCH /api/v1/admin/tags/{id}`
- `deleteTag(id)` → `DELETE /api/v1/admin/tags/{id}`

**Hooks:**
- `useTagList()` — query (no pagination, full list)
- `useCreateTag()` — mutation
- `useUpdateTag()` — mutation
- `useDeleteTag()` — mutation

**Components:**
- `TagTable.tsx` — BaseTable with columns: label, slug, createdAt, actions
  - PageHeader with "新增" button → opens BaseModal
  - Edit → opens BaseModal with pre-filled form
  - Delete → ConfirmDialog
- `TagModal.tsx` — BaseModal with React Hook Form
  - Fields: label (TextField)
  - Slug auto-generated from label

### Module: Stacks (`src/modules/admin/stacks/`)

Same structure as Tags. Different service endpoints (`/api/v1/admin/stacks`).

### Module: Images (`src/modules/admin/images/`)

**Route:** `/admin/images`

**Services:**
- `getImageList(params)` → `GET /api/v1/admin/images`
- `updateImage(id, payload)` → `PATCH /api/v1/admin/images/{id}`
- `deleteImage(id)` → `DELETE /api/v1/admin/images/{id}`

**Hooks:**
- `useImageList(params)` — paginated query with filters
- `useUpdateImage()` — mutation (edit alt text)
- `useDeleteImage()` — mutation

**Components:**
- `ImageTable.tsx` — BaseTable with columns:
  - Preview (img thumbnail)
  - Alt text
  - Model (StatusChip: USER / EXPERIENCE / PROJECT)
  - Usage count
  - Created date
  - Actions (Edit alt, Delete)
  - Filters row above table: isPending (Select), model (Select)
  - PageHeader with "上傳" button → triggers FileUpload
  - Pagination: 20/page

### Module: User (`src/modules/admin/user/`)

**Route:** `/admin/user`

**Services:**
- `getUser(userId)` → `GET /api/v1/admin/user/{uId}`
- `updateUser(userId, payload)` → `PATCH /api/v1/admin/user/{uId}`
- `getExperiences(userId)` → `GET /api/v1/admin/user/{uId}/experiences`
- `createExperience(userId, payload)` → `POST /api/v1/admin/user/{uId}/experiences`
- `updateExperience(userId, expId, payload)` → `PATCH /api/v1/admin/user/{uId}/experiences/{expId}`
- `deleteExperience(userId, expId)` → `DELETE /api/v1/admin/user/{uId}/experiences/{expId}`
- `reorderExperiences(userId, payload)` → `PATCH /api/v1/admin/user/{uId}/experiences/sn`

**Hooks:**
- `useUser(userId)` — query
- `useUpdateUser()` — mutation
- `useExperiences(userId)` — query
- `useCreateExperience()` — mutation
- `useUpdateExperience()` — mutation
- `useDeleteExperience()` — mutation
- `useReorderExperiences()` — mutation

**Components:**
- `UserPage.tsx` — MUI Tabs: Profile | Experiences
  - Gets userId from session
- `ProfileTab.tsx` — React Hook Form
  - Fields: name, email (readonly), title, bio (RichTextEditor), avatar (FileUpload single), socials (dynamic field array: platform Select + url TextField)
- `ExperienceTab.tsx` — BaseTable + BaseModal
  - Table columns: company, companyIcon, positions count, sn, actions
  - Modal: ExperienceForm with company, companyIcon (FileUpload), positions (nested FieldArray: title, startAt, endAt, isCurrent, description)
  - Reorder via drag or up/down buttons

---

## HTTP Client

Reuse existing `src/services/client.ts` (axios, baseURL: `/api`).

Admin module services call endpoints like `/v1/admin/projects`. The browser sends NextAuth session cookie automatically. API routes validate session via `auth()` from `@/lib/auth`.

No Authorization header injection needed (differs from `dashboard_mongodb` which used JWT in header).

---

## Auth Flow

1. User visits `/admin/*`
2. `(admin)/admin/layout.tsx` calls `auth()` (NextAuth v5 server-side)
3. No session → `redirect('/admin/login')`
4. Login page: `signIn('credentials', { email, password, redirect: false })`
5. Success → `router.push('/admin/dashboard')`
6. All API routes use `auth()` to check session, return 401 if missing

---

## File Structure Summary

```
src/
├── app/
│   ├── (auth)/
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
│   └── (auth)/layout.tsx
│
├── modules/admin/
│   ├── auth/components/LoginForm.tsx
│   ├── dashboard/
│   │   ├── components/DashboardContent.tsx
│   │   ├── hooks/useDashboardQuery.ts
│   │   ├── services/dashboard.ts
│   │   └── types/index.ts
│   ├── projects/
│   │   ├── components/ProjectTable.tsx
│   │   ├── components/ProjectForm.tsx
│   │   ├── hooks/useProjectQueries.ts
│   │   ├── services/project.ts
│   │   └── types/index.ts
│   ├── tags/
│   │   ├── components/TagTable.tsx
│   │   ├── components/TagModal.tsx
│   │   ├── hooks/useTagQueries.ts
│   │   ├── services/tag.ts
│   │   └── types/index.ts
│   ├── stacks/
│   │   ├── components/StackTable.tsx
│   │   ├── components/StackModal.tsx
│   │   ├── hooks/useStackQueries.ts
│   │   ├── services/stack.ts
│   │   └── types/index.ts
│   ├── images/
│   │   ├── components/ImageTable.tsx
│   │   ├── hooks/useImageQueries.ts
│   │   ├── services/image.ts
│   │   └── types/index.ts
│   └── user/
│       ├── components/UserPage.tsx
│       ├── components/ProfileTab.tsx
│       ├── components/ExperienceTab.tsx
│       ├── components/ExperienceModal.tsx
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
│   │       └── public/
│   │           └── (existing)
│   └── hooks/
│       ├── useNotification.ts
│       ├── useUpload.ts
│       ├── useDeleteImage.ts
│       └── index.ts
│
├── providers/
│   └── ReactQueryProvider.tsx    (already exists, admin-only usage)
│
└── styles/
    └── theme.ts                  (no changes, shared dark palette)
```
