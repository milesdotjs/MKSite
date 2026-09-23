import type { NextConfig } from "next";

// The site is a static GitHub Pages deploy of the whole repo, so this app is
// exported to plain HTML and served from a fixed sub-folder. Unlike Vite there
// is no relative-URL mode: the final URL has to be baked in here.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/projects/try-not-to-use-bankai";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
