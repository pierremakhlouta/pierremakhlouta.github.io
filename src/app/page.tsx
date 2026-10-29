import Image from "next/image";
import Link from "next/link";
import { Container, Section, Terminus, publicPath } from "@/components/layout";
import Attention from "@/components/Attention";
import TopologyMap from "@/components/TopologyMap";
import { person, principles } from "@/content/profile";
import { buildMapHubs } from "@/content/sitemap";

export default function Home() {
  return (
    <>
      {/* Hero: introduction and the site as a topology map */}
      <Container className="pb-10 pt-12 md:pb-16 md:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
          <div>
            <p className="flex items-center gap-2.5 text-sm">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-ok shadow-[0_0_0_4px_var(--ok-soft)]" />
              Seeking a {person.seeking}
            </p>
            {person.photo && (
              <Image
                src={person.photo}
                alt={`Portrait of ${person.name}`}
                priority
                sizes="10rem"
                className="mt-8 aspect-[4/5] w-40 rounded-lg object-cover"
              />
            )}
            <h1 className="mt-6 text-[clamp(3.25rem,11vw,6.75rem)] font-bold leading-[0.9] tracking-[-0.05em]">
              Pierre
              <br />
              Makhlouta
            </h1>
            <p className="mt-8 max-w-[30ch] text-xl leading-snug md:text-2xl">
              Computer Science student at York University, drawn to systems, software and the problems in between.
            </p>
            <p className="mt-5 max-w-[46ch] text-muted">
              I&apos;m curious about what happens beneath the screen, and I&apos;d rather build something and watch it
              run than only read about how it works.
            </p>
          </div>

          <figure>
            <figcaption className="mb-2 text-center text-sm text-muted">
              A map of this site. Select a section to explore it.
            </figcaption>
            <TopologyMap hubs={buildMapHubs(person.resume ? publicPath(person.resume) : null)} />
          </figure>
        </div>
      </Container>

      <Section id="attention" title="What I pay attention to" wide>
        <p className="-mt-3 max-w-[56ch] text-lg text-muted md:-mt-4">The questions behind the way I build.</p>
        <div className="mt-10 md:mt-12">
          <Attention />
        </div>
      </Section>

      <Section id="practice" title="How I build">
        <ol className="space-y-12 md:space-y-14">
          {principles.map((p, i) => (
            <li
              key={p.statement}
              data-reveal
              style={{ "--delay": `${i * 60}ms` } as React.CSSProperties}
              className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10"
            >
              <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl">{p.statement}</h3>
              <div>
                <p className="text-muted">{p.evidence}</p>
                <Link href={p.href} className="link mt-2 inline-block text-sm">
                  {p.linkLabel}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Terminus>
        <p className="max-w-[34ch] text-2xl font-semibold leading-snug tracking-[-0.02em] md:text-3xl">
          That&apos;s the short version. Start with the{" "}
          <Link href="/projects/" className="link">
            projects
          </Link>
          , read through my{" "}
          <Link href="/experience/" className="link">
            experience
          </Link>
          , see the{" "}
          <Link href="/skills/" className="link">
            skills
          </Link>{" "}
          I use, or{" "}
          <Link href="/contact/" className="link">
            get in touch
          </Link>
          .
        </p>
      </Terminus>
    </>
  );
}
