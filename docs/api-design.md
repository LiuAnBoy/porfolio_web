# API Design Standards

> Detailed API documentation has moved to [`docs/api/`](./api/README.md).  
> Database schema documentation is in [`docs/database/`](./database/README.md).

---

## Response Format Summary

### GET (no pagination)

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

### POST / PATCH / DELETE

Success:
```json
{ "success": true }
```

Error:
```json
{ "success": false, "message": "描述錯誤原因" }
```

### Upload

```json
{ "success": true, "payload": { "imageId": "string", "url": "string" } }
```

---

## Authentication

- **Admin routes** (`/api/v1/admin/*`): NextAuth session cookie required.
- **Public routes** (`/api/v1/projects`, `/api/v1/user/me`): No auth required.

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request / missing fields |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict (duplicate label/slug) |
| 500 | Internal server error |
