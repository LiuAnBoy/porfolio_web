# Collection: users

`src/models/User.ts`

---

## Schema

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| _id | ObjectId | ✓ | auto | |
| email | String | ✓ | — | unique, lowercase, trimmed |
| password | String | ✓ | — | `select: false` — never returned in queries |
| avatar | ObjectId | — | null | ref: images |
| name | String | ✓ | — | trimmed |
| title | String | — | `""` | trimmed |
| bio | String | — | `""` | HTML string |
| socials | ISocial[] | — | `[]` | sub-document array |
| createdAt | Number | ✓ | `dayjs().unix()` | Unix timestamp |
| updatedAt | Number | — | null | set on save |

### ISocial Sub-document

| Field | Type | Required | Enum |
|-------|------|----------|------|
| platform | String | ✓ | `GITHUB`, `LINKEDIN`, `LINE`, `TELEGRAM`, `WECHAT` |
| url | String | ✓ | — |

---

## Notes

- Only one user record exists per deployment (single-owner portfolio).
- `password` is excluded from all queries by default (`select: false`).
- `avatar` refs an image in the `images` collection; the image's `usage.type` is `AVATAR`.
