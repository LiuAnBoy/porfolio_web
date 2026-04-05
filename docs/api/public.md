# Public API

No authentication required.

---

## GET /api/v1/user/me

Returns the site owner's profile including experiences.

**Response**

```json
{
  "id": "string",
  "avatar": "string | null",
  "name": "string",
  "title": "string",
  "bio": "string (HTML)",
  "socials": [
    { "platform": "GITHUB | LINKEDIN | LINE | TELEGRAM | WECHAT", "url": "string" }
  ],
  "experiences": [
    {
      "id": "string",
      "company": "string",
      "companyIcon": "string | null",
      "sn": 0,
      "positions": [
        {
          "id": "string",
          "experienceId": "string",
          "title": "string",
          "startAt": 1700000000,
          "endAt": 1710000000,
          "isCurrent": false,
          "description": "string (HTML)",
          "sn": 0
        }
      ]
    }
  ]
}
```

---

## GET /api/v1/projects

Returns a paginated list of visible projects.

**Query Parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| page_size | number | 20 | Items per page (max 100) |
| type | string | — | Filter by `WEB`, `APP`, or `HYBRID` |
| isFeatured | boolean | — | Filter featured projects |
| isVisible | boolean | — | Filter by visibility |
| tags | string | — | Comma-separated tag slugs |
| stacks | string | — | Comma-separated stack slugs |

**Response**

```json
{
  "payload": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "description": "string (HTML)",
      "type": "WEB | APP | HYBRID",
      "tags": [{ "id": "string", "label": "string", "slug": "string" }],
      "stacks": [{ "id": "string", "label": "string", "slug": "string" }],
      "cover": "string | null",
      "gallery": ["string"],
      "isFeatured": false,
      "isVisible": true,
      "link": "string | null",
      "partner": "string | null"
    }
  ],
  "total_count": 50,
  "page_size": 20,
  "page": 1
}
```
