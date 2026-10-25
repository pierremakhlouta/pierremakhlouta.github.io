import type { Metadata } from "next";
import { PageHeader, Terminus, external, publicPath } from "@/components/layout";
import { person } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${person.name}, a Computer Science student at York University open to ${person.seeking} opportunities.`,
};

export default function ContactPage() {
  const links = [
    { label: "GitHub", href: person.github, text: person.github.replace("https://", "") },
    { label: "LinkedIn", href: person.linkedin, text: person.linkedin.replace("https://www.", "") },
  ];
  const row = "grid gap-1 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6";

  return (
    <>
      <PageHeader title="Contact" crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]} wide>
        <p className="max-w-[44ch] text-xl leading-snug md:text-2xl">
          I&apos;m a Computer Science student at York University, open to {person.seeking} opportunities in computing and
          technology. Email is the fastest way to reach me.
        </p>
        <a
          href={`mailto:${person.email}`}
          className="mt-10 inline-block break-all text-[clamp(1.5rem,5vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em] text-accent underline decoration-2 underline-offset-[0.18em] transition-[text-decoration-color] hover:decoration-[3px]"
        >
          {person.email}
        </a>
        <dl className="mt-12 max-w-2xl divide-y divide-rule border-y border-rule">
          {links.map((l) => (
            <div key={l.label} className={row}>
              <dt className="font-semibold">{l.label}</dt>
              <dd>
                <a href={l.href} {...external} className="link break-all">
                  {l.text}
                </a>
              </dd>
            </div>
          ))}
          {person.resume && (
            <div className={row}>
              <dt className="font-semibold">Resume</dt>
              <dd>
                <a href={publicPath(person.resume)} download className="link">
                  Download (PDF)
                </a>
              </dd>
            </div>
          )}
          <div className={row}>
            <dt className="font-semibold">Location</dt>
            <dd>{person.locationLong}</dd>
          </div>
        </dl>
      </PageHeader>
      <Terminus />
    </>
  );
}
