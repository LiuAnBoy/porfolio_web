# Collection: images

`src/models/Image.ts`

---

## Schema

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| _id | ObjectId | ✓ | auto | |
| publicId | String | ✓ | — | Cloudinary public ID, unique |
| url | String | ✓ | — | Cloudinary secure URL |
| hash | String | ✓ | — | MD5 of file bytes; used to skip redundant uploads |
| isPending | Boolean | — | `true` | `true` until linked to a resource |
| createdAt | Number | ✓ | `dayjs().unix()` | Unix timestamp |
| uploadedAt | Number | ✓ | `dayjs().unix()` | Unix timestamp |
| updatedAt | Number | — | null | |
| usage | ImageUsage | — | null | sub-document |

### ImageUsage Sub-document

| Field | Type | Required | Enum |
|-------|------|----------|------|
| type | String | ✓ | `AVATAR`, `EXPERIENCE`, `PROJECT_COVER`, `PROJECT_GALLERY`, `ARTICLE_COVER`, `ARTICLE_CONTENT` |
| refId | ObjectId | ✓ | — | Polymorphic ref to users / experiences / projects |
| model | String | ✓ | — | `USER`, `EXPERIENCE`, `PROJECT`, `ARTICLE` |

---

## Indexes

| Fields | Notes |
|--------|-------|
| `{ isPending: 1, uploadedAt: 1, createdAt: 1 }` | For cleanup jobs targeting unlinked images |
| `{ "usage.model": 1, "usage.refId": 1 }` | For querying images by resource |

---

## Notes

- Images are uploaded first (`isPending: true`), then linked when the parent form is saved.
- `hash` prevents re-uploading the same file content when PATCH is called with an unchanged file.
- Deleting an image calls the Cloudinary delete API before removing the DB record.
