import type { Metadata } from "next";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import { Dash, PageHeader, Section, Terminus, external } from "@/components/layout";
import { certGroups, earlierWork, education, experience, leadership } from "@/content/profile";

export const metadata: Metadata = {
  title: "Experience and education",
  description: "Work experience, education, certifications and leadership of Pierre Makhlouta, a Computer Science student at York University.",
};

const sections = [
  { id: "work", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "leadership", label: "Leadership" },
];

const dateCol = "grid gap-2 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8";

export default function ExperiencePage() {
  return (
    <>
      <PageHeader title="Experience and education" crumbs={[{ href: "/", label: "Home" }, { label: "Experience" }]}>
        <nav aria-label="On this page">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Section id="work" title="Experience">
        <ol className="space-y-12">
          {experience.map((r) => (
            <li key={`${r.title}-${r.start}`} id={r.id} className={dateCol}>
              <p className="num text-sm text-muted md:pt-1">
                <time>{r.start}</time> – <time>{r.end}</time>
              </p>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{r.title}</h3>
                <p className="mt-0.5 text-muted">
                  {r.org}, {r.place}
                </p>
                <ul className="mt-4 max-w-[68ch] space-y-2.5">
                  {r.points.map((pt) => (
                    <Dash key={pt}>{pt}</Dash>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        <h3 className="mt-16 text-xl font-semibold tracking-tight">Earlier work</h3>
        <ul className="mt-4 space-y-3">
          {earlierWork.map((w) => (
            <li key={`${w.title}-${w.dates}`} className={dateCol}>
              <p className="num text-sm text-muted md:pt-0.5">{w.dates}</p>
              <p>
                {w.title}, <span className="text-muted">{w.org}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="education" title="Education">
        <ul className="space-y-10">
          {education.map((e) => (
            <li key={e.school} id={e.id} className={dateCol}>
              <p className="num text-sm text-muted md:pt-1">{e.dates}</p>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{e.credential}</h3>
                <p className="mt-0.5 text-muted">{e.school}</p>
                <ul className="mt-3 max-w-[68ch] space-y-1.5">
                  {e.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="certifications" title="Certifications">
        <div className="space-y-12">
          {certGroups.map((g) => (
            <section key={g.id} id={`certs-${g.id}`} aria-labelledby={`certs-${g.id}-title`}>
              <h3 id={`certs-${g.id}-title`} className="text-xl font-semibold tracking-tight">
                {g.label}
              </h3>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                {g.items.map((c) => (
                  <li key={c.id} id={c.id} className="flex flex-col rounded-lg border border-rule bg-surface p-5">
                    {c.image && (
                      <Gallery
                        shots={[{ src: c.image.src, alt: c.image.alt, caption: `${c.name}, ${c.issuer}`, frame: "document" }]}
                        sizes="(min-width: 1024px) 460px, (min-width: 640px) 50vw, 100vw"
                        className="mb-5"
                        showCaption={false}
                      />
                    )}
                    <p className="text-sm text-muted">{c.kind}</p>
                    <h4 className="mt-1 text-lg font-semibold leading-snug tracking-tight">{c.name}</h4>
                    <p className="mt-1.5 text-muted">
                      {c.issuer}, {c.date}
                    </p>
                    {c.summary && <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted">{c.summary}</p>}
                    {c.note && <p className="mt-2 text-sm text-muted">{c.note}</p>}
                    {c.verify && (
                      <a href={c.verify.href} {...external} className="link mt-auto self-start pt-4 font-medium">
                        {c.verify.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <Section id="leadership" title="Leadership">
        <ul className="space-y-8">
          {leadership.map((l) => (
            <li key={l.title} className={dateCol}>
              <p className="num text-sm text-muted md:pt-1">{l.dates}</p>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{l.title}</h3>
                <p className="mt-0.5 text-muted">{l.org}</p>
                <p className="mt-2">{l.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Terminus>
        <p className="max-w-[40ch] text-xl leading-snug md:text-2xl">
          The tools behind this work are on the{" "}
          <Link href="/skills/" className="link">
            skills
          </Link>{" "}
          page.
        </p>
      </Terminus>
    </>
  );
}
