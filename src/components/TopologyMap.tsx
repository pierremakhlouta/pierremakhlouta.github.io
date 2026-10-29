"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { MapHub } from "@/content/sitemap";

// The homepage map: Pierre at the centre and the site's sections as hubs. Only
// one hub is open at a time. Its items fan out as small unlabelled nodes and are
// listed, with labels, in the panel below, so no text can collide however much
// content there is. Hovering an item in the panel lights its node.
// Everything here is a fact from the rest of the site; nothing is a live metric.

// `aspect` is the canvas width / height, so the SVG can share its proportions
// and keep strokes uniform without non-scaling-stroke (which breaks dashes).
// `spread` is the angle between item nodes; `maxFan` caps the whole fan, so a
// hub with many items packs them closer instead of reaching its neighbours.
type Layout = { sx: number; sy: number; r1: number; r2: number; aspect: number; spread: number; maxFan: number; maxLeaves: number };
const layouts: Record<"wide" | "narrow", Layout> = {
  wide: { sx: 0.8, sy: 0.92, r1: 26, r2: 42, aspect: 1, spread: 8, maxFan: 56, maxLeaves: 8 },
  narrow: { sx: 0.58, sy: 0.92, r1: 25, r2: 42, aspect: 5 / 6, spread: 10, maxFan: 48, maxLeaves: 6 },
};

// `maxLeaves`: at most this many item nodes are drawn around the open hub; the
// panel always lists every item.

const CENTER = { x: 50, y: 50 };

// Math.cos/sin can differ in the last few bits between the server (Node) and
// some browsers (Safari), which made rendered attributes mismatch on hydration.
// Rounding gives every engine the same strings.
const round = (v: number) => Math.round(v * 1000) / 1000;

function polar(angle: number, r: number, l: Layout) {
  const a = (angle * Math.PI) / 180;
  return { x: round(CENTER.x + r * Math.cos(a) * l.sx), y: round(CENTER.y + r * Math.sin(a) * l.sy) };
}

// Side hubs carry their label beside the dot, on the outer side, so their items
// fan out rotated toward the vertical, away from it; top and bottom hubs fan
// straight outward.
function fanCenter(angle: number) {
  const r = (angle * Math.PI) / 180;
  if (Math.abs(Math.cos(r)) < 0.2) return angle;
  const vertical = Math.sin(r) < 0 ? -90 : 90;
  return angle + 25 * Math.sign(vertical - angle);
}

// Load sequence: centre, then hubs, then the open hub's leaves.
const HUB_EDGE = 150;
const LEAF_EDGE = 800;
const EDGE_MS = 700;

type CanvasProps = {
  hubs: MapHub[];
  layout: Layout;
  open: string;
  highlight: string | null;
  litItem: number | null;
  firstRender: boolean;
  panelId: string;
  onPreview: (id: string | null) => void;
  onSelect: (id: string) => void;
};

function Canvas({ hubs, layout, open, highlight, litItem, firstRender, panelId, onPreview, onSelect }: CanvasProps) {
  const vh = 100 / layout.aspect;
  const sy = (y: number) => round((y * vh) / 100);
  const hub = hubs.find((h) => h.id === open) ?? hubs[0];
  const hubPos = polar(hub.angle, layout.r1, layout);
  const leaves = hub.items.slice(0, layout.maxLeaves);
  const center = fanCenter(hub.angle);
  const step = leaves.length > 1 ? Math.min(layout.spread, layout.maxFan / (leaves.length - 1)) : 0;
  const leafPos = leaves.map((_, i) => polar(center + (i - (leaves.length - 1) / 2) * step, layout.r2, layout));
  const leafDelay = firstRender ? LEAF_EDGE : 0;

  return (
    <>
      <svg viewBox={`0 0 100 ${vh}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {hubs.map((h) => {
          const p = polar(h.angle, layout.r1, layout);
          const d = `M${CENTER.x} ${sy(CENTER.y)} L${p.x} ${sy(p.y)}`;
          const on = h.id === open || h.id === highlight;
          return (
            <g key={h.id}>
              <path d={d} pathLength={1} className="map-edge" data-active={on ? "" : undefined} style={{ "--d": `${HUB_EDGE}ms` } as React.CSSProperties} />
              <path d={d} pathLength={1} className="map-signal" data-active={h.id === highlight ? "" : undefined} />
            </g>
          );
        })}
        {/* Keyed by hub, so switching hubs redraws the leaf edges from the hub outward. */}
        <g key={hub.id}>
          {leafPos.map((p, i) => (
            <path
              key={i}
              d={`M${hubPos.x} ${sy(hubPos.y)} L${p.x} ${sy(p.y)}`}
              pathLength={1}
              className="map-edge"
              data-active=""
              style={{ "--d": `${leafDelay}ms` } as React.CSSProperties}
            />
          ))}
          {leafPos.map((p, i) => (
            <path
              key={`s-${i}`}
              d={`M${hubPos.x} ${sy(hubPos.y)} L${p.x} ${sy(p.y)}`}
              pathLength={1}
              className="map-signal"
              data-active={litItem === i ? "" : undefined}
            />
          ))}
        </g>
      </svg>

      {/* Centre */}
      <div
        className="map-node absolute flex size-14 items-center justify-center rounded-full bg-ink text-lg font-bold tracking-tight text-paper shadow-[0_0_0_6px_var(--paper),0_0_0_7px_var(--rule)] md:size-16"
        style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
        aria-hidden="true"
      >
        PM
      </div>

      {hubs.map((h) => {
        const p = polar(h.angle, layout.r1, layout);
        const isOpen = h.id === open;
        const lit = isOpen || h.id === highlight;
        const left = p.x < CENTER.x - 1;
        const below = h.angle > 60 && h.angle < 120;
        const top = h.angle < -60 && h.angle > -120;
        return (
          <button
            key={h.id}
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => onSelect(h.id)}
            onPointerEnter={() => onPreview(h.id)}
            onPointerLeave={() => onPreview(null)}
            onFocus={() => onPreview(h.id)}
            onBlur={() => onPreview(null)}
            className="map-node group absolute rounded-full outline-offset-4"
            style={{ left: `${p.x}%`, top: `${p.y}%`, "--d": `${HUB_EDGE + EDGE_MS - 150}ms` } as React.CSSProperties}
          >
            <span
              aria-hidden="true"
              className={`block size-4 rounded-full border-[1.5px] border-accent shadow-[0_0_0_4px_var(--paper)] transition-colors ${
                lit ? "bg-accent" : "bg-paper"
              }`}
            />
            <span
              className={`absolute whitespace-nowrap text-base font-semibold md:text-lg ${
                below
                  ? "left-1/2 top-full mt-1.5 -translate-x-1/2"
                  : top
                    ? "left-full top-1/2 ml-2.5 -translate-y-1/2"
                    : `top-1/2 -translate-y-1/2 ${left ? "right-full mr-2.5 text-right" : "left-full ml-2.5"}`
              } ${lit ? "text-accent" : "text-ink"} decoration-accent decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline`}
            >
              {h.label}
              <span className="sr-only">, {h.items.length} items</span>
            </span>
          </button>
        );
      })}

      {/* The open hub's items as small nodes; their labels are in the panel. */}
      <div key={hub.id} aria-hidden="true">
        {leafPos.map((p, i) => (
          <span
            key={i}
            className="map-node absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%`, "--d": `${leafDelay + EDGE_MS - 150}ms` } as React.CSSProperties}
          >
            <span
              className={`block size-2.5 rounded-full border-[1.5px] border-accent shadow-[0_0_0_3px_var(--paper)] transition-colors ${
                litItem === i ? "bg-accent" : "bg-paper"
              }`}
            />
          </span>
        ))}
      </div>
    </>
  );
}

export default function TopologyMap({ hubs }: { hubs: MapHub[] }) {
  const [open, setOpen] = useState(hubs[0]?.id ?? "");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [litItem, setLitItem] = useState<number | null>(null);
  const [firstRender, setFirstRender] = useState(true);
  const panelId = useId();
  const hub = hubs.find((h) => h.id === open) ?? hubs[0];

  const select = (id: string) => {
    setFirstRender(false);
    setLitItem(null);
    setOpen(id);
  };
  const preview = (id: string | null) => {
    setHighlight(id);
  };
  const canvas = (layout: Layout) => (
    <Canvas
      hubs={hubs}
      layout={layout}
      open={open}
      highlight={highlight}
      litItem={litItem}
      firstRender={firstRender}
      panelId={panelId}
      onPreview={preview}
      onSelect={select}
    />
  );

  return (
    <nav aria-label="Site map" className="relative">
      <div className="relative mx-auto hidden aspect-square w-[90%] max-w-[42rem] md:block">
        <div aria-hidden="true" className="dot-grid dot-grid-fade absolute inset-0" />
        {canvas(layouts.wide)}
      </div>
      <div className="relative mx-auto aspect-[5/6] w-full md:hidden">
        <div aria-hidden="true" className="dot-grid dot-grid-fade absolute inset-0" />
        {canvas(layouts.narrow)}
      </div>

      {/* Everything in the open hub, as a plain list. */}
      <section id={panelId} aria-live="polite" aria-labelledby={`${panelId}-title`} className="mx-auto mt-4 max-w-[34rem] border-t border-rule pt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id={`${panelId}-title`} className="text-lg font-semibold tracking-tight">
            {hub.label}
          </h2>
          <Link href={hub.href} className="link text-sm">
            {hub.hrefLabel}
          </Link>
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
          {hub.items.map((item, i) => (
            <li
              key={item.href + item.label}
              onPointerEnter={() => setLitItem(i)}
              onPointerLeave={() => setLitItem(null)}
              onFocus={() => setLitItem(i)}
              onBlur={() => setLitItem(null)}
            >
              {item.external ? (
                <a href={item.href} className="link text-[0.9375rem]" {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {item.label}
                </a>
              ) : (
                <Link href={item.href} className="link text-[0.9375rem]">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>
    </nav>
  );
}
