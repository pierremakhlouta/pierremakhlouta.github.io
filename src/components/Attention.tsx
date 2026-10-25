import { attention } from "@/content/profile";

// Four stations on one line: horizontal on wide screens, vertical segments on
// phones. Every station is the same node; they light up in turn as the line draws in.
export default function Attention() {
  return (
    <div data-reveal className="route relative">
      <span aria-hidden="true" className="route-line absolute left-0 right-0 top-[8px] hidden h-[2px] bg-rule md:block" />
      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-10">
        {attention.map((a, i) => (
          <li
            key={a.title}
            data-reveal
            style={{ "--delay": `${200 + i * 160}ms` } as React.CSSProperties}
            className={`relative grid grid-cols-[1.125rem_minmax(0,1fr)] gap-x-5 md:block ${
              i < attention.length - 1
                ? "before:absolute before:left-[8px] before:top-5 before:-bottom-8 before:w-[2px] before:bg-rule md:before:hidden"
                : ""
            }`}
          >
            <span
              aria-hidden="true"
              className="relative z-10 block size-[1.125rem] rounded-full border-2 border-accent bg-paper shadow-[0_0_0_5px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
            >
              <span className="absolute inset-[3px] rounded-full bg-accent" />
            </span>
            <div className="md:mt-5">
              <h3 className="text-lg font-semibold leading-snug tracking-tight md:text-xl">{a.title}</h3>
              <p className="mt-1.5 max-w-[34ch] text-muted">{a.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
