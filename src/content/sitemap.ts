// The homepage map's data, built from the rest of the content so new projects,
// roles, schools, skill groups and certificate categories appear on their own.

import { certGroups, education, experience, person, skillId, skills } from "@/content/profile";
import { projects } from "@/content/projects";

export type MapItem = {
  label: string;
  // Shorter label for the phone layout of the map.
  short?: string;
  href: string;
  // Links to another site, a file or a mail client rather than a page here.
  external?: boolean;
};

export type MapHub = {
  id: string;
  label: string;
  href: string;
  hrefLabel: string;
  angle: number; // degrees, 0 = right, clockwise
  items: MapItem[];
};

const projectNames = new Set(projects.map((p) => p.name));

export function buildMapHubs(resumeHref: string | null): MapHub[] {
  return [
    {
      id: "projects",
      label: "Projects",
      href: "/projects/",
      hrefLabel: "All projects",
      angle: -150,
      items: projects.map((p) => ({ label: p.name, href: `/projects/${p.slug}/` })),
    },
    {
      id: "education",
      label: "Education",
      href: "/experience/#education",
      hrefLabel: "Education",
      angle: -90,
      items: education.map((e) => ({ label: e.school.split(",")[0], href: `/experience/#${e.id}` })),
    },
    {
      id: "experience",
      label: "Experience",
      href: "/experience/",
      hrefLabel: "Full experience",
      angle: -30,
      // One entry per organisation; roles with an anchor link straight to it. A
      // role at an organisation that is also a project is marked as a role.
      items: experience
        .filter((r, i, all) => r.id && all.findIndex((x) => x.org === r.org) === i)
        .map((r) => ({
          label: projectNames.has(r.org) ? `${r.org} (founder)` : r.org,
          href: `/experience/#${r.id}`,
        })),
    },
    {
      id: "skills",
      label: "Skills",
      href: "/skills/",
      hrefLabel: "All skills",
      angle: 30,
      items: skills.map((g) => ({ label: g.name, href: `/skills/#${skillId(g.name)}` })),
    },
    {
      id: "contact",
      label: "Contact",
      href: "/contact/",
      hrefLabel: "Contact page",
      angle: 90,
      items: [
        { label: "Email", href: `mailto:${person.email}`, external: true },
        { label: "GitHub", href: person.github, external: true },
        { label: "LinkedIn", href: person.linkedin, external: true },
        ...(resumeHref ? [{ label: "Resume", href: resumeHref, external: true }] : []),
      ],
    },
    {
      id: "certifications",
      label: "Certifications",
      href: "/experience/#certifications",
      hrefLabel: "All certifications",
      angle: 150,
      items: certGroups.map((g) => ({ label: g.label, short: g.mapShort, href: `/experience/#certs-${g.id}` })),
    },
  ];
}
