# Portfolio Public API Documentation

Base URL: `/api/v1/public`

---

## 1. Get User Profile

Get complete user profile with experiences and positions.

### Endpoint

```
GET /api/v1/public/user/me
```

### Query Parameters

None

### Response

```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "title": "string",
    "bio": "string",
    "avatar": "string | null",
    "socials": [
      {
        "platform": "GITHUB | LINKEDIN | LINE | TELEGRAM | WECHAT",
        "url": "string"
      }
    ],
    "experiences": [
      {
        "id": "string",
        "userId": "string",
        "company": "string",
        "companyIcon": "string | null",
        "sn": "number",
        "positions": [
          {
            "id": "string",
            "experienceId": "string",
            "title": "string",
            "startAt": "number (unix timestamp)",
            "endAt": "number | null (unix timestamp)",
            "isCurrent": "boolean",
            "description": "string",
            "sn": "number",
            "createdAt": "number (unix timestamp)",
            "updatedAt": "number | null (unix timestamp)"
          }
        ],
        "createdAt": "number (unix timestamp)",
        "updatedAt": "number | null (unix timestamp)"
      }
    ],
    "createdAt": "number (unix timestamp)",
    "updatedAt": "number | null (unix timestamp)"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | User ID |
| `email` | string | User email |
| `name` | string | User display name |
| `title` | string | Job title |
| `bio` | string | User biography |
| `avatar` | string \| null | Avatar image URL |
| `socials` | array | Social media links |
| `socials[].platform` | enum | Platform: `GITHUB`, `LINKEDIN`, `LINE`, `TELEGRAM`, `WECHAT` |
| `socials[].url` | string | Social profile URL |
| `experiences` | array | Work experiences (sorted by sn DESC) |
| `experiences[].company` | string | Company name |
| `experiences[].companyIcon` | string \| null | Company icon URL |
| `experiences[].sn` | number | Sort order |
| `experiences[].positions` | array | Positions in this company (sorted by sn ASC) |
| `experiences[].positions[].title` | string | Position title |
| `experiences[].positions[].startAt` | number | Start date (unix timestamp) |
| `experiences[].positions[].endAt` | number \| null | End date (unix timestamp) |
| `experiences[].positions[].isCurrent` | boolean | Is current position |
| `experiences[].positions[].description` | string | Position description |

### Error Response

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## 2. Get Projects

Get all projects with pagination and filters.

### Endpoint

```
GET /api/v1/public/projects
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | - | Filter by type: `WEB`, `APP`, `HYBRID` |
| `isFeatured` | boolean | - | Filter featured projects |
| `isVisible` | boolean | - | Filter visible projects |
| `tags` | string | - | Comma-separated tag slugs (AND logic) |
| `stacks` | string | - | Comma-separated stack slugs (AND logic) |
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |

### Example Requests

```
# Get first page (10 items)
GET /api/v1/public/projects

# Get second page
GET /api/v1/public/projects?page=2

# Get featured web projects
GET /api/v1/public/projects?type=WEB&isFeatured=true

# Get projects with specific tags
GET /api/v1/public/projects?tags=frontend,react

# Get projects with specific stacks
GET /api/v1/public/projects?stacks=nextjs,typescript
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "description": "string",
      "type": "WEB | APP | HYBRID",
      "tags": [
        {
          "id": "string",
          "label": "string",
          "slug": "string"
        }
      ],
      "stacks": [
        {
          "id": "string",
          "label": "string",
          "slug": "string"
        }
      ],
      "isFeatured": "boolean",
      "isVisible": "boolean",
      "link": "string | null",
      "partner": "string | null",
      "cover": "string | null",
      "gallery": ["string"],
      "createdAt": "number (unix timestamp)",
      "updatedAt": "number | null (unix timestamp)"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 25
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `data` | array | Project list |
| `data[].id` | string | Project ID |
| `data[].title` | string | Project title |
| `data[].slug` | string | URL-friendly slug |
| `data[].description` | string | Project description |
| `data[].type` | enum | Project type: `WEB`, `APP`, `HYBRID` |
| `data[].tags` | array | Associated tags |
| `data[].tags[].id` | string | Tag ID |
| `data[].tags[].label` | string | Tag display label |
| `data[].tags[].slug` | string | Tag slug |
| `data[].stacks` | array | Technology stacks used |
| `data[].stacks[].id` | string | Stack ID |
| `data[].stacks[].label` | string | Stack display label |
| `data[].stacks[].slug` | string | Stack slug |
| `data[].isFeatured` | boolean | Is featured project |
| `data[].isVisible` | boolean | Is visible to public |
| `data[].link` | string \| null | Project URL |
| `data[].partner` | string \| null | Partner/collaborator info |
| `data[].cover` | string \| null | Cover image URL |
| `data[].gallery` | string[] | Gallery image URLs |
| `page` | number | Current page number |
| `limit` | number | Items per page |
| `total` | number | Total items count |

### Pagination

Calculate total pages: `Math.ceil(total / limit)`

Example with `total: 25`, `limit: 10`:
- Page 1: items 1-10
- Page 2: items 11-20
- Page 3: items 21-25

### Error Response

```json
{
  "success": false,
  "message": "Failed to get projects"
}
```

---

## Common Response Format

### Success Response

```json
{
  "success": true,
  "data": "...",
  // pagination fields (for list endpoints)
  "page": 1,
  "limit": 10,
  "total": 100
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 404 | Resource not found |
| 500 | Server error |

---

## Notes

1. All timestamps are Unix timestamps (seconds since epoch)
2. Image fields return URL strings directly (not objects)
3. The `tags` and `stacks` filter parameters use AND logic (must match ALL specified values)
4. Projects are sorted by `createdAt` in descending order (newest first)
5. Experiences are sorted by `sn` in descending order
6. Positions within experiences are sorted by `sn` in ascending order
