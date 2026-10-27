// Case-study content for the two projects. Every fact comes from
// master_profile.md or the projects' own public READMEs. Do not add projects,
// metrics or features that are not there.
//
// Screenshots:
// - PSells images were captured from the public demo, which holds invented
//   records only. Screens that show the partner's cut are deliberately left out.
// - Evenly images are the README screenshots from its repo, made from seed data.

import type { StaticImageData } from "next/image";

import evenlyAddExpense from "@/assets/evenly/add-expense.webp";
import evenlyEntryDetails from "@/assets/evenly/entry-details.webp";
import evenlyHistory from "@/assets/evenly/history.webp";
import evenlyHome from "@/assets/evenly/home.webp";
import evenlySettleDark from "@/assets/evenly/settle-up-dark.webp";
import psellsAnalyticsCategories from "@/assets/psells/analytics-categories.webp";
import psellsAnalyticsOverview from "@/assets/psells/analytics-overview.webp";
import psellsHome from "@/assets/psells/home.webp";
import psellsListingTemplates from "@/assets/psells/listing-templates.webp";
import psellsPipeline from "@/assets/psells/pipeline.webp";

export type Link = { label: string; href: string; note?: string };

export type Shot = {
  src: StaticImageData;
  alt: string;
  caption: string;
  frame: "browser" | "phone" | "document";
  // Address shown in the browser frame.
  url?: string;
};

// A screenshot that has not been captured yet. Shown only in development, so
// the production site never displays an empty frame.
export type PendingShot = {
  pending: true;
  frame: "browser" | "phone";
  file: string;
  instructions: string;
  caption: string;
};

export type DetailSection = {
  id: string;
  heading: string;
  summary: string;
  points: string[];
};

export type Project = {
  slug: "psells" | "evenly";
  name: string;
  tagline: string;
  summary: string;
  stack: string[];
  repo: Link;
  live?: Link;
  // The live link is hidden once this date passes (free hosting window).
  liveUntil?: string;
  // Short note shown instead of a live link when visitors can't open the app.
  access?: string;
  // Closing line above the repository link at the end of the case study.
  closing: string;
  // Public login for the live demo, shown beside the live link. Only for logins
  // the project documents as public; never a real account.
  demoAccess?: { username: string; password: string; note: string };
  hero: Shot[];
  overview: { label: string; body: string }[];
  features: string[];
  results: { value: string; label: string }[];
  gallery: (Shot | PendingShot)[];
  sections: DetailSection[];
  challenges: { title: string; body: string }[];
};

const PSELLS_DEMO_URL = "psells.lakeshorefreight.me";

export const psells: Project = {
  slug: "psells",
  name: "PSells",
  tagline: "Inventory, listing and analytics platform for my own reselling business, deployed on AWS",
  summary:
    "The software my reselling business runs on, used every day by two people. It is built and operated like a production service: 23 AWS resources in Terraform, gated deploys with no stored keys, SLO-based monitoring, tested backups and written runbooks.",
  stack: ["Python", "FastAPI", "PostgreSQL", "pandas", "Docker", "nginx", "Terraform", "GitHub Actions", "AWS", "Kubernetes", "Grafana Cloud"],
  repo: { label: "Source on GitHub", href: "https://github.com/pierremakhlouta/psells" },
  live: {
    label: "Live demo",
    href: `https://${PSELLS_DEMO_URL}`,
    note: "Invented sample data, reset every night",
  },
  liveUntil: "2027-03-27T00:00:00-04:00",
  // Published in the PSells README ("log in as demo, password psells-demo-visitor")
  // and RUNBOOK ("The demonstration's login is published"). It only opens the AWS
  // demo, which holds invented records and is reset every night.
  demoAccess: {
    username: "demo",
    password: "psells-demo-visitor",
    note: "Change anything you like. The demo holds invented records and resets every night.",
  },
  closing: "The source, ARCHITECTURE.md with its diagrams, the RUNBOOK and DECISIONS.md are all on GitHub.",
  hero: [
    {
      src: psellsAnalyticsOverview,
      frame: "browser",
      url: `${PSELLS_DEMO_URL}/analytics`,
      alt: "PSells analytics page showing revenue, profit, margin, units sold and units in stock, above a bar chart of revenue and profit by month.",
      caption: "Analytics, built from a warehouse that is rebuilt every hour. Demo data is invented.",
    },
  ],
  overview: [
    {
      label: "The problem",
      body: "A reselling business has to track each item from arrival through research, photos, listing and sale, and know which listings are not selling and which are not worth listing at all.",
    },
    {
      label: "Who uses it",
      body: "Two people, every day, from a browser, a terminal app or the HTTP API. A public demo with invented records lets anyone try it.",
    },
    {
      label: "Why it matters here",
      body: "Real inventory and sales depend on it, so it gets production care: infrastructure in code, gated deploys, monitoring against SLOs, tested backups and runbooks.",
    },
  ],
  features: [
    "Tracks every item from arrival through research, photos, listing and sale",
    "A pipeline page showing how many items sit at each stage and how long each has waited",
    "Ready-to-copy Facebook Marketplace and Instagram listings from editable templates",
    "Flags items whose profit is too low to be worth listing",
    "A price-drop page listing stale items by how much room there is to lower the price",
    "Item photos with upload, download and delete",
  ],
  results: [
    { value: "~4 min", label: "from a push to main to verified live" },
    { value: "1,600+", label: "tests against a real PostgreSQL on every push" },
    { value: "23", label: "AWS resources, all defined in Terraform" },
    { value: "~5 min", label: "for the alert to fire in a planned 15-minute outage" },
  ],
  gallery: [
    {
      src: psellsHome,
      frame: "browser",
      url: `${PSELLS_DEMO_URL}/home`,
      alt: "PSells home page counting items in progress, needing photos and ready to list, listings not selling, items with room for a price drop, and the balance owing.",
      caption: "Home: what needs attention today, each count linking to its list.",
    },
    {
      src: psellsPipeline,
      frame: "browser",
      url: `${PSELLS_DEMO_URL}/pipeline`,
      alt: "PSells pipeline page with counts for each stage, then tables of items in progress, needing photos and ready to list, each with days waiting and what it still needs.",
      caption: "Pipeline: items at each stage, longest-waiting first, with what each still needs.",
    },
    {
      src: psellsAnalyticsCategories,
      frame: "browser",
      url: `${PSELLS_DEMO_URL}/analytics`,
      alt: "Horizontal bar chart of profit by category, above a table of products, units sold, revenue, profit and margin per category.",
      caption: "Categories by profit, from SQL views over the star-schema warehouse. Charts are drawn as SVG on the server.",
    },
    {
      src: psellsListingTemplates,
      frame: "browser",
      url: `${PSELLS_DEMO_URL}/settings`,
      alt: "Listing template settings with editable Facebook and Instagram templates using placeholders for name, price, retail price, condition and details.",
      caption: "Listing templates that fill in each item's Facebook Marketplace and Instagram post.",
    },
  ],
  sections: [
    {
      id: "aws-terraform",
      heading: "AWS and Terraform",
      summary: "The public demo is one EC2 server, rebuilt entirely from code.",
      points: [
        "All 23 resources are defined in Terraform. State lives in a locked, versioned S3 bucket, and the server rebuilds from code with no manual steps.",
        "No SSH: access is through Session Manager only. Secrets are in Parameter Store, and the server's IAM role is limited to what it needs.",
        "RDS PostgreSQL and an Application Load Balancer are built in Terraform behind an on/off switch. I proved the app on RDS with verified TLS, then switched them off to stay within free credits.",
      ],
    },
    {
      id: "ci-cd",
      heading: "CI/CD",
      summary: "Six workflows check every push before anything ships.",
      points: [
        "Workflows for tests; lint (shellcheck, nginx -t, Terraform fmt and validate); security (a dependency audit and a gitleaks scan of every commit); multi-architecture image builds with Grype scanning; a throwaway Kubernetes cluster; and deploy.",
        "1,600+ tests across 28 files run against a real PostgreSQL. Each test is rolled back, so tests never share rows.",
        "Tests check that the web pages, API and terminal app give the same answers, and parse every template to make sure no page does its own arithmetic.",
        "Every action is pinned to a commit and every image to a digest.",
      ],
    },
    {
      id: "deployment",
      heading: "Deployment",
      summary: "A push to main goes live in about 4 minutes, only after every check passes.",
      points: [
        "Multi-architecture images are built, scanned and published to GHCR, then deployed by digest through OIDC (no stored AWS keys) and a narrow SSM command. The live site is then verified from outside.",
        "Rollback is a rerun of the deploy with an earlier commit.",
        "The app also runs on a local Kubernetes cluster (kind, kustomize) with PostgreSQL as a StatefulSet. It rebuilds from nothing in about 75 seconds, and the same cluster is built in CI on every push before any deploy.",
      ],
    },
    {
      id: "security",
      heading: "Security",
      summary: "Defence at every layer, from the proxy to the session.",
      points: [
        "Login with Argon2id password hashing, server-side sessions stored as digests, per-session CSRF tokens, and login rate limiting in nginx.",
        "nginx reverse proxy with TLS 1.3, HSTS, a strict Content-Security-Policy and security headers.",
        "At home, phones reach the app only over a private Tailscale network. Nothing is exposed on Wi-Fi.",
      ],
    },
    {
      id: "reliability",
      heading: "Monitoring and reliability",
      summary: "SLOs, alerting, and an outage run on purpose to prove they work.",
      points: [
        "Monitoring in Grafana Cloud, all in Terraform: checks from 3 regions, availability and latency SLOs, email alerting and a dashboard.",
        "I ran a planned 15-minute database outage. The alert fired in about 5 minutes. I wrote a blameless postmortem and fixed 2 of its 3 action items: a health check that tests the database, and a clean 503 page.",
        "launchd jobs on the Mac start the stack at login, run the backup, rebuild analytics hourly, warn a month before a certificate expires, and show a notification when any job fails.",
        "The public demo resets to invented sample data every night. The sample business is generated by a script using the app's own rules, and a test fails if it is edited by hand.",
      ],
    },
    {
      id: "backups",
      heading: "Backups",
      summary: "A backup only counts once it has been restored.",
      points: [
        "Daily backups restore every dump into a throwaway database and count it before keeping it.",
        "On the server, copies go to an encrypted S3 bucket the server can write to but not read.",
        "On the Mac, an encrypted off-machine copy (age) is decrypted to prove it works, and photos are archived the same way.",
      ],
    },
    {
      id: "data",
      heading: "Analytics and data",
      summary: "A separate warehouse, rebuilt hourly, that must match the live numbers before it commits.",
      points: [
        "A pandas ETL rebuilds a star-schema warehouse in a separate PostgreSQL every hour. It reads through a read-only role and commits only if its totals match the live dashboard.",
        "SQL views over the warehouse give revenue and profit by month, category profit and top products. The analytics page reads through a role that can read nothing else, and warns when the warehouse falls more than two hours behind.",
        "Corrections to sales, returns and payments are written to an append-only audit log in the same transaction. All money is stored as integer cents.",
        "Storage moved from JSON to SQLite to PostgreSQL. Schema changes go through numbered migration files.",
      ],
    },
    {
      id: "documentation",
      heading: "Documentation",
      summary: "Written so someone else could run it.",
      points: [
        "ARCHITECTURE.md with 8 diagrams.",
        "A RUNBOOK covering everyday tasks, incidents and rebuilding from nothing.",
        "DECISIONS.md, indexed by area, explaining why each part is the way it is.",
      ],
    },
  ],
  challenges: [
    {
      title: "Migrating storage without losing a figure",
      body: "Storage moved from JSON to SQLite to PostgreSQL while the business kept running. I checked each migration figure by figure against the old system.",
    },
    {
      title: "Proving the alerting works",
      body: "Instead of assuming the monitoring worked, I took the database down for 15 minutes on purpose. The postmortem led to a health check that tests the database and a clean 503 page.",
    },
    {
      title: "Production habits on free credits",
      body: "RDS and the load balancer sit behind a Terraform switch. That let me prove the managed setup works without paying to keep it running.",
    },
    {
      title: "Keeping three interfaces honest",
      body: "The web app, terminal app and API share one set of business rules. Tests compare their answers, and parse every template to keep arithmetic out of the pages.",
    },
    {
      title: "Small phases",
      body: "I built PSells in small phases, improving it each round instead of shipping everything at once.",
    },
  ],
};

export const evenly: Project = {
  slug: "evenly",
  name: "Evenly",
  tagline: "Shared expense tracker for households and groups of friends",
  summary:
    "An installable mobile web app for bills, expenses and payments, used daily by real users. The database is the security boundary: the browser cannot read a single table, and every write goes through an allowlist of functions.",
  stack: ["TypeScript", "Vite", "PWA", "Supabase", "PostgreSQL", "PL/pgSQL", "Deno Edge Functions", "GitHub Actions", "Vitest", "pgTAP", "Playwright"],
  repo: { label: "Source on GitHub", href: "https://github.com/pierremakhlouta/evenly" },
  // No live link: the production app holds private user data and has no
  // public demo group, so it can't be opened by visitors.
  access: "There's no public demo because the live application contains private household data. The screenshots use seed data.",
  closing: "The source and DECISIONS.md, with every design decision and the alternatives considered, are on GitHub.",
  hero: [
    {
      src: evenlyHome,
      frame: "phone",
      alt: "Evenly home screen showing the balance owed, shortcuts for monthly bills, Add expense and Record payment buttons, and recent entries.",
      caption: "Home: the balance, bill shortcuts and recent entries.",
    },
    {
      src: evenlySettleDark,
      frame: "phone",
      alt: "Evenly record payment screen in dark mode.",
      caption: "Record payment, in dark mode.",
    },
  ],
  overview: [
    {
      label: "The problem",
      body: "Shared costs between people who live or spend together, like a household or a group of friends, are easy to lose track of in notes and spreadsheets. Evenly keeps one shared, always-current record.",
    },
    {
      label: "Who uses it",
      body: "Real users, every day. I built it alone and owned the product, architecture, security model, testing and deployment.",
    },
    {
      label: "What it does",
      body: "Tracks bills, expenses and payments, works offline as an installed app, and notifies everyone when an entry changes.",
    },
  ],
  features: [
    "Two modes on one engine: two parties sharing one running balance, or any number of people, Splitwise-style",
    "Splits by share, fixed amount, fraction, percentage or weights",
    "Monthly bills added automatically",
    "Soft deletes with restore, and an append-only change log for every edit",
    "Push notifications for new, edited and deleted entries",
    "Admin roles, personal PINs, device management with revoke, and CSV export",
  ],
  results: [
    { value: "~670", label: "automated tests across unit, database and end-to-end" },
    { value: "~28", label: "PL/pgSQL functions; the only way the browser can reach data" },
    { value: "10", label: "forward-only migrations applied to the live database" },
    { value: "N − 1", label: "payments at most to settle a group of N people" },
  ],
  gallery: [
    {
      src: evenlyAddExpense,
      frame: "phone",
      alt: "Evenly add expense form with a live preview.",
      caption: "Add expense, with a live preview.",
    },
    {
      src: evenlyEntryDetails,
      frame: "phone",
      alt: "Evenly entry details showing each share and the entry's change log.",
      caption: "Entry details, with shares and the change log.",
    },
    {
      src: evenlyHistory,
      frame: "phone",
      alt: "Evenly history screen with entries grouped by settle-up period.",
      caption: "History, grouped by settle-up periods.",
    },
    {
      pending: true,
      frame: "phone",
      file: "src/assets/evenly/people-home.webp",
      instructions:
        "People mode home screen (everyone's balance and the payments that settle the group), from seed data with a clean group name.",
      caption: "People mode: everyone's balance and the fewest payments to settle up.",
    },
  ],
  sections: [
    {
      id: "database-security",
      heading: "Database security",
      summary: "The browser cannot read any table directly.",
      points: [
        "Row Level Security is on with zero policies. Access goes only through an allowlist of SECURITY DEFINER functions, and a CI test fails if anything else becomes callable.",
        "Composite foreign keys block cross-group data access at the database level.",
        "Security without user accounts: a group PIN plus random device tokens stored only as SHA-256 hashes, personal PINs hashed with bcrypt, and brute-force lockouts.",
      ],
    },
    {
      id: "financial-correctness",
      heading: "Financial correctness",
      summary: "Integer cents everywhere, and two implementations that must agree to the cent.",
      points: [
        "All money is integer cents with no floating point anywhere.",
        "The same split, balance and debt math runs in TypeScript and in SQL, checked against one shared set of test vectors.",
        "Settle-up is server-authoritative: the database recomputes the payments, locks the group row and rejects stale amounts, so two settle-ups at once cannot double-pay.",
      ],
    },
    {
      id: "debt-simplification",
      heading: "Splitting and debt simplification",
      summary: "One engine for two parties or a whole group.",
      points: [
        "Two modes share one engine: two parties with one running balance (for example, two households splitting bills), or any number of people splitting by share, fixed amount, fraction, percentage or weights.",
        "Debt simplification settles N people in at most N − 1 payments.",
        "Monthly bills are added automatically each day by an idempotent pg_cron job.",
      ],
    },
    {
      id: "push",
      heading: "Push notifications",
      summary: "Web Push implemented from scratch, without an SDK or third-party service.",
      points: [
        "Built on the Web Crypto API: VAPID (RFC 8292) and aes128gcm encryption (RFC 8291), verified by interop tests against the reference implementation.",
        "A database trigger queues each push after commit, so a failed notification never blocks a save.",
      ],
    },
    {
      id: "migrations",
      heading: "Migrations",
      summary: "Changing the schema while people use the app.",
      points: [
        "10 forward-only SQL migrations applied to the live database while people were using it.",
        "Several added features users asked for after trying it: personal PINs, admins and settle-up periods.",
      ],
    },
    {
      id: "testing",
      heading: "Testing",
      summary: "About 670 tests, from SQL functions to real mobile browsers.",
      points: [
        "253 unit tests, 338 pgTAP database tests and 78 end-to-end tests on emulated iPhone Safari and Android Chrome.",
        "End-to-end runs include WCAG 2.2 AA accessibility checks in light and dark mode, and offline PWA tests on the production build.",
      ],
    },
    {
      id: "deployment",
      heading: "Deployment",
      summary: "Nothing ships unless every check passes.",
      points: [
        "GitHub Actions runs 3 parallel CI jobs and deploys to GitHub Pages only after every check passes.",
        "Every design decision is documented with its alternatives in a public DECISIONS.md.",
      ],
    },
  ],
  challenges: [
    {
      title: "A trigger running as the wrong role",
      body: "Testing caught a deferred database trigger that ran under the wrong role at commit time. It would have broken every write from the app.",
    },
    {
      title: "An icon only Safari couldn't see",
      body: "The cross-browser end-to-end runs caught an icon that was invisible only in Safari.",
    },
    {
      title: "Two implementations, one answer",
      body: "The money math exists in both TypeScript and SQL. A shared set of test vectors keeps them in agreement to the cent.",
    },
    {
      title: "Changing a live database",
      body: "Every migration is forward-only and was applied while people were using the app, including features they asked for after trying it.",
    },
  ],
};

export const projects: Project[] = [psells, evenly];

export function liveLink(project: Project): Link | undefined {
  if (!project.live) return undefined;
  if (project.liveUntil && Date.now() >= new Date(project.liveUntil).getTime()) return undefined;
  return project.live;
}

export const isPending = (shot: Shot | PendingShot): shot is PendingShot => "pending" in shot;
