# Admin API — Projects

Requires admin session. Users can only modify their own projects.

---

## GET /api/v1/admin/projects

Returns a paginated list of projects.

**Query Parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| page_size | number | 20 | Items per page (max 100) |
| type | string | — | `WEB`, `APP`, or `HYBRID` |
| isFeatured | boolean | — | Filter featured |
| isVisible | boolean | — | Filter visibility |
| tags | string | — | Comma-separated tag slugs |
| stacks | string | — | Comma-separated stack slugs |

**Response**

```json
{
  "payload": [
    {
      "id": "string",
      "userId": "string",
      "title": "string",
      "slug": "string",
      "description": "string (HTML)",
      "type": "WEB | APP | HYBRID",
      "tags": [{ "id": "string", "label": "string", "slug": "string" }],
      "stacks": [{ "id": "string", "label": "string", "slug": "string" }],
      "cover": { "id": "string", "url": "string" },
      "gallery": [{ "id": "string", "url": "string" }],
      "isFeatured": false,
      "isVisible": true,
      "link": "string | null",
      "partner": "string | null",
      "createdAt": 1700000000,
      "updatedAt": 1710000000
    }
  ],
  "total_count": 12,
  "page_size": 20,
  "page": 1
}
```

---

## POST /api/v1/admin/projects

**Request Body**

```json
{
  "title": "string",
  "description": "string",
  "type": "WEB | APP | HYBRID",
  "tags": ["tagId"],
  "stacks": ["stackId"],
  "isFeatured": false,
  "isVisible": true,
  "link": "string | null",
  "partner": "string | null",
  "cover": "imageId | null",
  "gallery": ["imageId"]
}
```

`title`, `description`, `type` are required.

**Response** `{ "success": true }`

---

## GET /api/v1/admin/projects/[id]

Returns a single project. Same shape as the list item above.

---

## PATCH /api/v1/admin/projects/[id]

All fields optional. Same fields as POST.

**Response** `{ "success": true }`

---

## DELETE /api/v1/admin/projects/[id]

**Response** `{ "success": true }`
