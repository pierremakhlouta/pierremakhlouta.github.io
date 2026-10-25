import Link from "next/link";
import type { ReactNode } from "react";
import { person } from "@/content/profile";

export const external = { target: "_blank", rel: "noopener noreferrer" } as const;

// Plain <a> links to files in /public don't get the base path automatically
// (only next/link and imported images do), so add it here at build time.
export const publicPath = (path: string) => `${process.env.BASE_PATH ?? ""}${path}`;

// Page-width wrapper shared by every page so gutters line up with the header.
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-page px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

// A node on the page's trace. Placed inside a heading so it aligns with the
// heading's first line; comes online when scrolled into view.
export function Node({ square }: { square?: boolean }) {
  return <span data-node aria-hidden="true" className={`node ${square ? "node-square" : ""}`} />;
}

type Crumb = { href?: string; label: string };

// The top of a page: where its trace begins.
export function PageHeader({
  title,
  crumbs,
  children,
  wide,
}: {
  title: string;
  crumbs: Crumb[];
  children?: ReactNode;
  wide?: boolean;
}) {
  return (
    <Container>
      <nav aria-label="Breadcrumb" className="trace trace-bare pt-10 text-sm text-muted md:pt-14">
        <ol className="flex flex-wrap gap-2">
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-ink">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="trace trace-start mt-10 pb-12 md:pb-16 [--title:clamp(2.75rem,8vw,5.75rem)] [--trace-start:calc(var(--title)*0.5)]">
        <h1 className="relative text-[length:var(--title)] font-bold leading-[0.95] tracking-[-0.045em]">
          <span aria-hidden="true" className="node node-square" data-node data-online="" style={{ top: "calc(0.5em - 7.5px)" }} />
          {title}
        </h1>
        {children && <div className={`mt-6 ${wide ? "" : "max-w-[60ch]"}`}>{children}</div>}
      </div>
    </Container>
  );
}

// A titled band on the trace. `wide` stacks the heading above full-width
// content (galleries, diagrams); otherwise the heading rides a sticky left column.
export function Section({
  id,
  title,
  children,
  aside,
  wide,
}: {
  id: string;
  title: string;
  children: ReactNode;
  aside?: ReactNode;
  wide?: boolean;
}) {
  const heading = (
    <h2 id={`${id}-title`} className="relative text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
      <Node />
      {title}
    </h2>
  );
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <Container>
        <div className="trace trace-fill py-12 md:py-20">
          {wide ? (
            <>
              {heading}
              {aside}
              <div className="mt-8 md:mt-10">{children}</div>
            </>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
              <div className="lg:sticky lg:top-24 lg:self-start">
                {heading}
                {aside}
              </div>
              <div className="min-w-0">{children}</div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

// The end of a page's trace: a square terminal node, optionally with a closing line.
export function Terminus({ children }: { children?: ReactNode }) {
  if (!children) {
    return (
      <Container>
        <div className="trace trace-end pb-20 md:pb-28 [--trace-end:0.5rem]">
          <div className="relative h-4">
            <span aria-hidden="true" data-node className="node node-square" style={{ top: 0 }} />
          </div>
        </div>
      </Container>
    );
  }
  return (
    <Container>
      <div className="trace trace-end pb-20 pt-8 [--trace-end:2.6rem] md:pb-28 md:pt-12 md:[--trace-end:3.4rem]">
        <div className="relative">
          <span aria-hidden="true" data-node className="node node-square" style={{ top: "calc(0.85em - 7.5px)" }} />
          {children}
        </div>
      </div>
    </Container>
  );
}

export function Dash({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-5 before:absolute before:left-0 before:top-[0.8em] before:h-px before:w-2.5 before:bg-muted">
      {children}
    </li>
  );
}

export function SiteFooter() {
  const links = [
    { href: "/projects/", label: "Projects" },
    { href: "/experience/", label: "Experience" },
    { href: "/skills/", label: "Skills" },
    { href: "/contact/", label: "Contact" },
  ];
  return (
    <footer className="border-t border-rule">
      <Container className="flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-baseline sm:justify-between">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
            {person.resume && (
              <li>
                <a href={publicPath(person.resume)} download className="hover:text-ink">
                  Resume (PDF)
                </a>
              </li>
            )}
          </ul>
        </nav>
        <p>
          {person.name}, {person.locationLong}
        </p>
      </Container>
    </footer>
  );
}
