"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const projectLinks = [
  { href: "/projects/psells/", label: "PSells", hint: "Inventory and analytics platform on AWS" },
  { href: "/projects/evenly/", label: "Evenly", hint: "Shared expense tracker, secured in PostgreSQL" },
];

const pages = [
  { href: "/experience/", label: "Experience" },
  { href: "/skills/", label: "Skills" },
  { href: "/contact/", label: "Contact" },
];

const normalise = (path: string) => (path.endsWith("/") ? path : `${path}/`);

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={`size-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Projects is a disclosure (a button revealing a list of links), the
// recommended pattern for site navigation rather than an ARIA menu.
function ProjectsMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const inProjects = pathname.startsWith("/projects/");

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapper}
      className="relative"
      // Close when keyboard focus leaves the menu entirely.
      onBlur={(e) => {
        if (open && !wrapper.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="projects-menu"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 py-1 transition-colors ${
          inProjects ? "text-ink underline decoration-accent decoration-2 underline-offset-[0.45em]" : "text-muted hover:text-ink"
        }`}
      >
        Projects
        <Chevron open={open} />
      </button>
      {open && (
        <div
          id="projects-menu"
          className="menu-panel absolute left-1/2 top-full z-30 mt-3 w-80 -translate-x-1/2 rounded-lg border border-rule bg-surface p-2 shadow-[0_18px_40px_-20px_rgb(21_33_44/0.4)]"
        >
          <ul>
            {projectLinks.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === p.href ? "page" : undefined}
                  className="group flex gap-3 rounded-md px-3 py-2.5 hover:bg-paper focus-visible:bg-paper"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-[0.45rem] size-2.5 shrink-0 rounded-full border-[1.5px] border-accent ${
                      pathname === p.href ? "bg-accent" : "group-hover:bg-accent"
                    }`}
                  />
                  <span>
                    <span className="block font-semibold text-ink">{p.label}</span>
                    <span className="block text-sm text-muted">{p.hint}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const pathname = normalise(usePathname() ?? "/");
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating to another page.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = (current: boolean) =>
    `block py-1 transition-colors ${
      current ? "text-ink underline decoration-accent decoration-2 underline-offset-[0.45em]" : "text-muted hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-surface focus:px-3 focus:py-1.5"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <span aria-hidden="true" className="relative size-3.5 rounded-full border-[1.5px] border-accent">
            <span className="absolute inset-[2.5px] rounded-full bg-accent" />
          </span>
          Pierre Makhlouta
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-7 text-[0.9375rem]">
            <li>
              <ProjectsMenu pathname={pathname} />
            </li>
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} aria-current={pathname === p.href ? "page" : undefined} className={linkClass(pathname === p.href)}>
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 flex items-center gap-1.5 rounded p-2 text-[0.9375rem] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
          <Chevron open={open} />
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="menu-panel border-t border-rule px-4 pb-4 pt-2 sm:px-6 md:hidden">
          <ul className="text-lg">
            <li>
              <Link href="/" className={`${linkClass(pathname === "/")} py-2.5`} aria-current={pathname === "/" ? "page" : undefined}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/projects/"
                className={`${linkClass(pathname === "/projects/")} py-2.5`}
                aria-current={pathname === "/projects/" ? "page" : undefined}
              >
                Projects
              </Link>
              <ul className="mb-1 ml-1 border-l border-rule pl-4">
                {projectLinks.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      aria-current={pathname === p.href ? "page" : undefined}
                      className={`${linkClass(pathname === p.href)} py-2 text-base`}
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} aria-current={pathname === p.href ? "page" : undefined} className={`${linkClass(pathname === p.href)} py-2.5`}>
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
