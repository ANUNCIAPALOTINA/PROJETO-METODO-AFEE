import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O ebook-app é lido do disco por /ebook (route.ts); sem isto a Netlify não o inclui no servidor.
  outputFileTracingIncludes: {
    "/ebook": ["./src/content/ebook-app/**/*"],
  },
};

export default nextConfig;
