import type { Metadata } from "next";
import Link from "next/link";
import { Metrics, ProjectLinks } from "@/components/CaseStudy";
import { Container, Node, PageHeader, Terminus } from "@/components/layout";
import Screenshot from "@/components/Screenshot";
import { projects, type Project } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "PSells and Evenly: two systems with real daily users, each built and run like a production service.",
};

// Text always leads on the left so every project's node sits on the trace.
function ProjectEntry({ project }: { project: Project }) {
  const phones = project.hero.every((s) => s.frame === "phone");
  return (
    <article aria-labelledby={`${project.slug}-entry`} className="trace trace-fill py-12 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <h2 id={`${project.slug}-entry`} className="relative text-4xl font-bold tracking-[-0.035em] md:text-[3.5rem] md:leading-none">
            <Node />
            <Link href={`/projects/${project.slug}/`} className="hover:text-accent">
              {project.name}
            </Link>
          </h2>
          <p className="mt-4 text-lg leading-snug md:text-xl">{project.tagline}</p>
          <p className="mt-4 max-w-[52ch] text-muted">{project.summary}</p>
          <Metrics results={project.results.slice(0, 2)} className="mt-7 border-y border-rule py-5" />
          <p className="mt-7">
            <Link
              href={`/projects/${project.slug}/`}
              className="inline-block rounded-md bg-ink px-4 py-2.5 font-medium text-paper transition-colors hover:bg-accent"
            >
              Read the {project.name} case study
            </Link>
          </p>
          <ProjectLinks project={project} className="mt-5" />
        </div>
        <div>
          {phones ? (
            <div className="grid grid-cols-2 items-start gap-4 sm:gap-8">
              {project.hero.map((shot, i) => (
                <Screenshot
                  key={shot.alt}
                  shot={shot}
                  showCaption={false}
                  sizes="(min-width: 1024px) 272px, 45vw"
                  className={i % 2 === 1 ? "mt-12" : ""}
                />
              ))}
            </div>
          ) : (
            project.hero.map((shot) => (
              <Screenshot key={shot.alt} shot={shot} showCaption={false} sizes="(min-width: 1024px) 640px, 100vw" />
            ))
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="Projects" crumbs={[{ href: "/", label: "Home" }, { label: "Projects" }]}>
        <p className="text-lg md:text-xl">
          Two systems with real daily users. Each one is built, deployed and run with the habits of a production
          service.
        </p>
      </PageHeader>
      <Container>
        {projects.map((p) => (
          <ProjectEntry key={p.slug} project={p} />
        ))}
      </Container>
      <Terminus>
        <p className="max-w-[40ch] text-xl leading-snug md:text-2xl">
          Both repositories are public, with their architecture and design decisions written up alongside the code.
        </p>
      </Terminus>
    </>
  );
}
