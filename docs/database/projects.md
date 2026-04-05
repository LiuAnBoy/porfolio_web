# Collection: projects

`src/models/Project.ts`

---

## Schema

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| _id | ObjectId | ✓ | auto | |
| userId | ObjectId | ✓ | — | ref: users |
| title | String | ✓ | — | trimmed |
| slug | String | ✓ | — | unique, auto-generated, lowercase, trimmed |
| description | String | ✓ | — | HTML string, trimmed |
| type | String | ✓ | — | enum: `WEB`, `APP`, `HYBRID` |
| tags | ObjectId[] | — | `[]` | ref: tags |
| stacks | ObjectId[] | — | `[]` | ref: stacks |
| isFeatured | Boolean | — | `false` | |
| isVisible | Boolean | — | `true` | |
| link | String | — | null | trimmed |
| partner | String | — | null | trimmed |
| cover | ObjectId | — | null | ref: images, usage.type = `PROJECT_COVER` |
| gallery | ObjectId[] | — | `[]` | ref: images, usage.type = `PROJECT_GALLERY` |
| createdAt | Number | ✓ | `dayjs().unix()` | Unix timestamp |
| updatedAt | Number | — | null | |

---

## Indexes

| Fields | Type | Notes |
|--------|------|-------|
| `{ userId: 1 }` | regular | |
| `{ type: 1 }` | regular | |
| `{ isFeatured: 1 }` | regular | |
| `{ isVisible: 1 }` | regular | |
| `{ title: "text" }` | text search | |

---

## Notes

- `slug` is auto-generated from `title` at creation (not updated on rename).
- Public API only returns projects where `isVisible: true`.
