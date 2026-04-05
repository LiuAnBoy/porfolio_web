# Admin API — User & Experiences

Requires admin session. Users can only access/modify their own data (`uId` must match session user).

---

## GET /api/v1/admin/user/[uId]

**Response**

```json
{
  "id": "string",
  "email": "string",
  "avatar": { "id": "string", "url": "string" },
  "name": "string",
  "title": "string",
  "bio": "string (HTML)",
  "socials": [
    { "platform": "GITHUB | LINKEDIN | LINE | TELEGRAM | WECHAT", "url": "string" }
  ],
  "createdAt": 1700000000,
  "updatedAt": null
}
```

---

## PATCH /api/v1/admin/user/[uId]

**Request Body**

```json
{
  "name": "string",
  "title": "string",
  "bio": "string",
  "avatar": "imageId | null",
  "socials": [
    { "platform": "GITHUB", "url": "string" }
  ]
}
```

All fields optional. `email` is read-only.

**Response** `{ "success": true }`

---

## GET /api/v1/admin/user/[uId]/experiences

Returns all experiences with nested positions.

**Response**

```json
[
  {
    "id": "string",
    "userId": "string",
    "company": "string",
    "companyIcon": { "id": "string", "url": "string" },
    "sn": 0,
    "createdAt": 1700000000,
    "updatedAt": null,
    "positions": [
      {
        "id": "string",
        "experienceId": "string",
        "title": "string",
        "startAt": 1700000000,
        "endAt": 1710000000,
        "isCurrent": false,
        "description": "string (HTML)",
        "sn": 0,
        "createdAt": 1700000000,
        "updatedAt": null
      }
    ]
  }
]
```

---

## POST /api/v1/admin/user/[uId]/experiences

**Request Body**

```json
{
  "company": "string",
  "companyIcon": "imageId | null",
  "sn": 0,
  "positions": [
    {
      "title": "string",
      "startAt": 1700000000,
      "endAt": null,
      "isCurrent": true,
      "description": "string",
      "sn": 0
    }
  ]
}
```

`company` and `positions` (min 1 item) are required. `positions[].title` and `positions[].startAt` are required.

**Response** `{ "success": true }`

---

## GET /api/v1/admin/user/[uId]/experiences/[expId]

Returns a single experience. Same shape as list item.

---

## PATCH /api/v1/admin/user/[uId]/experiences/[expId]

All fields optional. To update positions, provide the full positions array. Existing positions include `id`; omitting `id` creates a new position.

**Request Body**

```json
{
  "company": "string",
  "companyIcon": "imageId | null",
  "sn": 0,
  "positions": [
    {
      "id": "existingPositionId",
      "title": "string",
      "startAt": 1700000000,
      "endAt": null,
      "isCurrent": true,
      "description": "string",
      "sn": 0
    }
  ]
}
```

**Response** `{ "success": true }`

---

## DELETE /api/v1/admin/user/[uId]/experiences/[expId]

**Response** `{ "success": true }`

---

## PATCH /api/v1/admin/user/[uId]/experiences/sn

Updates the display order of experiences.

**Request Body**

```json
[
  { "id": "expId1", "sn": 0 },
  { "id": "expId2", "sn": 1 }
]
```

**Response** `{ "success": true }`
