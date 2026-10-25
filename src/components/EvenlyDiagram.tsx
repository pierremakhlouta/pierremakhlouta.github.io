import { ArrowMarker, Box, DiagramFigure, Frame, Label, arrowProps } from "./diagram";

const arrow = arrowProps("ev-arrow");

export default function EvenlyDiagram() {
  return (
    <DiagramFigure
      idPrefix="ev-diagram"
      title="Evenly architecture"
      description="The PWA on a phone calls PostgREST with a device token. PostgREST exposes RPC endpoints only, which run an allowlist of SECURITY DEFINER functions; the PostgreSQL tables have Row Level Security on with zero policies, so nothing else can read them. pg_cron adds monthly bills. After each change a pg_net trigger calls the notify Edge Function, which sends encrypted Web Push through the browser push services to the phone's service worker. GitHub Actions deploys the static app to GitHub Pages only if every test passes."
      viewBox="0 0 880 530"
      minWidth={760}
      caption={
        <>
          The highlighted functions are the security boundary: the browser can call only those, and a CI test fails if
          anything else becomes callable.
        </>
      }
    >
      <ArrowMarker id="ev-arrow" />

      {/* Phone */}
      <Frame x={20} y={30} w={210} h={300} label="Phone (installable PWA)" />
      <Box x={40} y={70} w={170} title="TypeScript UI" sub="no framework" />
      <Box x={40} y={240} w={170} title="Service worker" sub="app shell, push" />

      {/* Supabase */}
      <Frame x={270} y={30} w={600} h={300} label="Supabase" labelEnd />
      <Box x={290} y={70} w={160} title="PostgREST" sub="RPC endpoints only" />
      <Box x={480} y={70} w={180} title="Allowlisted functions" sub="~28 SECURITY DEFINER" emphasis />
      <Box x={700} y={70} w={150} h={152} title="PostgreSQL" />
      <text x={775} y={172} textAnchor="middle" fill="var(--muted)" fontSize={12}>
        RLS on,
      </text>
      <text x={775} y={188} textAnchor="middle" fill="var(--muted)" fontSize={12}>
        zero policies
      </text>
      <Box x={480} y={170} w={180} title="pg_cron" sub="daily bills, idempotent" />
      <Box x={480} y={260} w={180} title="pg_net trigger" sub="after commit" />
      <Box x={290} y={260} w={160} title="Edge Function" sub="notify, no push SDK" />

      <path d="M210 96 H288" {...arrow} />
      <path d="M450 96 H478" {...arrow} />
      <path d="M660 96 H698" {...arrow} />
      <path d="M660 196 H698" {...arrow} />
      <path d="M775 222 V286 H662" {...arrow} />
      <path d="M480 286 H452" {...arrow} />

      {/* Push delivery */}
      <Box x={290} y={360} w={160} title="Push services" sub="browser vendors" />
      <path d="M370 312 V358" {...arrow} />
      <path d="M290 386 H250 V266 H212" {...arrow} />
      <Label x={480} y={390} anchor="start">
        encrypted with Web Crypto (RFC 8291)
      </Label>

      {/* GitHub */}
      <Frame x={20} y={420} w={440} h={100} label="GitHub" />
      <Box x={36} y={452} w={180} title="GitHub Pages" sub="static files" />
      <Box x={264} y={452} w={180} title="GitHub Actions" sub="3 parallel CI jobs" />
      <path d="M264 478 H218" {...arrow} />
      <path d="M126 452 V332" {...arrow} />
    </DiagramFigure>
  );
}
