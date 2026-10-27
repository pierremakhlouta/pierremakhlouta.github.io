// Single source for site copy. Every fact here comes from master_profile.md.
// Do not add projects, metrics or claims that are not in the profile.
// Project case-study content lives in projects.ts.

import type { StaticImageData } from "next/image";

import googleItAutomationCertificate from "@/assets/certificates/google-it-automation.webp";
import ictcFitCertificate from "@/assets/certificates/ictc-fit.webp";
import lfcaSpecializationCertificate from "@/assets/certificates/lfca-specialization.webp";
import microsoft365Certificate from "@/assets/certificates/microsoft-365-ab900.webp";

export const person = {
  name: "Pierre Makhlouta",
  location: "Toronto, ON",
  locationLong: "Toronto, Ontario",
  email: "pierremakhlouta06@gmail.com",
  github: "https://github.com/pierremakhlouta",
  linkedin: "https://www.linkedin.com/in/pierremakhlouta",
  // A file in /public. Note: the PDF includes a phone number (published by choice).
  resume: "/Pierre_Makhlouta_Resume.pdf" as string | null,
  // A real photo can be added later: import it from src/assets and set it here.
  photo: null as StaticImageData | null,
  seeking: "Summer 2027 co-op",
};

export const places = ["PSells", "Evenly", "S&C Electric", "Coursework"] as const;
export type Place = (typeof places)[number];

// `where` is the same information the earlier free-text "used in" labels
// held; `note` keeps any detail those labels carried.
export type SkillGroup = { name: string; items: string[]; where: Place[]; note?: string };

// Anchor id for a skill group's row on /skills/ (e.g. "Infrastructure as code" -> "infrastructure-as-code").
export const skillId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const skills: SkillGroup[] = [
  {
    name: "Cloud",
    items: ["AWS EC2", "S3", "IAM", "Systems Manager", "Parameter Store", "RDS", "Application Load Balancer"],
    where: ["PSells"],
  },
  { name: "Infrastructure as code", items: ["Terraform"], where: ["PSells"], note: "AWS and Grafana Cloud" },
  {
    name: "Containers and orchestration",
    items: ["Docker", "Docker Compose", "Kubernetes (kind, kustomize)", "GHCR"],
    where: ["PSells"],
  },
  { name: "CI/CD", items: ["GitHub Actions", "GitHub Pages"], where: ["PSells", "Evenly"] },
  {
    name: "Monitoring and reliability",
    items: ["Grafana Cloud", "SLOs and alerting", "Tested backups", "Postmortems", "Runbooks"],
    where: ["PSells"],
  },
  {
    name: "Linux and systems",
    items: ["Linux", "nginx", "macOS launchd", "Tailscale"],
    where: ["PSells", "Coursework"],
    note: "LFCA coursework",
  },
  {
    name: "Scripting and languages",
    items: ["Bash", "Python", "PowerShell", "TypeScript", "SQL", "PL/pgSQL", "C", "Java"],
    where: ["PSells", "Evenly", "Coursework"],
  },
  {
    name: "Databases and data",
    items: ["PostgreSQL", "SQLite", "Supabase", "pg_cron", "Star-schema warehousing", "ETL", "pandas", "Excel Power Query", "Power BI"],
    where: ["PSells", "Evenly", "S&C Electric"],
  },
  {
    name: "Microsoft 365 administration",
    items: ["Microsoft 365", "Exchange", "SharePoint", "Teams", "Entra ID", "Conditional Access", "Privileged Identity Management", "Microsoft Purview (DLP, sensitivity labels)", "Power Platform"],
    where: ["Coursework"],
    note: "Microsoft 365 and Agent Administration AB-900 coursework",
  },
  {
    name: "Security",
    items: ["TLS", "OIDC", "Least-privilege IAM", "Secret scanning", "Container image scanning", "Row Level Security", "Argon2id and bcrypt", "CSRF protection", "Web Crypto API"],
    where: ["PSells", "Evenly"],
  },
  {
    name: "Testing",
    items: ["pytest", "Vitest", "pgTAP", "Playwright", "axe-core"],
    where: ["PSells", "Evenly"],
  },
  {
    name: "Web and backend",
    items: ["FastAPI", "Jinja2", "Vite", "Progressive Web Apps", "Deno Edge Functions"],
    where: ["PSells", "Evenly"],
  },
];

// How I approach problems: the mindset. "How I build" (principles, below)
// carries the concrete evidence, so these stay general and short.
export const attention: { title: string; body: string }[] = [
  {
    title: "Understand the layers",
    body: "How does it work beneath the surface? I want to understand the systems and networks behind the things people use.",
  },
  {
    title: "Expect things to fail",
    body: "What happens when something breaks? I want to catch problems early and make systems easier to recover.",
  },
  {
    title: "Automate the repeatable",
    body: "If a task keeps repeating, can code make it consistent and reliable instead of manual?",
  },
  {
    title: "Build for real use",
    body: "Does it solve a real problem for the people who depend on it?",
  },
];

// Working principles, each backed by something in the case studies.
export const principles: { statement: string; evidence: string; href: string; linkLabel: string }[] = [
  {
    statement: "Infrastructure lives in code.",
    evidence:
      "Every AWS resource behind the PSells demo, and its monitoring, is defined in Terraform. The server rebuilds with no manual steps.",
    href: "/projects/psells/#aws-terraform",
    linkLabel: "PSells: AWS and Terraform",
  },
  {
    statement: "A backup only counts once it restores.",
    evidence: "PSells restores every daily dump into a throwaway database and counts it before keeping it.",
    href: "/projects/psells/#backups",
    linkLabel: "PSells: backups",
  },
  {
    statement: "Break it on purpose.",
    evidence:
      "I took the PSells database down for 15 minutes to test the alerting. The alert fired in about five minutes, and the postmortem led to a database health check and a clean 503 page.",
    href: "/projects/psells/#reliability",
    linkLabel: "PSells: monitoring and reliability",
  },
  {
    statement: "Make the safe path the only path.",
    evidence:
      "Evenly's browser can't read a single table. Every request goes through an allowlist of database functions, and CI fails if anything else becomes callable.",
    href: "/projects/evenly/#database-security",
    linkLabel: "Evenly: database security",
  },
];

export type Role = {
  // Anchor on /experience/ for roles the homepage map links to.
  id?: string;
  title: string;
  org: string;
  place: string;
  start: string;
  end: string;
  points: string[];
};

export const experience: Role[] = [
  {
    id: "sc-electric",
    title: "Data Analyst, MES Support (Co-op)",
    org: "S&C Electric",
    place: "Toronto",
    start: "Aug 2026",
    end: "Present",
    points: [
      "Built a live Excel tracker showing every job on the shop floor, including job and sales order numbers, customer, bay count, weights and dimensions. More than 50 people now use it.",
      "Designed a shipping skid sizing calculator around the shipping team's workflow, with rules for laying tall cabinets down and combining narrow bays. The whole shipping team uses it, and it makes sizing 25% faster.",
      "Built a Crating Tracker that logs how each job's cans are wrapped and stored, using Power Query to fill in sales order and customer from the job number.",
      "Designed a yearly performance-review tracker for supervisors that logs scored events per team member across 4 review categories, with a summary dashboard.",
      "Gathered network drop requirements for a new paint line building from layout drawings, for next year's budget.",
      "Pull job and BOM data from Oracle EBS and the MOM (MES) app suite.",
    ],
  },
  {
    id: "psells-founder",
    title: "Founder and Owner",
    org: "PSells",
    place: "Toronto (self-employed)",
    start: "Mar 2026",
    end: "Present",
    points: [
      "Run an independent retail reselling business and build the software that runs it, treating real inventory and sales as a live system to build, test and improve.",
    ],
  },
  {
    title: "Inventory and Procurement Summer Student",
    org: "S&C Electric",
    place: "Toronto",
    start: "May 2026",
    end: "Aug 2026",
    points: [
      "Tracked stock in inventory systems and coordinated parts ordering across teams for high-voltage power distribution production, meeting production deadlines.",
    ],
  },
  {
    title: "Production and Logistics Operations Summer Student",
    org: "S&C Electric",
    place: "Toronto",
    start: "May 2025",
    end: "Aug 2025",
    points: [
      "Tracked inventory, read technical drawings for labeling and documentation, and operated and troubleshot the GravoGraph engraving machine to meet compliance requirements.",
    ],
  },
];

export const earlierWork: { title: string; org: string; dates: string }[] = [
  { title: "Video Production Assistant", org: "Toronto Catholic District School Board", dates: "Jul–Aug 2024" },
  { title: "Sales Representative", org: "McCarthy Uniforms", dates: "Jul–Aug 2023" },
  { title: "Print Production Specialist (Co-op)", org: "Mimic Print", dates: "Mar–Jun 2023" },
  { title: "Media Team Member", org: "Toronto Catholic District School Board", dates: "Jul–Aug 2022" },
];

export const leadership: { title: string; org: string; dates: string; note: string }[] = [
  {
    title: "Sponsorship Director",
    org: "Syrian Students Association, York University",
    dates: "Sep 2026 – Present",
    note: "Find and secure sponsors for the association's events and activities.",
  },
  {
    title: "Volunteer Tutor",
    org: "Brebeuf College School",
    dates: "Sep 2022 – Jun 2024",
    note: "Tutored students in Math, Physics and Computer Science.",
  },
];

export const education = [
  {
    id: "york-university",
    school: "York University, Lassonde School of Engineering",
    credential: "Specialized Honours BSc, Computer Science",
    dates: "Sep 2024 – May 2028",
    details: [
      "Coursework: Data Structures, Advanced OOP, Software Tools, Computer Organization, Design and Analysis of Algorithms (in progress)",
    ],
  },
  {
    id: "brebeuf",
    school: "Brebeuf College School",
    credential: "Ontario Secondary School Diploma",
    dates: "Sep 2020 – Jun 2024",
    details: [
      "ICT Specialist High Skills Major",
      "Prefect, Honour Roll in Grades 9 to 12, Knights of Columbus Student Award",
    ],
  },
];

// Certificate categories, in display order. A category only appears on the
// site (Experience page and homepage map) once it holds a completed
// credential, so planned certificates are never shown before they are earned.
// The homepage map has room for four category leaves; `mapShort` is the
// one-line label used on phones.
export const certCategories = [
  { id: "cloud", label: "Cloud", mapShort: "Cloud" },
  { id: "automation", label: "Automation and DevOps", mapShort: "DevOps" },
  { id: "systems", label: "Linux and IT support", mapShort: "IT support" },
  { id: "software", label: "Software development", mapShort: "Software" },
] as const;

export type CertCategoryId = (typeof certCategories)[number]["id"];

export type Credential = {
  id: string;
  category: CertCategoryId;
  name: string;
  issuer: string;
  date: string;
  // What kind of credential this is, in the issuer's own terms.
  kind: string;
  note?: string;
  verify?: { href: string; label: string };
  // A real certificate image only; never a mock-up.
  image?: { src: StaticImageData; alt: string };
};

export const certifications: Credential[] = [
  {
    id: "cert-microsoft-365",
    category: "cloud",
    name: "Microsoft 365 and Agent Administration AB‑900 Professional Certificate",
    issuer: "Microsoft",
    date: "Oct 2026",
    // The certificate PDF says "Professional Certificate" (Coursera's page calls it a Specialization).
    kind: "Professional Certificate",
    // AB-900 is also the code of Microsoft's own certification exam, which this is not.
    note: "A five-course Coursera program from Microsoft covering AB-900 topics. It is separate from Microsoft's AB-900 certification exam.",
    verify: { href: "https://coursera.org/verify/professional-cert/N7XAOPWP0V3R", label: "Verify on Coursera" },
    image: {
      src: microsoft365Certificate,
      alt: "Certificate stating that Pierre Makhlouta completed the online Professional Certificate Microsoft 365 and Agent Administration AB-900, five courses from Microsoft, on Oct 26, 2026, issued through Coursera.",
    },
  },
  {
    id: "cert-it-automation",
    category: "automation",
    name: "Google IT Automation with Python Professional Certificate",
    issuer: "Google",
    date: "Sep 2026",
    kind: "Professional Certificate",
    // From the certificate PDF issued through Coursera (Sep 28, 2026).
    verify: { href: "https://coursera.org/verify/professional-cert/6JBL8F5BUQ2D", label: "Verify on Coursera" },
    image: {
      src: googleItAutomationCertificate,
      alt: "Certificate stating that Pierre Makhlouta completed the Google IT Automation with Python Professional Certificate on Sep 28, 2026, issued through Coursera.",
    },
  },
  {
    id: "cert-lfca",
    category: "systems",
    name: "Learning Linux for LFCA Certification Specialization",
    issuer: "LearnQuest",
    date: "Jun 2026",
    kind: "Course specialization",
    // Completing the course series is not the same as passing the LFCA exam.
    note: "A course series covering LFCA exam topics. It is separate from the Linux Foundation's LFCA certification exam.",
    // From the specialization certificate PDF issued through Coursera (Jun 25, 2026).
    verify: { href: "https://coursera.org/verify/specialization/ASKS8C7UV9YN", label: "Verify on Coursera" },
    image: {
      src: lfcaSpecializationCertificate,
      alt: "Certificate stating that Pierre Makhlouta completed the online specialization Learning Linux for LFCA Certification, four courses from LearnQuest, on Jun 25, 2026, issued through Coursera.",
    },
  },
  {
    id: "cert-ictc",
    category: "software",
    name: "Focus on Information Technology, Software Design and Development",
    issuer: "ICTC-CTIC",
    date: "Jun 2024",
    // The certificate says "has completed the requirements of the FIT program".
    kind: "Program certificate",
    // Scan of the printed certificate (Jun 21, 2024). ICTC offers no online verification.
    image: {
      src: ictcFitCertificate,
      alt: "Certificate from the Information and Communications Technology Council (ICTC) recognizing that Pierre Makhlouta completed the requirements of the Focus on Information Technology (FIT) program, Software Design and Development, dated June 21, 2024.",
    },
  },
];

// Categories that hold at least one credential, each with its credentials
// (newest first, as listed above).
export const certGroups = certCategories
  .map((c) => ({ ...c, items: certifications.filter((x) => x.category === c.id) }))
  .filter((g) => g.items.length > 0);
