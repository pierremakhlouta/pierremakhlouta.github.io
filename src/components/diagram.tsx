import type { ReactNode } from "react";

// Shared SVG primitives for the architecture diagrams. Colours come from the
// CSS tokens so the diagrams follow light and dark mode.

type BoxProps = { x: number; y: number; w: number; h?: number; title: string; sub?: string; emphasis?: boolean };

export function Box({ x, y, w, h = 52, title, sub, emphasis }: BoxProps) {
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill="var(--surface)"
        stroke={emphasis ? "var(--accent)" : "var(--rule)"}
        strokeWidth={emphasis ? 2 : 1}
      />
      <text x={cx} y={sub ? y + 22 : y + h / 2 + 5} textAnchor="middle" fill="var(--ink)" fontSize={15} fontWeight={600}>
        {title}
      </text>
      {sub && (
        <text x={cx} y={y + 40} textAnchor="middle" fill="var(--muted)" fontSize={12.5}>
          {sub}
        </text>
      )}
    </g>
  );
}

type FrameProps = { x: number; y: number; w: number; h: number; label: string; dashed?: boolean; labelEnd?: boolean };

export function Frame({ x, y, w, h, label, dashed, labelEnd }: FrameProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill="none"
        stroke="var(--muted)"
        strokeOpacity={0.55}
        strokeDasharray={dashed ? "5 5" : undefined}
      />
      <text
        x={labelEnd ? x + w - 14 : x + 14}
        y={y + 22}
        textAnchor={labelEnd ? "end" : "start"}
        fill="var(--muted)"
        fontSize={12.5}
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}

export function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill="var(--muted)" fontSize={12}>
      {children}
    </text>
  );
}

export const arrowProps = (id: string) =>
  ({ fill: "none", stroke: "var(--muted)", strokeWidth: 1.25, markerEnd: `url(#${id})` }) as const;

export function ArrowMarker({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 10 5 0 10z" fill="var(--muted)" />
      </marker>
    </defs>
  );
}

type DiagramFigureProps = {
  title: string;
  description: string;
  viewBox: string;
  minWidth: number;
  caption: ReactNode;
  idPrefix: string;
  children: ReactNode;
};

// Wide diagrams scroll sideways inside their frame on narrow screens rather
// than shrinking text to an unreadable size.
export function DiagramFigure({ title, description, viewBox, minWidth, caption, idPrefix, children }: DiagramFigureProps) {
  return (
    <figure className="mx-auto max-w-[62rem] lg:py-4">
      <p className="mb-2 text-sm text-muted md:hidden">Scroll sideways to see the whole diagram.</p>
      <div
        className="dot-grid overflow-x-auto rounded-lg border border-rule bg-paper p-4 md:p-8 lg:p-10"
        tabIndex={0}
        role="group"
        aria-label={`${title}, scrollable`}
      >
        <svg
          viewBox={viewBox}
          className="h-auto w-full font-sans"
          style={{ minWidth }}
          role="img"
          aria-labelledby={`${idPrefix}-title ${idPrefix}-desc`}
        >
          <title id={`${idPrefix}-title`}>{title}</title>
          <desc id={`${idPrefix}-desc`}>{description}</desc>
          {children}
        </svg>
      </div>
      <figcaption className="mt-4 max-w-[65ch] text-muted">{caption}</figcaption>
    </figure>
  );
}
