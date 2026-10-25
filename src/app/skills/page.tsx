import type { Metadata } from "next";
import Link from "next/link";
import { Container, Node, PageHeader, Terminus } from "@/components/layout";
import { places, skillId, skills, type Place } from "@/content/profile";

export const metadata: Metadata = {
  title: "Skills",
  description: "The tools Pierre Makhlouta uses across cloud, infrastructure as code, containers, CI/CD, reliability, Linux and databases, and where each was used.",
};

const placeLinks: Partial<Record<Place, string>> = {
  PSells: "/projects/psells/",
  Evenly: "/projects/evenly/",
  "S&C Electric": "/experience/#work",
  Coursework: "/experience/#certifications",
};

// A connection matrix: each skill group is a row, each place it was used is a
// column, and a filled node marks a connection.
export default function SkillsPage() {
  return (
    <>
      <PageHeader title="Skills" crumbs={[{ href: "/", label: "Home" }, { label: "Skills" }]}>
        <p className="text-lg md:text-xl">
          Only tools I have used in my projects, at work or in certification coursework, and where I used them.
        </p>
      </PageHeader>

      <section aria-labelledby="matrix-title">
        <Container>
          <div className="trace trace-fill pb-12 md:pb-20">
            <h2 id="matrix-title" className="relative text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
              <Node />
              By area
            </h2>

            <table className="mt-10 w-full border-collapse text-left">
              <caption className="sr-only">Skill groups, the tools in each, and where they were used</caption>
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-rule text-sm text-muted">
                  <th scope="col" className="pb-3 pr-6 font-normal">
                    Area and tools
                  </th>
                  {places.map((p) => (
                    <th key={p} scope="col" className="w-28 pb-3 text-center font-normal">
                      {placeLinks[p] ? (
                        <Link href={placeLinks[p]} className="hover:text-ink">
                          {p}
                        </Link>
                      ) : (
                        p
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {skills.map((g, row) => (
                  <tr
                    key={g.name}
                    id={skillId(g.name)}
                    data-reveal
                    style={{ "--delay": `${Math.min(row, 6) * 40}ms` } as React.CSSProperties}
                    className="block border-b border-rule py-5 md:table-row md:py-0"
                  >
                    <th scope="row" className="block pr-6 text-left font-normal md:table-cell md:py-5 md:align-top">
                      <span className="block text-lg font-semibold tracking-tight">{g.name}</span>
                      <span className="mt-1 block text-muted">{g.items.join(", ")}</span>
                      {g.note && <span className="mt-1 block text-sm text-muted">{g.note}</span>}
                    </th>
                    {places.map((p) => {
                      const used = g.where.includes(p);
                      return (
                        <td
                          key={p}
                          className={`text-sm md:table-cell md:py-5 md:text-center md:align-top ${
                            used ? "mr-4 mt-3 inline-flex items-center gap-2 md:mr-0 md:mt-0" : "hidden"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`inline-block size-3 rounded-full border-[1.5px] md:mt-2 ${
                              used ? "border-accent bg-accent" : "border-rule"
                            }`}
                          />
                          <span className={used ? "md:sr-only" : "sr-only"}>{used ? p : `Not used at ${p}`}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <Terminus />
    </>
  );
}
