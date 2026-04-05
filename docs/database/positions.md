# Collection: positions

`src/models/Position.ts`

---

## Schema

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| _id | ObjectId | ✓ | auto | |
| experienceId | ObjectId | ✓ | — | ref: experiences |
| title | String | ✓ | — | trimmed |
| startAt | Number | ✓ | — | Unix timestamp |
| endAt | Number | — | null | Unix timestamp; null if `isCurrent: true` |
| isCurrent | Boolean | — | `false` | |
| description | String | — | `""` | HTML string |
| sn | Number | — | `0` | display sort order within the experience |
| createdAt | Number | ✓ | `dayjs().unix()` | Unix timestamp |
| updatedAt | Number | — | null | |

---

## Indexes

| Fields | Type | Notes |
|--------|------|-------|
| `{ experienceId: 1 }` | regular | |
| `{ experienceId: 1, sn: 1 }` | unique | |
| `{ experienceId: 1, title: 1 }` | unique | |
