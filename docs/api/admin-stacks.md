# Admin API — Stacks

Requires admin session.

`slug` is auto-generated from `label` using pinyin-pro.

---

## GET /api/v1/admin/stacks

Returns all stacks (no pagination).

**Response**

```json
[
  {
    "id": "string",
    "label": "string",
    "slug": "string",
    "createdAt": 1700000000,
    "updatedAt": null
  }
]
```

---

## POST /api/v1/admin/stacks

**Request Body**

```json
{ "label": "string" }
```

`label` is required and must be unique.

**Response** `{ "success": true }`

**409** if label already exists.

---

## GET /api/v1/admin/stacks/[id]

Returns a single stack. Same shape as list item.

---

## PATCH /api/v1/admin/stacks/[id]

**Request Body**

```json
{ "label": "string" }
```

**Response** `{ "success": true }`

---

## DELETE /api/v1/admin/stacks/[id]

**Response** `{ "success": true }`
