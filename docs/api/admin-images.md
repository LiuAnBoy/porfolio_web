# Admin API — Images & Upload

Requires admin session.

---

## GET /api/v1/admin/images

Returns a paginated list of images.

**Query Parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| page_size | number | 20 | Items per page (max 100) |
| isPending | boolean | — | Filter pending images |
| model | string | — | Filter by usage model: `USER`, `EXPERIENCE`, `PROJECT`, `ARTICLE` |

**Response**

```json
{
  "payload": [
    {
      "id": "string",
      "publicId": "string",
      "url": "string",
      "hash": "string",
      "isPending": true,
      "createdAt": 1700000000,
      "uploadedAt": 1700000000,
      "updatedAt": null,
      "usage": {
        "type": "AVATAR | EXPERIENCE | PROJECT_COVER | PROJECT_GALLERY | ARTICLE_COVER | ARTICLE_CONTENT",
        "refId": "string",
        "model": "USER | EXPERIENCE | PROJECT | ARTICLE"
      }
    }
  ],
  "total_count": 34,
  "page_size": 20,
  "page": 1
}
```

---

## GET /api/v1/admin/images/[id]

Returns a single image. Same shape as list item.

---

## PATCH /api/v1/admin/images/[id]

Replaces the image file. Sends `multipart/form-data`.

**Request Body (FormData)**

```
file: File  (image/*, max 5 MB)
```

If the uploaded file hash matches the existing image, no upload occurs and `{ "success": true }` is returned immediately.

**Response** `{ "success": true }`

---

## DELETE /api/v1/admin/images/[id]

Deletes the image from Cloudinary and the database.

**Response** `{ "success": true }`

---

## POST /api/v1/admin/upload

Uploads a new image. The image is stored with `isPending: true` until linked to a resource.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Must be `"image"` |
| module | string | No | `projects`, `user`, or `experiences` — used for Cloudinary folder organization |

**Request Body (FormData)**

```
file: File  (image/*, max 5 MB)
```

**Response**

```json
{
  "success": true,
  "payload": {
    "imageId": "string",
    "url": "string"
  }
}
```
