# Collection: tags

`src/models/Tag.ts`

---

## Schema

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| _id | ObjectId | ✓ | auto | |
| label | String | ✓ | — | unique, trimmed |
| slug | String | ✓ | — | unique, auto-generated from label via pinyin-pro, lowercase |
| createdAt | Number | ✓ | `dayjs().unix()` | Unix timestamp |
| updatedAt | Number | — | null | |

---

## Notes

- `slug` is generated once at creation and never updated on label rename.
- Referenced by `projects.tags[]`.
