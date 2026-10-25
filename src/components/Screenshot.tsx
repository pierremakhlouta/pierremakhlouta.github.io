import Image from "next/image";
import type { PendingShot, Shot } from "@/content/projects";

type Props = {
  shot: Shot | PendingShot;
  // Rendered width hint for responsive image selection.
  sizes: string;
  priority?: boolean;
  showCaption?: boolean;
  // When given, the image becomes a button that opens it larger (the gallery lightbox).
  onOpen?: () => void;
  className?: string;
};

function BrowserChrome({ url, children }: { url?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-rule bg-surface shadow-[0_1px_0_var(--rule),0_18px_40px_-24px_rgb(21_33_44/0.35)]">
      <div className="flex items-center gap-3 border-b border-rule px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-rule" />
          <span className="size-2.5 rounded-full bg-rule" />
          <span className="size-2.5 rounded-full bg-rule" />
        </span>
        {url && <span className="min-w-0 truncate rounded bg-paper px-2 py-0.5 text-xs text-muted">{url}</span>}
      </div>
      {children}
    </div>
  );
}

function PhoneChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[17rem] rounded-[2.25rem] border border-rule bg-[#15212c] p-2 shadow-[0_18px_40px_-20px_rgb(21_33_44/0.45)]">
      <div className="overflow-hidden rounded-[1.75rem] bg-surface">{children}</div>
    </div>
  );
}

function DocumentChrome({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-md border border-rule bg-white">{children}</div>;
}

function Pending({ shot }: { shot: PendingShot }) {
  return (
    <div
      className={`flex flex-col justify-center gap-2 border-2 border-dashed border-accent/60 bg-surface p-5 text-sm ${
        shot.frame === "phone" ? "mx-auto aspect-[786/1318] w-full max-w-[17rem] rounded-[2.25rem]" : "aspect-[16/10] rounded-lg"
      }`}
    >
      <p className="font-semibold">Screenshot needed</p>
      <p className="text-muted">{shot.instructions}</p>
      <p className="break-all font-mono text-xs text-muted">{shot.file}</p>
    </div>
  );
}

export default function Screenshot({ shot, sizes, priority, showCaption = true, onOpen, className = "" }: Props) {
  if ("pending" in shot) {
    // Placeholders are a reminder for development only; production builds skip them.
    if (process.env.NODE_ENV === "production") return null;
    return (
      <figure className={className}>
        <Pending shot={shot} />
        {showCaption && <figcaption className="mt-3 text-sm text-muted">{shot.caption}</figcaption>}
      </figure>
    );
  }

  const image = (
    <Image
      src={shot.src}
      alt={shot.alt}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      className="block h-auto w-full"
    />
  );
  const img = onOpen ? (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${shot.frame === "document" ? "View full certificate" : "Enlarge screenshot"}: ${shot.caption}`}
      className="block w-full cursor-zoom-in"
    >
      {image}
    </button>
  ) : (
    image
  );

  return (
    <figure className={className}>
      {shot.frame === "browser" ? (
        <BrowserChrome url={shot.url}>{img}</BrowserChrome>
      ) : shot.frame === "document" ? (
        <DocumentChrome>{img}</DocumentChrome>
      ) : (
        <PhoneChrome>{img}</PhoneChrome>
      )}
      {showCaption && (
        <figcaption className={`mt-3 text-sm text-muted ${shot.frame === "phone" ? "mx-auto max-w-[17rem]" : ""}`}>
          {shot.caption}
        </figcaption>
      )}
    </figure>
  );
}
