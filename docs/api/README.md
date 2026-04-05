# API Documentation

Base URL: `/api/v1`

All timestamps are Unix epoch (seconds).

---

## Response Format Conventions

### GET (no pagination)

Returns the resource directly as a JSON object or array.

```json
{ "id": "...", "name": "..." }
```

### GET (paginated)

```json
{
  "payload": [...],
  "total_count": 50,
  "page_size": 20,
  "page": 1
}
```

Query params: `page` (default: 1), `page_size` (default: 20, max: 100)

### POST / PATCH / DELETE

```json
{ "success": true }
```

Error:

```json
{ "success": false, "message": "描述錯誤原因" }
```

### Upload (special)

```json
{ "success": true, "payload": { "imageId": "...", "url": "..." } }
```

---

## Authentication

Admin routes (`/api/v1/admin/*`) use **NextAuth session cookies**.  
Public routes (`/api/v1/projects`, `/api/v1/user/me`) require no authentication.

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request / missing fields |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong user) |
| 404 | Resource not found |
| 409 | Conflict (duplicate label/slug) |
| 500 | Internal server error |

---

## Route Groups

| File | Routes |
|------|--------|
| [public.md](./public.md) | `GET /api/v1/user/me`, `GET /api/v1/projects` |
| [admin-dashboard.md](./admin-dashboard.md) | `GET /api/v1/admin/init` |
| [admin-projects.md](./admin-projects.md) | `GET/POST /api/v1/admin/projects`, `GET/PATCH/DELETE /api/v1/admin/projects/[id]` |
| [admin-tags.md](./admin-tags.md) | `GET/POST /api/v1/admin/tags`, `GET/PATCH/DELETE /api/v1/admin/tags/[id]` |
| [admin-stacks.md](./admin-stacks.md) | `GET/POST /api/v1/admin/stacks`, `GET/PATCH/DELETE /api/v1/admin/stacks/[id]` |
| [admin-images.md](./admin-images.md) | `GET /api/v1/admin/images`, `GET/PATCH/DELETE /api/v1/admin/images/[id]`, `POST /api/v1/admin/upload` |
| [admin-user.md](./admin-user.md) | `GET/PATCH /api/v1/admin/user/[uId]`, Experiences CRUD, `PATCH .../experiences/sn` |
