"use client";

import { useEffect, useState } from "react";

// Copies a short value to the clipboard and confirms it in place.
export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission);
      // the value stays visible and selectable, so nothing else is needed.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded border border-rule px-2 py-0.5 text-sm text-muted hover:border-muted hover:text-ink"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      <span className="sr-only"> {label}</span>
    </button>
  );
}
