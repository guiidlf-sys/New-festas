import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise nos SVG locaux de placeholder (sans script, donc sûrs).
    // Remplacez-les par de vraies photos (jpg/png) dès que possible.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
