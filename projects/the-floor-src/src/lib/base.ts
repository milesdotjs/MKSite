/**
 * Base-path helper. The app lives under /projects/the-floor/ on the site,
 * and Astro exposes that as BASE_URL (with a trailing slash because of
 * trailingSlash: "always"). Everything that builds an in-app URL uses this.
 */

const RAW = (import.meta.env.BASE_URL ?? "/") as string;
export const BASE = RAW.endsWith("/") ? RAW : `${RAW}/`;

/** `withBase("build/")` -> `/projects/the-floor/build/` */
export function withBase(path: string): string {
  return BASE + path.replace(/^\/+/, "");
}
