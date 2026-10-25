"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Screenshot from "@/components/Screenshot";
import type { PendingShot, Shot } from "@/content/projects";

type Props = {
  shots: (Shot | PendingShot)[];
  sizes: string;
  className: string;
  showCaption?: boolean;
};

// Screenshot grid with a lightbox. Built on the native <dialog> element, which
// provides the focus trap, Escape handling and an inert background for free.
export default function Gallery({ shots, sizes, className, showCaption = true }: Props) {
  const viewable = shots.filter((s): s is Shot => !("pending" in s));
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  // Unique per gallery, so several lightboxes can share a page.
  const captionId = useId();
  const opener = useRef<HTMLElement | null>(null);

  const open = (i: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setIndex(i);
  };

  const close = useCallback(() => dialog.current?.close(), []);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + viewable.length) % viewable.length)),
    [viewable.length],
  );

  const isOpen = index !== null;

  // Open the dialog once an image is chosen, and lock page scrolling behind it
  // until it closes. Depends only on open/closed, not on which image is shown.
  useEffect(() => {
    const el = dialog.current;
    if (!isOpen || !el) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    // Keep the layout from shifting when the scrollbar disappears.
    root.style.paddingRight = scrollbar ? `${scrollbar}px` : "";
    if (!el.open) el.showModal();
    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = "";
    };
  }, [isOpen]);

  const onClose = () => {
    setIndex(null);
    // Return focus to the screenshot that opened the lightbox.
    opener.current?.focus({ preventScroll: true });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (viewable.length < 2) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const current = index === null ? null : viewable[index];
  const positions = new Map<Shot | PendingShot, number>(viewable.map((s, i) => [s, i]));

  return (
    <>
      <div className={className}>
        {shots.map((shot) => {
          const i = positions.get(shot);
          return (
            <Screenshot key={shot.caption} shot={shot} sizes={sizes} showCaption={showCaption} onOpen={i === undefined ? undefined : () => open(i)} />
          );
        })}
      </div>

      <dialog
        ref={dialog}
        onClose={onClose}
        onKeyDown={onKeyDown}
        aria-labelledby={captionId}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-ink backdrop:bg-[rgb(10_16_22/0.95)] backdrop:backdrop-blur-sm"
      >
        {current && (
          // Clicks on the empty area around the image close the lightbox.
          <div
            className="flex h-full flex-col px-4 pb-4 pt-3 sm:px-8 sm:pb-6"
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <div className="flex items-center justify-between gap-4 text-sm text-[#dde4e9]">
              <p aria-live="polite" className="num">
                {index! + 1} of {viewable.length}
              </p>
              <button
                type="button"
                onClick={close}
                className="rounded-md border border-white/30 px-3 py-1.5 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div
              className="flex min-h-0 flex-1 items-center justify-center py-3"
              onClick={(e) => e.target === e.currentTarget && close()}
            >
              <Image
                key={current.src.src}
                src={current.src}
                alt={current.alt}
                sizes="100vw"
                className={`h-auto max-h-full w-auto max-w-full rounded-md object-contain shadow-2xl ${
                  current.frame === "phone" ? "" : "bg-white"
                }`}
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-[#dde4e9]">
              {viewable.length > 1 ? (
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous screenshot"
                  className="shrink-0 rounded-md border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10"
                >
                  Previous
                </button>
              ) : (
                <span />
              )}
              <p id={captionId} className="max-w-[60ch] text-center text-sm">
                {current.caption}
              </p>
              {viewable.length > 1 ? (
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next screenshot"
                  className="shrink-0 rounded-md border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10"
                >
                  Next
                </button>
              ) : (
                <span />
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
