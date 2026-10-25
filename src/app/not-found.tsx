import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Terminus } from "@/components/layout";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <PageHeader title="No route to this page" crumbs={[{ href: "/", label: "Home" }, { label: "Not found" }]}>
        <p className="text-lg md:text-xl">
          This address doesn&apos;t match any page on the site. It may have moved when the portfolio was reorganised.
        </p>
      </PageHeader>
      <Terminus>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-xl">
          <li>
            <Link href="/" className="link">
              Go to the homepage
            </Link>
          </li>
          <li>
            <Link href="/projects/" className="link">
              Projects
            </Link>
          </li>
        </ul>
      </Terminus>
    </>
  );
}
