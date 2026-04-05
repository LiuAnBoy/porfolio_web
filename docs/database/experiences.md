# Collection: experiences

`src/models/Experience.ts`

---

## Schema

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| _id | ObjectId | ✓ | auto | |
| userId | ObjectId | ✓ | — | ref: users |
| company | String | ✓ | — | trimmed |
| companyIcon | ObjectId | — | null | ref: images, usage.type = `EXPERIENCE` |
| sn | Number | — | `0` | display sort order |
| createdAt | Number | ✓ | `dayjs().unix()` | Unix timestamp |
| updatedAt | Number | — | null | |

---

## Indexes

| Fields | Notes |
|--------|-------|
| `{ userId: 1 }` | |
| `{ userId: 1, sn: 1 }` | for ordered listing |

---

## Notes

- Positions are stored in a separate `positions` collection (not embedded).
- `sn` is used for display ordering; updated via `PATCH .../experiences/sn`.
