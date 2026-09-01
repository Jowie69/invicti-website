# invicti-website

Invicti portfolio website built with React, TypeScript, and Vite.

## Content admin

- Admin route: `/admin`
- Temporary login (used only before Supabase is connected): `admin` / `admin123`
- Complete database, RLS, and Storage setup: [`public/supabase-setup.sql`](public/supabase-setup.sql)

The public page falls back to its built-in content until a Supabase connection and a `main` row in `site_content` exist. The admin can save a local draft first, then publish it after connecting Supabase and signing in with an authorized Supabase Auth user.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```
