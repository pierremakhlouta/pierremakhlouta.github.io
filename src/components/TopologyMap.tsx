"use client";

import Link from "next/link";
import { useState } from "react";
import type { MapHub, MapItem } from "@/content/sitemap";

// The homepage map: Pierre at the centre and the site's sections as hubs. Only
// one hub is open at a time; its items branch out from it as labelled leaves,
// stacked in a column (side hubs) or a row (top and bottom hubs) so labels line
// up. Each hub shows a few leaves at most, the last reading "+N more" when there
// are too many, so the map stays readable however much content is added.
// Everything here is a fact from the rest of the site; nothing is a live metric.

// `aspect` is the canvas width / height, so the SVG can share its proportions
// and keep strokes uniform without non-scaling-stroke (which breaks dashes).
// Leaves of a side hub stack in a vertical branch `colGap` apart, growing away
// from the middle of the map (up from upper hubs, down from lower ones) and
// nudged `colDx` outward; leaves of the top and bottom hubs sit in a row
// `rowDy` away, `rowGap` apart. All distances are percentages of the canvas.
type Layout = {
  sx: number;
  sy: number;
  r1: number;
  aspect: number;
  colDx: number;
  colGap: number;
  rowDy: number;
  rowGap: number;
  rowSpan: number;
  maxLeaves: number;
};
const layouts: Record<"wide" | "narrow", Layout> = {
  wide: { sx: 0.8, sy: 0.92, r1: 26, aspect: 1, colDx: 3, colGap: 8, rowDy: 14, rowGap: 28, rowSpan: 64, maxLeaves: 4 },
  narrow: { sx: 0.58, sy: 0.92, r1: 25, aspect: 5 / 6, colDx: 3, colGap: 9.5, rowDy: 13, rowGap: 40, rowSpan: 56, maxLeaves: 4 },
};

const CENTER = { x: 50, y: 50 };

// Math.cos/sin can differ in the last few bits between the server (Node) and
// some browsers (Safari), which made rendered attributes mismatch on hydration.
// Rounding gives every engine the same strings.
const round = (v: number) => Math.round(v * 1000) / 1000;

function polar(angle: number, r: number, l: Layout) {
  const a = (angle * Math.PI) / 180;
  return { x: round(CENTER.x + r * Math.cos(a) * l.sx), y: round(CENTER.y + r * Math.sin(a) * l.sy) };
}

type Side = "left" | "right" | "top" | "bottom";

function sideOf(angle: number): Side {
  const r = (angle * Math.PI) / 180;
  if (Math.abs(Math.cos(r)) < 0.2) return Math.sin(r) < 0 ? "top" : "bottom";
  return Math.cos(r) < 0 ? "left" : "right";
}

// Leaf positions: a vertical branch from a side hub, starting just past the
// hub's own label, or a row beyond the top or bottom hub, so labels line up and
// can't run into each other.
function leafPositions(hubPos: { x: number; y: number }, side: Side, n: number, l: Layout) {
  return Array.from({ length: n }, (_, i) => {
    if (side === "left" || side === "right") {
      const away = hubPos.y < CENTER.y ? -1 : 1;
      return { x: round(hubPos.x + (side === "left" ? -l.colDx : l.colDx)), y: round(hubPos.y + away * (i + 0.85) * l.colGap) };
    }
    const offset = i - (n - 1) / 2;
    const gap = n > 1 ? Math.min(l.rowGap, l.rowSpan / (n - 1)) : 0;
    return { x: round(hubPos.x + offset * gap), y: round(hubPos.y + (side === "top" ? -l.rowDy : l.rowDy)) };
  });
}

// The leaves drawn for a hub: its items, or the first few plus a "+N more" leaf
// that opens the hub's page.
function leavesFor(hub: MapHub, max: number): MapItem[] {
  if (hub.items.length <= max) return hub.items;
  const shown = hub.items.slice(0, max - 1);
  return [...shown, { label: `+${hub.items.length - shown.length} more`, href: hub.href }];
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
  firstRender: boolean;
  onPreview: (id: string | null) => void;
  onSelect: (id: string) => void;
};

function Canvas({ hubs, layout, open, highlight, firstRender, onPreview, onSelect }: CanvasProps) {
  const narrow = layout === layouts.narrow;
  const vh = 100 / layout.aspect;
  const sy = (y: number) => round((y * vh) / 100);
  const hub = hubs.find((h) => h.id === open) ?? hubs[0];
  const hubPos = polar(hub.angle, layout.r1, layout);
  const leaves = leavesFor(hub, layout.maxLeaves);
  const side = sideOf(hub.angle);
  const leafPos = leafPositions(hubPos, side, leaves.length, layout);
  const leafDelay = firstRender ? LEAF_EDGE : 0;
  const leafGroup = `map-${hub.id}-${narrow ? "narrow" : "wide"}`;

  return (
    <>
      <svg viewBox={`0 0 100 ${vh}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {hubs.map((h) => {
          const p = polar(h.angle, layout.r1, layout);
          const d = `M${CENTER.x} ${sy(CENTER.y)} L${p.x} ${sy(p.y)}`;
          return (
            <g key={h.id}>
              <path
                d={d}
                pathLength={1}
                className="map-edge"
                data-active={h.id === open || h.id === highlight ? "" : undefined}
                style={{ "--d": `${HUB_EDGE}ms` } as React.CSSProperties}
              />
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
              style={{ "--d": `${leafDelay}ms` } as React.CSSProperties}
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
        const hSide = sideOf(h.angle);
        return (
          <button
            key={h.id}
            type="button"
            aria-expanded={isOpen}
            aria-controls={isOpen ? leafGroup : undefined}
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
                // Top and bottom labels sit above and below their dots, clear of the
                // side hubs' branches, and move beside the dot when that hub's own
                // row of leaves opens in their place.
                isOpen && (hSide === "top" || hSide === "bottom")
                  ? "left-full top-1/2 ml-2.5 -translate-y-1/2"
                  : hSide === "top"
                    ? "bottom-full left-1/2 mb-1.5 -translate-x-1/2"
                    : hSide === "bottom"
                      ? "left-1/2 top-full mt-1.5 -translate-x-1/2"
                      : `top-1/2 -translate-y-1/2 ${hSide === "left" ? "right-full mr-2.5 text-right" : "left-full ml-2.5"}`
              } ${lit ? "text-accent" : "text-ink"} decoration-accent decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline`}
            >
              {h.label}
              <span className="sr-only">, {h.items.length} items</span>
            </span>
          </button>
        );
      })}

      {/* The open hub's leaves, each a link with its label at the end. */}
      <ul key={hub.id} id={leafGroup} aria-label={hub.label}>
        {leaves.map((item, i) => {
          const p = leafPos[i];
          const rowPart = i - (leaves.length - 1) / 2;
          const label = narrow && item.short ? item.short : item.label;
          const className = "map-node group absolute rounded-full outline-offset-4";
          const style = { left: `${p.x}%`, top: `${p.y}%`, "--d": `${leafDelay + EDGE_MS - 150}ms` } as React.CSSProperties;
          const content = (
            <>
              <span aria-hidden="true" className="block size-2.5 rounded-full border-[1.5px] border-accent bg-paper shadow-[0_0_0_3px_var(--paper)] transition-colors group-hover:bg-accent group-focus-visible:bg-accent" />
              <span
                className={`absolute w-max text-sm leading-tight text-muted decoration-accent decoration-2 underline-offset-4 group-hover:text-accent group-hover:underline group-focus-visible:text-accent group-focus-visible:underline ${
                  narrow ? "max-w-[7rem]" : "max-w-[10rem]"
                } ${
                  side === "left"
                    ? "right-full top-1/2 mr-2.5 -translate-y-1/2 text-right"
                    : side === "right"
                      ? "left-full top-1/2 ml-2.5 -translate-y-1/2"
                      : // Rows: labels to the outer side on wide screens; stacked
                        // above or below each leaf on phones, where rows are narrow.
                        !narrow && rowPart < 0
                        ? "right-full top-1/2 mr-2.5 -translate-y-1/2 text-right"
                        : !narrow && rowPart > 0
                          ? "left-full top-1/2 ml-2.5 -translate-y-1/2"
                          : side === "top"
                            ? "bottom-full left-1/2 mb-1.5 -translate-x-1/2 text-center"
                            : "left-1/2 top-full mt-1.5 -translate-x-1/2 text-center"
                }`}
              >
                {label}
              </span>
            </>
          );
          return (
            <li key={item.href + item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  className={className}
                  style={style}
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {content}
                </a>
              ) : (
                <Link href={item.href} className={className} style={style}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function TopologyMap({ hubs }: { hubs: MapHub[] }) {
  const [open, setOpen] = useState(hubs[0]?.id ?? "");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [firstRender, setFirstRender] = useState(true);

  const select = (id: string) => {
    setFirstRender(false);
    setOpen(id);
  };
  const canvas = (layout: Layout) => (
    <Canvas
      hubs={hubs}
      layout={layout}
      open={open}
      highlight={highlight}
      firstRender={firstRender}
      onPreview={setHighlight}
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
    </nav>
  );
}
