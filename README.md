# Trever Ehrfurth — Portfolio

Personal portfolio and blog built with [Astro](https://astro.build), Tailwind CSS, and TypeScript. Deployed on Cloudflare Pages.

## Content

Content lives in `src/content/` as markdown files — no code changes needed to add or update:

| Section | Location |
| :--- | :--- |
| Work history | `src/content/work/*.md` |
| Accomplishments | `src/content/accomplishments/*.md` |
| Projects | `src/content/projects/[slug]/index.md` |
| Blog posts | `src/content/blog/[slug]/index.md` |

## Local Development

```bash
npm install
npm run dev       # localhost:4321
npm run build     # production build to ./dist/
npm run preview   # preview production build locally
```

## Deployment

Hosted on Cloudflare Pages. Pushes to `main` deploy automatically.
