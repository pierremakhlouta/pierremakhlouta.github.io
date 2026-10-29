import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import MacroliftDiagram from "@/components/MacroliftDiagram";
import { macrolift } from "@/content/projects";

export const metadata: Metadata = {
  title: "MacroLift case study",
  description: macrolift.summary,
  openGraph: { title: "MacroLift: Pierre Makhlouta", description: macrolift.summary },
};

export default function MacroliftPage() {
  return <CaseStudy project={macrolift} diagram={<MacroliftDiagram />} />;
}
