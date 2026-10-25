"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "running" | "done";

type Stage = {
  id: string;
  name: string;
  detail: string;
  // ms after start when the stage begins and finishes (animation only, not real timings)
  start: number;
  end: number;
};

const trigger: Stage = {
  id: "push",
  name: "Push to main",
  detail: "Every change starts as a commit to main. Nothing reaches the server any other way.",
  start: 0,
  end: 450,
};

const checks: Stage[] = [
  {
    id: "tests",
    name: "Tests",
    detail: "1,600+ tests across 28 files, run against a real PostgreSQL. Each test is rolled back, so tests never share rows.",
    start: 450,
    end: 2300,
  },
  {
    id: "lint",
    name: "Lint",
    detail: "shellcheck for scripts, nginx -t for the proxy config, and terraform fmt and validate for the infrastructure.",
    start: 450,
    end: 1100,
  },
  {
    id: "security",
    name: "Security",
    detail: "A dependency audit and a gitleaks scan of every commit for leaked secrets.",
    start: 450,
    end: 1500,
  },
  {
    id: "images",
    name: "Build and scan images",
    detail: "Multi-architecture images built, scanned with Grype and published to GHCR. Images are pinned by digest.",
    start: 450,
    end: 1900,
  },
  {
    id: "cluster",
    name: "Throwaway Kubernetes cluster",
    detail: "A kind cluster built from nothing with kustomize, PostgreSQL as a StatefulSet, on every push before any deploy.",
    start: 450,
    end: 2600,
  },
];

const deploy: Stage[] = [
  {
    id: "deploy",
    name: "Deploy by digest",
    detail: "Runs only after every check passes. Authenticates to AWS with OIDC (no stored keys) and runs one narrow SSM command on EC2.",
    start: 2700,
    end: 3500,
  },
  {
    id: "verify",
    name: "Verify from outside",
    detail: "The live site is checked from outside after deploy. Rollback is a rerun of the deploy with an earlier commit.",
    start: 3500,
    end: 4200,
  },
];

const all = [trigger, ...checks, ...deploy];
const FINISH = Math.max(...all.map((s) => s.end));

function statusAt(stage: Stage, t: number): Status {
  if (t >= stage.end) return "done";
  if (t >= stage.start) return "running";
  return "idle";
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "done") {
    return (
      <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-ok" aria-hidden="true">
        <circle cx="8" cy="8" r="7.25" fill="currentColor" />
        <path d="M4.75 8.25 7 10.5l4.25-4.75" fill="none" stroke="var(--paper)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "running") {
    return (
      <svg viewBox="0 0 16 16" className="size-4 shrink-0 animate-spin text-accent motion-reduce:animate-none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="var(--rule)" strokeWidth="2" />
        <path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-rule" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Pipeline() {
  const [t, setT] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const frame = useRef<number | null>(null);

  const run = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(FINISH);
      return;
    }
    const began = performance.now();
    const tick = (now: number) => {
      const elapsed = now - began;
      setT(Math.min(elapsed, FINISH));
      if (elapsed < FINISH) frame.current = requestAnimationFrame(tick);
    };
    setT(0);
    frame.current = requestAnimationFrame(tick);
  }, []);

  const figure = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Run once, the first time the pipeline is mostly on screen.
    const el = figure.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [run]);

  const finished = t >= FINISH;
  const active = all.find((s) => s.id === selected);

  const row = (stage: Stage) => {
    const status = statusAt(stage, t);
    const isSelected = selected === stage.id;
    return (
      <li key={stage.id}>
        <button
          type="button"
          onClick={() => setSelected(isSelected ? null : stage.id)}
          aria-pressed={isSelected}
          className={`flex w-full items-center gap-2.5 rounded-md border px-3 py-2 text-left text-sm transition-colors ${
            isSelected
              ? "border-accent bg-surface"
              : "border-rule bg-surface/60 hover:border-muted"
          }`}
        >
          <StatusIcon status={status} />
          <span className={status === "idle" ? "text-muted" : ""}>{stage.name}</span>
        </button>
      </li>
    );
  };

  return (
    <figure ref={figure} className="@container" aria-labelledby="pipeline-caption">
      <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-3">
        <figcaption id="pipeline-caption" className="min-w-0 text-sm text-muted">
          How a change to PSells reaches production. Select a step to see what it does.
        </figcaption>
        <button type="button" onClick={run} className="link shrink-0 text-sm">
          Run again
        </button>
      </div>

      <div className="mt-6 grid gap-x-5 gap-y-4 @2xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)_minmax(0,1fr)] @2xl:items-center">
        <ol className="relative @2xl:after:absolute @2xl:after:left-full @2xl:after:top-1/2 @2xl:after:h-px @2xl:after:w-5 @2xl:after:bg-rule">
          {row(trigger)}
        </ol>

        <div className="relative border-l border-rule pl-4 @2xl:border-l-0 @2xl:pl-0">
          <p className="mb-2 text-sm text-muted">Checks run in parallel</p>
          <ol className="grid gap-1.5 @2xl:border-x @2xl:border-rule @2xl:px-3">{checks.map(row)}</ol>
        </div>

        <ol className="relative grid gap-1.5 border-l border-rule pl-4 @2xl:border-l-0 @2xl:pl-0 @2xl:before:absolute @2xl:before:right-full @2xl:before:top-1/2 @2xl:before:h-px @2xl:before:w-5 @2xl:before:bg-rule">
          {deploy.map(row)}
        </ol>
      </div>

      <div className="mt-6 min-h-[4.5rem] max-w-[65ch] text-base" aria-live="polite">
        {active ? (
          <p>
            <span className="font-semibold">{active.name}.</span> {active.detail}
          </p>
        ) : (
          <p className={finished ? "" : "text-muted"}>
            {finished ? (
              <>
                <span className="font-semibold text-ok">Live.</span> A push to main goes live in about four
                minutes, and only after every check passes.
              </>
            ) : (
              "Deploying…"
            )}
          </p>
        )}
      </div>
    </figure>
  );
}
