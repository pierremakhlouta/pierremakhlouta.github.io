import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static site: deployable to GitHub Pages or any static host.
  output: "export",
  // Emit /projects/psells/index.html so every route works on any static host.
  trailingSlash: true,
  // Set BASE_PATH (e.g. "/portfolio") when hosting under a sub-path such as a
  // GitHub Pages project site. Links and imported images pick it up automatically.
  basePath: process.env.BASE_PATH || "",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
