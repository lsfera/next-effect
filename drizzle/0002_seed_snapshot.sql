-- Sample development snapshot data.
-- This file is idempotent and can be re-run safely.

INSERT INTO "users" (
  "id",
  "name",
  "email",
  "email_verified",
  "role",
  "first_name",
  "last_name",
  "submission_count"
)
VALUES
  (
    'user_admin_demo',
    'Admin Demo',
    'admin@example.com',
    true,
    'admin',
    'Admin',
    'Demo',
    3
  ),
  (
    'user_jane_demo',
    'Jane Demo',
    'jane@example.com',
    true,
    'user',
    'Jane',
    'Demo',
    2
  ),
  (
    'user_john_demo',
    'John Demo',
    'john@example.com',
    true,
    'user',
    'John',
    'Demo',
    1
  )
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "tools" (
  "id",
  "name",
  "slug",
  "website_url",
  "tagline",
  "description",
  "categories",
  "pricing",
  "logo_url",
  "showcase_image_url",
  "admin_approval_status",
  "submitted_by",
  "submitted_at",
  "approved_at",
  "rejection_count",
  "bookmark_count"
)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Prompt Pilot',
    'prompt-pilot',
    'https://promptpilot.example.com',
    'Draft and refine prompts faster',
    'Prompt Pilot helps teams create, compare, and iterate prompt templates with shared libraries and version history.',
    ARRAY['Productivity', 'Writing'],
    'freemium',
    'https://dummyimage.com/128x128/111827/ffffff.png&text=PP',
    'https://dummyimage.com/1200x630/0f172a/ffffff.png&text=Prompt+Pilot',
    'approved',
    'user_jane_demo',
    now() - interval '7 days',
    now() - interval '6 days',
    0,
    9
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Data Whisper',
    'data-whisper',
    'https://datawhisper.example.com',
    'Turn CSVs into plain-language insights',
    'Data Whisper summarizes datasets, highlights anomalies, and generates visual narratives for non-technical teams.',
    ARRAY['Analytics', 'Business'],
    'paid',
    'https://dummyimage.com/128x128/1d4ed8/ffffff.png&text=DW',
    'https://dummyimage.com/1200x630/1e3a8a/ffffff.png&text=Data+Whisper',
    'approved',
    'user_admin_demo',
    now() - interval '4 days',
    now() - interval '3 days',
    0,
    14
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Clip Forge',
    'clip-forge',
    'https://clipforge.example.com',
    'Generate short marketing clips from text',
    'Clip Forge creates social-ready short videos with brand presets, subtitle templates, and export automation.',
    ARRAY['Video', 'Marketing'],
    'free',
    'https://dummyimage.com/128x128/065f46/ffffff.png&text=CF',
    'https://dummyimage.com/1200x630/064e3b/ffffff.png&text=Clip+Forge',
    'pending',
    'user_john_demo',
    now() - interval '1 day',
    null,
    0,
    1
  )
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "tool_history" (
  "id",
  "tool_id",
  "user_id",
  "event_type",
  "reason",
  "created_at"
)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111111',
    'user_jane_demo',
    'submitted',
    null,
    now() - interval '7 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '11111111-1111-1111-1111-111111111111',
    'user_admin_demo',
    'approved',
    null,
    now() - interval '6 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '22222222-2222-2222-2222-222222222222',
    'user_admin_demo',
    'submitted',
    null,
    now() - interval '4 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
    '22222222-2222-2222-2222-222222222222',
    'user_admin_demo',
    'approved',
    null,
    now() - interval '3 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5',
    '33333333-3333-3333-3333-333333333333',
    'user_john_demo',
    'submitted',
    null,
    now() - interval '1 day'
  )
ON CONFLICT ("id") DO NOTHING;