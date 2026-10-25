"use client";

import { useEffect } from "react";

// Marks trace nodes and reveal targets as "online" the first time they scroll
// into view. Mounted per page by app/template.tsx, so it rescans after every
// navigation. CSS does the rest; without JS everything simply shows as is.
export default function OnlineObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = document.querySelectorAll<HTMLElement>("[data-node]:not([data-online]), [data-reveal]:not([data-online])");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-online", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    root.setAttribute("data-armed", "");
    return () => observer.disconnect();
  }, []);

  return null;
}
