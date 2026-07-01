import type { NextConfig } from "next";

function apiRemotePattern(): {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname: string;
}[] {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return [];

  try {
    const parsed = new URL(url);
    return [
      {
        protocol: parsed.protocol.replace(":", "") as "http" | "https",
        hostname: parsed.hostname,
        ...(parsed.port ? { port: parsed.port } : {}),
        pathname: "/uploads/**",
      },
    ];
  } catch {
    return [];
  }
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...apiRemotePattern(),
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const base = apiUrl.replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${base}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${base}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
