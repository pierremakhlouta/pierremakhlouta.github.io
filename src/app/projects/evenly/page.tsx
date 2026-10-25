import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import EvenlyDiagram from "@/components/EvenlyDiagram";
import { evenly } from "@/content/projects";

export const metadata: Metadata = {
  title: "Evenly case study",
  description: evenly.summary,
  openGraph: { title: "Evenly: Pierre Makhlouta", description: evenly.summary },
};

export default function EvenlyPage() {
  return <CaseStudy project={evenly} diagram={<EvenlyDiagram />} />;
}
