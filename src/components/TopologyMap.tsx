"use client";

import Link from "next/link";
import { useState } from "react";

// The homepage map: Pierre at the centre, the site's pages as linked hubs, and
// the real places and tools behind them as leaves. Everything here is a fact
// from the rest of the site; nothing is a live metric.

type MapNode = {
  id: string;
  label: string;
  angle: number; // degrees, 0 = right, clockwise
  narrowAngle?: number; // override on the phone layout, where space is tighter
  narrowLabel?: string; // shorter label on the phone layout
  ring: 1 | 2;
  parent?: string;
  href?: string;
};

// Every node links somewhere. Six hubs sit 60 degrees apart; leaves deep-link
// into the page their hub opens (a project, a role, a skill row, a certificate).
const nodes: MapNode[] = [
  { id: "projects", label: "Projects", angle: -150, ring: 1, href: "/projects/" },
  { id: "psells", label: "PSells", angle: -174, ring: 2, parent: "projects", href: "/projects/psells/" },
  { id: "evenly", label: "Evenly", angle: -128, ring: 2, parent: "projects", href: "/projects/evenly/" },
  { id: "education", label: "Education", angle: -90, ring: 1, href: "/experience/#education" },
  { id: "york", label: "York University", angle: -102, ring: 2, parent: "education", href: "/experience/#york-university" },
  { id: "brebeuf", label: "Brebeuf College School", angle: -78, ring: 2, parent: "education", href: "/experience/#brebeuf" },
  { id: "experience", label: "Experience", angle: -30, ring: 1, href: "/experience/" },
  { id: "sc", label: "S&C Electric", angle: -56, narrowAngle: -12, ring: 2, parent: "experience", href: "/experience/#sc-electric" },
  // The founder role, not the project: labelled so it can't be confused with Projects > PSells.
  { id: "founder", label: "PSells (founder)", angle: -6, narrowAngle: 4, ring: 2, parent: "experience", href: "/experience/#psells-founder" },
  { id: "skills", label: "Skills", angle: 30, ring: 1, href: "/skills/" },
  { id: "aws", label: "AWS", angle: 16, narrowAngle: 24, ring: 2, parent: "skills", href: "/skills/#cloud" },
  { id: "terraform", label: "Terraform", angle: 40, narrowAngle: 44, ring: 2, parent: "skills", href: "/skills/#infrastructure-as-code" },
  { id: "k8s", label: "Kubernetes", angle: 62, narrowAngle: 64, ring: 2, parent: "skills", href: "/skills/#containers-and-orchestration" },
  { id: "contact", label: "Contact", angle: 90, ring: 1, href: "/contact/" },
  { id: "certifications", label: "Certifications", angle: 150, ring: 1, href: "/experience/#certifications" },
  { id: "m365", label: "Microsoft 365", angle: 160, ring: 2, parent: "certifications", href: "/experience/#cert-microsoft-365" },
  { id: "automation", label: "IT Automation", angle: 144, narrowAngle: 146, ring: 2, parent: "certifications", href: "/experience/#cert-it-automation" },
  { id: "lfca", label: "Linux for LFCA", angle: 128, narrowAngle: 130, ring: 2, parent: "certifications", href: "/experience/#cert-lfca" },
  { id: "ictc", label: "Focus on IT (ICTC)", narrowLabel: "FIT (ICTC)", angle: 112, narrowAngle: 108, ring: 2, parent: "certifications", href: "/experience/#cert-ictc" },
];

// `aspect` is the canvas width / height, so the SVG can share its proportions
// and keep strokes uniform without non-scaling-stroke (which breaks dashes).
type Layout = { sx: number; sy: number; r1: number; r2: number; aspect: number };
const layouts: Record<"wide" | "narrow", Layout> = {
  wide: { sx: 0.8, sy: 0.92, r1: 26, r2: 44, aspect: 1 },
  narrow: { sx: 0.56, sy: 0.92, r1: 25, r2: 44, aspect: 2 / 3 },
};

const CENTER = { x: 50, y: 50 };

// Math.cos/sin can differ in the last few bits between the server (Node) and
// some browsers (Safari), which made the rendered style and path attributes
// mismatch on hydration. Rounding gives every engine the same strings.
const round = (v: number) => Math.round(v * 1000) / 1000;

function position(n: MapNode, l: Layout) {
  const r = n.ring === 1 ? l.r1 : l.r2;
  const a = (((l === layouts.narrow && n.narrowAngle !== undefined) ? n.narrowAngle : n.angle) * Math.PI) / 180;
  return { x: round(CENTER.x + r * Math.cos(a) * l.sx), y: round(CENTER.y + r * Math.sin(a) * l.sy) };
}

// Load sequence: centre, then hubs, then leaves, each arriving as its edge does.
const HUB_EDGE = 150;
const LEAF_EDGE = 800;
const EDGE_MS = 700;

function Canvas({ layout, active, setActive }: { layout: Layout; active: string | null; setActive: (id: string | null) => void }) {
  const pos = Object.fromEntries(nodes.map((n) => [n.id, position(n, layout)]));
  const chain = new Set<string>();
  if (active) {
    const n = nodes.find((m) => m.id === active);
    if (n) {
      chain.add(n.id);
      if (n.parent) chain.add(n.parent);
    }
  }

  // SVG space: 100 wide, 100/aspect tall; node positions are percentages.
  const vh = 100 / layout.aspect;
  const edges = nodes.map((n) => {
    const from = n.parent ? pos[n.parent] : CENTER;
    const to = pos[n.id];
    return {
      id: n.id,
      d: `M${from.x} ${round((from.y * vh) / 100)} L${to.x} ${round((to.y * vh) / 100)}`,
      delay: n.ring === 1 ? HUB_EDGE : LEAF_EDGE,
    };
  });

  return (
    <>
      <svg viewBox={`0 0 100 ${vh}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {edges.map((e) => (
          <path
            key={e.id}
            d={e.d}
            pathLength={1}
            className="map-edge"
            data-active={chain.has(e.id) ? "" : undefined}
            style={{ "--d": `${e.delay}ms` } as React.CSSProperties}
          />
        ))}
        {edges.map((e) => (
          <path
            key={`s-${e.id}`}
            d={e.d}
            pathLength={1}
            className="map-signal"
            data-active={chain.has(e.id) ? "" : undefined}
          />
        ))}
      </svg>

      {/* Centre */}
      <div
        className="map-node absolute flex size-14 items-center justify-center rounded-full bg-ink text-lg font-bold tracking-tight text-paper shadow-[0_0_0_6px_var(--paper),0_0_0_7px_var(--rule)] md:size-16"
        style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
        aria-hidden="true"
      >
        PM
      </div>

      {nodes.map((n) => {
        const p = pos[n.id];
        const left = p.x < CENTER.x - 1;
        const below = n.ring === 1 && n.angle > 60 && n.angle < 120;
        const top = n.ring === 1 && n.angle < -60 && n.angle > -120;
        const delay = (n.ring === 1 ? HUB_EDGE : LEAF_EDGE) + EDGE_MS - 150;
        const hub = n.ring === 1;
        const on = chain.has(n.id);
        const dot = (
          <span
            aria-hidden="true"
            className={`block rounded-full border-[1.5px] transition-colors ${
              hub ? "size-4" : "size-2.5"
            } ${n.href ? "border-accent" : "border-muted"} ${on ? "bg-accent" : "bg-paper"} ${
              hub ? "shadow-[0_0_0_4px_var(--paper)]" : "shadow-[0_0_0_3px_var(--paper)]"
            }`}
          />
        );
        const label = (
          <span
            className={`absolute whitespace-nowrap ${
              hub
                ? below
                  ? // The bottom hub: label centred under the dot, in open space.
                    "left-1/2 top-full mt-1.5 -translate-x-1/2"
                  : top
                  ? // The top hub: label beside the dot, clear of the edges rising past it.
                    "left-full top-1/2 ml-2.5 -translate-y-1/2"
                  : // Other hubs: label just above the dot, offset outward, clear of every edge.
                    `bottom-full mb-1 ${left ? "right-1/2 mr-2 text-right" : "left-1/2 ml-2"}`
                : `top-1/2 -translate-y-1/2 max-md:w-max max-md:max-w-[5.25rem] max-md:whitespace-normal max-md:leading-tight ${
                    left ? "right-full mr-2.5 text-right" : "left-full ml-2.5"
                  }`
            } ${hub ? "text-base font-semibold md:text-lg" : "text-sm"} ${
              on ? "text-accent" : hub ? "text-ink" : "text-muted"
            } ${n.href ? "decoration-accent decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline" : ""}`}
          >
            {layout === layouts.narrow && n.narrowLabel ? n.narrowLabel : n.label}
          </span>
        );
        const style = { left: `${p.x}%`, top: `${p.y}%`, "--d": `${delay}ms` } as React.CSSProperties;
        return n.href ? (
          <Link
            key={n.id}
            href={n.href}
            className="map-node group absolute rounded-full outline-offset-4"
            style={style}
            onPointerEnter={() => setActive(n.id)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(n.id)}
            onBlur={() => setActive(null)}
          >
            {dot}
            {label}
          </Link>
        ) : (
          <span key={n.id} className="map-node absolute" style={style} aria-hidden="true">
            {dot}
            {label}
          </span>
        );
      })}
    </>
  );
}

export default function TopologyMap() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <nav aria-label="Site map" className="relative">
      <div className="relative mx-auto hidden aspect-square w-[90%] max-w-[42rem] md:block">
        <div aria-hidden="true" className="dot-grid dot-grid-fade absolute inset-0" />
        <Canvas layout={layouts.wide} active={active} setActive={setActive} />
      </div>
      <div className="relative mx-auto aspect-[2/3] w-full md:hidden">
        <div aria-hidden="true" className="dot-grid dot-grid-fade absolute inset-0" />
        <Canvas layout={layouts.narrow} active={active} setActive={setActive} />
      </div>
    </nav>
  );
}
