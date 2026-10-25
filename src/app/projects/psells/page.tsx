import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import Pipeline from "@/components/Pipeline";
import PsellsDiagram from "@/components/PsellsDiagram";
import { psells } from "@/content/projects";

export const metadata: Metadata = {
  title: "PSells case study",
  description: psells.summary,
  openGraph: { title: "PSells: Pierre Makhlouta", description: psells.summary },
};

export default function PsellsPage() {
  return (
    <CaseStudy
      project={psells}
      diagram={<PsellsDiagram />}
      extras={{ deployment: <Pipeline /> }}
    />
  );
}
