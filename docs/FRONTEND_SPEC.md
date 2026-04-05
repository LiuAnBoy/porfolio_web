# Portfolio Frontend 規格書

## 技術棧

| 技術 | 用途 |
|------|------|
| **Next.js** | React 框架、SSR/SSG |
| **shadcn/ui** | UI 元件（可客製） |
| **Tailwind CSS** | 樣式 |
| **GSAP + ScrollTrigger** | 動畫、滾動觸發 |
| **React Query** | API 資料快取 |

---

## 頁面結構

### 整體 Layout

```
┌──────────┬─────────────────────────────────┐
│          │                                 │
│  LOGO    │                                 │
│          │         Content Area            │
│  Home    │         (可滾動)                 │
│          │                                 │
│ Portfolio│                                 │
│          │                                 │
│  About   │                                 │
│          │                                 │
└──────────┴─────────────────────────────────┘
   固定              滾動/切換
```

- **左側 Sidebar**：固定不動，導航選單
- **右側 Content**：根據路由顯示不同內容

---

## 路由規劃

| 路由 | 內容 | 備註 |
|------|------|------|
| `/` | Hero + Featured Projects + Brief Bio | 首頁，可滾動 |
| `/projects` | 專案 Gallery | 列表頁 |
| `/about` | 完整個人檔案 + 經歷 | 詳細介紹 |

### 專案詳情

- **不是獨立路由**
- 使用**側邊滑入 Panel** 呈現
- 從右側滑入，背景 Gallery 變暗

---

## 首頁滾動結構

```
┌─────────────────────────────────┐
│                                 │
│   Section 1: Hero               │
│   - "WEB DEVELOPER" 動畫        │
│   - Tagline                     │
│   - Contact Me 按鈕             │
│   - 滾動指示 ↓                  │
│                                 │
├─────────────────────────────────┤
│                                 │
│   Section 2: Featured Projects  │  ← GSAP 滾動觸發
│   - 精選專案卡片                 │
│   - 進入 Gallery 指引            │
│                                 │
├─────────────────────────────────┤
│                                 │
│   Section 3: Brief Bio          │  ← GSAP 滾動觸發
│   - 簡短自我介紹 (2-3 句)         │
│   - "了解更多" → /about         │
│                                 │
└─────────────────────────────────┘
```

### 滾動互動

- 左側選單隨滾動位置自動 highlight
- 使用 GSAP ScrollTrigger 監聽

```js
ScrollTrigger.create({
  trigger: "#featured-projects",
  start: "top center",
  onEnter: () => setActiveMenu("portfolio"),
  onLeaveBack: () => setActiveMenu("home"),
});
```

---

## 頁面轉場動畫

### 規則

| 導航方向 | 動畫效果 |
|---------|---------|
| **前進**（點擊連結） | 新頁從下往上滑入 ↑ |
| **返回**（回上一頁） | 當前頁往下滑出 ↓ |

### 實作邏輯

1. 點擊連結 → 觸發轉場
2. 新頁從 `y: 100%` 滑入到 `y: 0`
3. 動畫完成後移除舊頁 DOM
4. 視覺效果：新頁覆蓋舊頁

### 程式碼概念

```tsx
const PageTransition = ({ children }) => {
  const isBack = useIsBackNavigation();

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { y: isBack ? "-100%" : "100%" },
      { y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [pathname]);

  return <div ref={containerRef}>{children}</div>;
};
```

---

## 專案詳情 Panel

### 呈現方式

從右側滑入的 Panel，覆蓋部分畫面：

```
┌──────────┬──────────────┬──────────────────┐
│          │              │                  │
│  LOGO    │  Projects    │  Project Detail  │
│          │  Gallery     │  (從右滑入)       │
│  Home    │  (背景變暗)   │                  │
│          │              │  - Cover         │
│ Portfolio│              │  - Description   │
│          │              │  - Stacks        │
│  About   │              │  - Gallery       │
│          │              │  - Link          │
│          │              │       [✕ 關閉]   │
└──────────┴──────────────┴──────────────────┘
```

### 互動

- 點擊專案卡片 → Panel 從右滑入
- 點擊關閉 / 點擊背景 → Panel 滑出
- 不改變 URL（或用 query string `?project=slug`）

### 動畫

```js
// 開啟
gsap.fromTo(panel, { x: "100%" }, { x: 0, duration: 0.4 });

// 關閉
gsap.to(panel, { x: "100%", duration: 0.3 });
```

---

## 導航列行為

### 左側 Sidebar

| 項目 | 連結 | 說明 |
|------|------|------|
| Logo | `/` | 回首頁 |
| Home | `/` | 首頁 |
| Portfolio | `/projects` | 專案列表 |
| About | `/about` | 關於我 |

### Active 狀態

- 根據當前路由 highlight
- 首頁滾動時，根據 section 切換 highlight

### RWD（手機版）

- Sidebar 隱藏，改為漢堡選單
- 或改為底部 Tab Bar

---

## API 串接

使用 React Query 呼叫 Public API：

```tsx
// 取得使用者資料
const { data: user } = useQuery({
  queryKey: ["public-user"],
  queryFn: () => fetch("/api/v1/public/user/me").then(res => res.json()),
});

// 取得專案列表
const { data: projects } = useQuery({
  queryKey: ["public-projects", { page, isFeatured }],
  queryFn: () => fetch(`/api/v1/public/projects?page=${page}&isFeatured=${isFeatured}`).then(res => res.json()),
});
```

---

## 設計風格

| 項目 | 規格 |
|------|------|
| **主色調** | 深色背景 (#1a1a1a 或類似) |
| **強調色** | 藍色 (#5BA4CA 或類似) |
| **字體** | 像素風格標題 + 現代無襯線內文 |
| **動畫** | GSAP 控制，流暢自然 |

---

## 待確認項目

- [ ] 手機版 Sidebar 處理方式
- [ ] 專案詳情 Panel 是否需要 URL 狀態
- [ ] Contact 功能（表單 / 直接連結）
- [ ] 是否需要多語系

---

## 檔案結構建議

```
src/
├── app/
│   ├── layout.tsx          # 主 Layout (含 Sidebar)
│   ├── page.tsx            # 首頁
│   ├── projects/
│   │   └── page.tsx        # 專案列表
│   └── about/
│       └── page.tsx        # 關於我
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── PageTransition.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedProjects.tsx
│   │   └── BriefBio.tsx
│   ├── projects/
│   │   ├── ProjectGrid.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ProjectPanel.tsx   # 側邊滑入詳情
│   └── ui/                    # shadcn/ui 元件
├── hooks/
│   ├── usePublicUser.ts
│   └── usePublicProjects.ts
├── lib/
│   └── gsap.ts               # GSAP 設定
└── styles/
    └── globals.css
```
