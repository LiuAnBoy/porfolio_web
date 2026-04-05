# Database Design

MongoDB. All timestamps are Unix epoch (seconds).

---

## Collections

| Collection | File | Description |
|------------|------|-------------|
| [users](./users.md) | `src/models/User.ts` | Site owner profile |
| [projects](./projects.md) | `src/models/Project.ts` | Portfolio projects |
| [experiences](./experiences.md) | `src/models/Experience.ts` | Work experience entries |
| [positions](./positions.md) | `src/models/Position.ts` | Job positions within an experience |
| [images](./images.md) | `src/models/Image.ts` | Cloudinary image records |
| [tags](./tags.md) | `src/models/Tag.ts` | Project tags |
| [stacks](./stacks.md) | `src/models/Stack.ts` | Tech stack entries |

---

## Relationships

```
users
├── avatar ──────────────────────► images
└── (via experiences) experiences
        ├── userId ──────────────► users
        ├── companyIcon ─────────► images
        └── positions
                └── experienceId ► experiences

projects
├── userId ──────────────────────► users
├── tags[] ──────────────────────► tags
├── stacks[] ────────────────────► stacks
├── cover ───────────────────────► images
└── gallery[] ───────────────────► images

images
└── usage.refId ─────────────────► users | experiences | projects (polymorphic)
```

---

## Notes

- `slug` on Tag and Stack is auto-generated from `label` via pinyin-pro at creation time and is unique.
- `images.isPending` is `true` after upload and set to `false` once the image is linked to a resource.
- Images uploaded but never linked are eligible for cleanup (indexed by `isPending + uploadedAt`).
- Timestamps use `dayjs().unix()` (seconds, not milliseconds).
