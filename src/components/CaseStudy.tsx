import Link from "next/link";
import type { ReactNode } from "react";
import CopyButton from "@/components/CopyButton";
import Gallery from "@/components/Gallery";
import Screenshot from "@/components/Screenshot";
import { Container, Dash, Section, Terminus, external } from "@/components/layout";
import { isPending, liveLink, type Project } from "@/content/projects";

type Props = {
  project: Project;
  diagram: ReactNode;
  // Extra content placed under a detail section, keyed by section id.
  extras?: Record<string, ReactNode>;
};

export function Metrics({ results, className = "" }: { results: Project["results"]; className?: string }) {
  return (
    <dl className={`grid grid-cols-2 gap-x-6 gap-y-6 ${results.length > 2 ? "lg:grid-cols-4" : ""} ${className}`}>
      {results.map((r) => (
        <div key={r.label} className="flex flex-col">
          <dt className="order-2 mt-1 text-sm text-muted">{r.label}</dt>
          <dd className="order-1 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProjectLinks({ project, className = "" }: { project: Project; className?: string }) {
  const live = liveLink(project);
  return (
    <div className={className}>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <a href={project.repo.href} {...external} className="link font-medium">
            {project.repo.label}
          </a>
        </li>
        {live && (
          <li>
            <a href={live.href} {...external} className="link font-medium">
              {live.label}
            </a>
            {live.note && <span className="ml-2 text-sm text-muted">{live.note}</span>}
          </li>
        )}
      </ul>
      {!live && project.access && <p className="mt-2 max-w-[52ch] text-sm text-muted">{project.access}</p>}
    </div>
  );
}

function DemoAccess({ project }: { project: Project }) {
  const access = project.demoAccess;
  if (!access || !liveLink(project)) return null;
  const rows = [
    { label: "Username", value: access.username },
    { label: "Password", value: access.password },
  ];
  return (
    <section aria-labelledby="demo-access" className="mt-6 max-w-md rounded-lg border border-rule bg-surface px-4 py-3.5">
      <h2 id="demo-access" className="font-semibold">
        Demo access
      </h2>
      <dl className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <dt className="w-20 text-sm text-muted">{r.label}</dt>
            <dd className="flex items-center gap-3">
              <code className="rounded bg-paper px-1.5 py-0.5 font-mono text-[0.9375rem]">{r.value}</code>
              <CopyButton value={r.value} label={`demo ${r.label.toLowerCase()}`} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-sm text-muted">{access.note}</p>
    </section>
  );
}

export default function CaseStudy({ project, diagram, extras = {} }: Props) {
  const phones = project.hero.every((s) => s.frame === "phone");
  const gallery = project.gallery.filter((s) => !isPending(s) || process.env.NODE_ENV !== "production");
  const live = liveLink(project);

  return (
    <article aria-labelledby="project-title">
      {/* Introduction: where the page's trace begins */}
      <Container>
        <nav aria-label="Breadcrumb" className="trace trace-bare pt-10 text-sm text-muted md:pt-14">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/projects/" className="hover:text-ink">
                Projects
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {project.name}
            </li>
          </ol>
        </nav>

        <div className="trace trace-start mt-10 pb-6 md:pb-8 [--title:clamp(3rem,9vw,6.5rem)] [--trace-start:calc(var(--title)*0.5)]">
          <div className={`grid gap-12 ${phones ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center" : ""}`}>
            <div>
              <h1 id="project-title" className="relative text-[length:var(--title)] font-bold leading-[0.92] tracking-[-0.05em]">
                <span aria-hidden="true" className="node node-square" data-node data-online="" style={{ top: "calc(0.5em - 7.5px)" }} />
                {project.name}
              </h1>
              <p className="mt-6 max-w-[34ch] text-xl leading-snug md:text-2xl">{project.tagline}</p>
              <p className="mt-5 max-w-[60ch] text-muted">{project.summary}</p>
              <ProjectLinks project={project} className="mt-6" />
              <DemoAccess project={project} />
              <p className="sr-only">Technologies used:</p>
              <ul className="mt-7 flex max-w-2xl flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <li key={s} className="rounded border border-rule px-2 py-0.5 text-sm text-muted">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {phones ? (
              <div className="grid grid-cols-2 items-start gap-4 sm:gap-8">
                {project.hero.map((shot, i) => (
                  <Screenshot
                    key={shot.alt}
                    shot={shot}
                    priority
                    sizes="(min-width: 1024px) 272px, 45vw"
                    className={i % 2 === 1 ? "mt-12" : ""}
                  />
                ))}
              </div>
            ) : (
              project.hero.map((shot) => (
                <Screenshot
                  key={shot.alt}
                  shot={shot}
                  priority
                  sizes="(min-width: 1400px) 1040px, 100vw"
                  className="lg:mx-auto lg:w-[82%]"
                />
              ))
            )}
          </div>
        </div>
      </Container>

      <Section id="overview" title="Overview">
        <dl className="grid gap-8 md:grid-cols-3">
          {project.overview.map((o) => (
            <div key={o.label}>
              <dt className="font-semibold">{o.label}</dt>
              <dd className="mt-2 text-muted">{o.body}</dd>
            </div>
          ))}
        </dl>
        <Metrics results={project.results} className="mt-12 border-y border-rule py-7" />
        <h3 className="mt-12 text-xl font-semibold tracking-tight">What it does</h3>
        <ul className="mt-4 grid max-w-4xl gap-x-10 gap-y-2.5 text-muted md:grid-cols-2">
          {project.features.map((f) => (
            <Dash key={f}>{f}</Dash>
          ))}
        </ul>
      </Section>

      <Section id="screens" title="Screens" wide>
        {project.slug === "psells" && (
          <p className="-mt-4 mb-10 max-w-[60ch] text-muted md:-mt-6">
            Captured from the public demo, which holds invented records only.
          </p>
        )}
        <Gallery
          shots={gallery}
          sizes={phones ? "(min-width: 1024px) 300px, 45vw" : "(min-width: 1024px) 520px, 100vw"}
          className={`grid gap-x-8 gap-y-12 ${
            phones ? `grid-cols-2 ${gallery.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}` : "lg:grid-cols-2"
          }`}
        />
      </Section>

      <Section id="architecture" title="Architecture" wide>
        {diagram}
      </Section>

      <Section
        id="details"
        title="How it's built"
        aside={
          <nav aria-label="On this page" className="mt-5 hidden lg:block">
            <ul className="space-y-2 text-[0.9375rem]">
              {project.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted hover:text-ink">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      >
        <div className="space-y-14 md:space-y-16">
          {project.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`}>
              <h3 id={`${s.id}-heading`} className="text-xl font-semibold tracking-tight md:text-2xl">
                {s.heading}
              </h3>
              <p className="mt-2 max-w-[56ch] text-lg">{s.summary}</p>
              <ul className="mt-4 max-w-[68ch] space-y-2.5 text-muted">
                {s.points.map((pt) => (
                  <Dash key={pt}>{pt}</Dash>
                ))}
              </ul>
              {extras[s.id] && <div className="mt-8">{extras[s.id]}</div>}
            </section>
          ))}
        </div>
      </Section>

      <Section id="challenges" title="Challenges and decisions">
        <dl className="grid gap-x-10 gap-y-9 lg:grid-cols-2">
          {project.challenges.map((c) => (
            <div key={c.title} className="border-l-2 border-accent pl-5">
              <dt className="text-lg font-semibold leading-snug">{c.title}</dt>
              <dd className="mt-1.5 text-muted">{c.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Terminus>
        <p className="max-w-[38ch] text-xl leading-snug md:text-2xl">{project.closing}</p>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-lg">
          <li>
            <a href={project.repo.href} {...external} className="link font-semibold">
              Read the {project.name} source
            </a>
          </li>
          {live && (
            <li>
              <a href={live.href} {...external} className="link">
                Try the demo
              </a>
            </li>
          )}
        </ul>
      </Terminus>
    </article>
  );
}
