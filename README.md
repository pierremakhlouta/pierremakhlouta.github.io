# Portfolio

Personal portfolio for Pierre Makhlouta. Next.js (App Router), TypeScript and Tailwind CSS, exported as a static site.

## Develop

```sh
npm install
npm run dev      # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build    # static output in ./out
```

To preview the production build: `npx serve out` (or `python3 -m http.server -d out`), then open the printed address.

## Routes

| Route | Contents |
| --- | --- |
| `/` | Introduction, the site as a topology map, what I pay attention to, how I build |
| `/projects/` | Overview of both projects |
| `/projects/psells/` | PSells case study: screenshots, architecture, AWS/Terraform, CI/CD, deployment, security, reliability, backups, data |
| `/projects/evenly/` | Evenly case study: screenshots, architecture, database security, correctness, push, migrations, testing, deployment |
| `/experience/` | Work history, education, certifications, leadership |
| `/skills/` | Skill groups as a matrix of where each was used |
| `/contact/` | Email, GitHub, LinkedIn, location (and resume once configured) |
| `404.html` | Not-found page |

`trailingSlash` is on, so each route is exported as `route/index.html` and works on any static host.

## Design system

The visual idea is a **signal path**: the site drawn as a small piece of infrastructure.

- **Trace.** Every page runs down one vertical line (`.trace` in `globals.css`). Section headings sit on it as nodes (`<Node />`) that come online when scrolled into view; pages start at a square node (`PageHeader`) and end at one (`Terminus`). Where supported, the line fills with colour as you scroll (CSS scroll-driven animation).
- **Topology map.** The homepage hero (`src/components/TopologyMap.tsx`) maps the site: hubs are pages, and every leaf deep-links to the matching part of a page (a project, a skill row, a certification). Edges draw outward once on load; hovering or focusing a node sends a signal along its path. Nothing loops or imitates live activity.
- **Motion.** `app/template.tsx` fades each page in on navigation and mounts `OnlineObserver`, which marks `[data-node]` and `[data-reveal]` elements online. Everything honours `prefers-reduced-motion`, and content is visible without JavaScript.
- **Type.** One family (Schibsted Grotesk); the scale lives in `@theme` in `globals.css`. rem is 16px on phones and 17px from `md` up, so body text is 17 to 18px and captions 15 to 16px.
- **Colour.** Paper, ink and cobalt; green only for "live now" states.

## Editing content

- `src/content/profile.ts`: contact links, skills (with where each was used), direction, principles, experience, education, certifications.
- `src/content/projects.ts`: both case studies (summaries, metrics, sections, challenges, screenshots).

Both draw only on `master_profile.md` and the projects' own READMEs. `master_profile.md` is git-ignored because it holds personal contact details, and nothing imports it, so it never reaches `out/`.

- **Resume:** `public/Pierre_Makhlouta_Resume.pdf`, set as `person.resume` in `profile.ts`. It is linked from the Contact page and the footer, with any base path added automatically. To update it, replace the file (keep the name, or change `person.resume`). The PDF includes a phone number, which the HTML pages deliberately do not.
- **Demo access:** `demoAccess` in `projects.ts` shows a login with copy buttons beside a project's live link. PSells uses the public demo login published in its README and RUNBOOK; it disappears with the demo link after `liveUntil`. Evenly has no live link or login: the production app holds real household data and its fake groups exist only in the local development database, so the case study shows a short `access` note instead.
- **Photo:** the hero works without one. To add one, save it under `src/assets/`, import it in `profile.ts` and set `person.photo`; it appears above the introduction.
- **PSells demo link:** shown only when the site is built before 27 March 2027 (`liveUntil` in `projects.ts`), when the free AWS window ends. Rebuild after that date and only the GitHub link remains.

## Images

Screenshots live in `src/assets/` as WebP and are imported statically, so Next.js adds dimensions, blur placeholders and any base path automatically.

| Folder | Source |
| --- | --- |
| `src/assets/psells/` | Captured from the public demo (invented records only), at 2x and cropped to 1600px wide. Screens showing the partner's cut (Inventory table, Price drops, item Edit) are deliberately left out. |
| `src/assets/evenly/` | The README screenshots from the Evenly repo (`docs/screenshots/`), made from seed data. |
| `src/assets/certificates/` | Real certificates only, rendered from the issuers' PDFs: `microsoft-365-ab900.webp`, `google-it-automation.webp` and `lfca-specialization.webp` (Coursera certificate PDFs, each with a Coursera verification link) and `ictc-fit.webp` (a scan of the printed ICTC FIT certificate; ICTC offers no online verification). The PDFs themselves are not published. To add another, render its PDF to a ~1600px WebP here (Quick Look, `qlmanage -t -s 2400`, keeps the page orientation; flatten onto white) and add an entry to `certifications` in `profile.ts`, plus a leaf in `TopologyMap.tsx`. |

**Adding a certificate.** Add an entry to `certifications` in `profile.ts` with its `category` (one of `certCategories`: Cloud, Automation and DevOps, Linux and IT support, Software development). The Experience page groups certificates under those categories (`#certs-<category>` anchors), and the homepage map shows one Certifications leaf per category that holds at least one certificate, linking to its group. Categories with no completed certificate stay hidden, so planned certificates never appear early. The map has four category slots; a fifth category needs a new slot in `CERT_SLOTS` in `TopologyMap.tsx`.

To add a screenshot: save a WebP (about 1600px wide for browser views, the native ~786px for phone views), import it in `projects.ts` and add it to the project's `hero` or `gallery`.

Gallery screenshots open in an accessible lightbox (`src/components/Gallery.tsx`, built on the native `<dialog>` element): arrow keys move through the gallery, and Escape, the Close button or the backdrop close it.

A gallery entry marked `pending: true` shows a dashed "Screenshot needed" frame **in development only**; production builds skip it. One is pending:

- `src/assets/evenly/people-home.webp`: Evenly's people-mode home screen from seed data (needs a clean group name, not an `E2E trip …` fixture).

## Deploy

The site is a GitHub Pages user site at `https://pierremakhlouta.github.io`, deployed by `.github/workflows/deploy.yml`:

- Every push to `main` type-checks, lints, builds and publishes `out/`.
- A weekly scheduled run rebuilds the site, so date-based content updates on its own (the PSells demo link and login disappear after 27 March 2027).
- In the repository's **Settings > Pages**, the source must be **GitHub Actions**.

For other hosts, `out/` is plain static files. Under a sub-path, build with `BASE_PATH=/portfolio npm run build`; for a custom domain, set `SITE_URL=https://example.com` so share-image links are absolute.
