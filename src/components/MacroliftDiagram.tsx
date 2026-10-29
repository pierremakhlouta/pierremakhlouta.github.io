import { ArrowMarker, Box, DiagramFigure, Frame, Label, arrowProps } from "./diagram";

const arrow = arrowProps("ml-arrow");

export default function MacroliftDiagram() {
  return (
    <DiagramFigure
      idPrefix="ml-diagram"
      title="MacroLift architecture"
      description="The Next.js interface runs on a phone or in a browser and autosaves workouts on the device. It calls Supabase with the publishable key and the user's session: database functions that run with the user's own permissions write to PostgreSQL, where Row Level Security is on for every table. The Next.js server on Vercel refreshes sessions, completes sign-in links and serves a USDA food search route, so the USDA key stays on the server. Supabase Auth handles email sign-in, delivered through Brevo SMTP, and Google sign-in."
      viewBox="0 0 880 470"
      minWidth={760}
      caption="The browser holds only the publishable key. Row Level Security limits every row to its owner, and multi-row writes go through functions that run with the user's permissions, so the same rules always apply."
    >
      <ArrowMarker id="ml-arrow" />

      {/* Request path from the device to the database */}
      <path d="M185 70 V20 H735 V68" {...arrow} />
      <Label x={430} y={14}>
        publishable key + user session
      </Label>

      {/* Device */}
      <Frame x={20} y={40} w={210} h={300} label="Phone or browser" />
      <Box x={40} y={70} w={170} title="Next.js UI" sub="installable, React" />
      <Box x={40} y={240} w={170} title="On-device autosave" sub="survives lost signal" />
      <path d="M125 238 V124" {...arrow} />
      <Label x={118} y={186} anchor="end">
        syncs when
      </Label>
      <Label x={118} y={200} anchor="end">
        online
      </Label>

      {/* Vercel */}
      <Frame x={270} y={40} w={280} h={300} label="Vercel" />
      <Box x={290} y={70} w={240} title="Next.js server" sub="session refresh, sign-in callback" />
      <Box x={290} y={240} w={240} title="USDA search route" sub="server-side, key stays here" />
      <path d="M210 96 H288" {...arrow} />
      <path d="M410 122 V238" {...arrow} />

      {/* Supabase */}
      <Frame x={590} y={40} w={270} h={300} label="Supabase" labelEnd />
      <Box x={620} y={70} w={230} title="Database functions" sub="run with the user's permissions" emphasis />
      <Box x={620} y={160} w={230} title="PostgreSQL" sub="Row Level Security on every table" />
      <Box x={620} y={250} w={230} title="Auth" sub="email and Google sign-in" />
      <path d="M735 122 V158" {...arrow} />
      <path d="M530 110 H560 V276 H618" {...arrow} />

      {/* Outside services */}
      <Box x={290} y={390} w={240} title="USDA FoodData Central" sub="food search" />
      <Box x={620} y={390} w={110} title="Brevo" sub="SMTP email" />
      <Box x={740} y={390} w={110} title="Google" sub="sign-in" />
      <path d="M410 292 V388" {...arrow} />
      <path d="M675 302 V388" {...arrow} />
      <path d="M795 302 V388" {...arrow} />
    </DiagramFigure>
  );
}
