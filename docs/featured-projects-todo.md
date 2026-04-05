# Featured Projects 置頂功能

## 需求
- Featured 專案永遠顯示在最上面（類似釘選）
- 首次載入要有 15 筆資料
- 之後無限滾動繼續載入剩餘資料

## 實作邏輯

### 首次載入
1. 先呼叫 API `isFeatured=true` 取得所有 featured 專案
2. 計算還需要多少筆：`15 - featuredCount`
3. 呼叫 API `isFeatured=false` 補足差額（使用 PAGE_LIMIT=12 取得，只取需要的數量）
4. 合併：featured 在前，non-featured 在後

### 無限滾動
- 只取 `isFeatured=false` 的下一頁
- 根據已載入的 non-featured 數量計算下一頁：`Math.floor(nonFeaturedLoaded / PAGE_LIMIT) + 1`
- 過濾重複項目避免重複顯示

## 已完成項目

### `src/lib/getData.ts`
- [x] 修改 `getInitialProjects` 函數
- [x] 先取 featured，再補 non-featured 到 15 筆
- [x] 回傳 `nonFeaturedLoaded` 給前端知道已載入多少

### `src/components/projects/ProjectsPage.tsx`
- [x] 修改 `InitialData` 介面，新增 `featuredCount`, `nonFeaturedLoaded`, `nonFeaturedTotal`
- [x] 修改 `fetchNextPage` 只取 `isFeatured=false`，根據已載入數量計算頁碼
- [x] 修改 `handleTypeChange` 過濾器邏輯（重新取得 featured + non-featured）
- [x] 過濾重複項目避免無限循環

## 範例

假設有 5 筆 featured，20 筆 non-featured：

```
首次載入：
- featured: 5 筆 (全部)
- non-featured: 10 筆 (從 page 1 取 12 筆，只用 10 筆)
- 總共: 15 筆

無限滾動：
- nonFeaturedLoaded = 10
- nextPage = floor(10/12) + 1 = 1
- 取得 page 1 (12筆)，過濾掉已有的，加入新的
```

## 狀態：已完成 ✅
