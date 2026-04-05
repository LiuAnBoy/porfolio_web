# Codex Review Fixes (Wave 1-3)

Review 來源：Codex review on `635d786..3e72cdb`

---

## BUG (必修)

- [x] **#1 `src/lib/admin-auth.ts`** — `requireAdminAuth` 未驗證 admin 身份，任何登入用戶可存取管理端點
  - 判斷：此專案只有一個 admin user，現行邏輯已足夠（有 session = admin）。**不需修改**，但加上註解說明設計意圖。

- [x] **#6 `src/models/Position.ts`** — `IPosition.updatedAt` 宣告 `number` 但 schema default 是 `null`，型別衝突
  - 修正：改為 `updatedAt: number | null`

- [x] **#8 `src/types/project.ts`** — `ProjectData` 型別與公開 API 回傳格式不符（admin 含完整資料，public strip 掉 timestamps）
  - 修正：新增 `PublicProjectData` 型別給公開 API，保留 `ProjectData` 給 admin

- [x] **#10 `src/types/user.ts`** — `UserData` / `ExperienceWithPositions` 的 avatar/companyIcon 型別與公開 API 不符
  - 修正：新增 `PublicUserData` / `PublicExperienceData` 給公開 API

## WARNING (應修)

- [x] **#2 `src/lib/cloudinary.ts`** — Buffer 上傳一律標 `data:image/png`，非 PNG 格式 MIME type 錯誤
  - 修正：接受 mime type 參數，或改用 Cloudinary auto-detect

- [x] **#3 `src/lib/cloudinary.ts`** — Cloudinary 環境變數缺少啟動時驗證
  - 修正：加上 early-fail check（同 mongodb.ts 模式）

- [x] **#7 `src/types/api.ts`** — `ApiResponse<T>` 的 `data` 是 required，但 error response 不含 `data`
  - 修正：`data` 改為 optional 或新增 `ApiErrorResponse` 型別

- [x] **#9 `src/types/project.ts`** — `ProjectListParams.type` 寬化為 `string`
  - 判斷：query string 本來就是 string，server 端做驗證即可。**不需修改**。

- [x] **#11 `src/types/user.ts`** — `SOCIAL_PLATFORM` 重複定義在 types 和 models
  - 修正：models/User.ts 改為 import from `@/types/user`

## 已知限制 (不修)

- **#4 `src/lib/rate-limit.ts`** — in-memory rate limiter 不適用 serverless
  - 設計決策：目前部署在單一 Ubuntu Server，in-memory 足夠。spec 已記載。

- **#5 `src/lib/mongodb.ts`** — 無條件 `tls: true`
  - 設計決策：MongoDB Atlas 強制 TLS，本地開發也連 Atlas。符合需求。

---

## 執行順序

1. ~~先修 BUG #6, #8, #10（型別問題）~~ ✅
2. ~~再修 WARNING #2, #3, #7, #11（品質問題）~~ ✅
3. ~~加註解 #1~~ ✅
4. 更新相關 docs
