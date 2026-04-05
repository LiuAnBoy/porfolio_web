# Admin API — Dashboard

Requires admin session.

---

## GET /api/v1/admin/init

Returns dashboard stats and recent items.

**Response**

```json
{
  "counts": {
    "projects": 12,
    "tags": 8,
    "stacks": 15,
    "images": 34
  },
  "recentProjects": [
    { "id": "string", "name": "string", "updatedAt": 1700000000 }
  ],
  "recentImages": [
    { "id": "string", "url": "string", "updatedAt": 1700000000 }
  ],
  "recentTags": [
    { "id": "string", "label": "string", "slug": "string", "updatedAt": 1700000000 }
  ],
  "recentStacks": [
    { "id": "string", "label": "string", "slug": "string", "updatedAt": 1700000000 }
  ]
}
```
