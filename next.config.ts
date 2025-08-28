import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              [
                "default-src 'self'",
                "script-src 'self' https://js.stripe.com https://www.paypal.com 'unsafe-inline' 'unsafe-eval'",
                "script-src-elem 'self' https://js.stripe.com https://www.paypal.com 'unsafe-inline' 'unsafe-eval'",
                "frame-src https://js.stripe.com https://www.paypal.com https://sandbox.paypal.com https://www.sandbox.paypal.com",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: blob: https://*.stripe.com https://www.paypal.com https://www.paypalobjects.com https://ui-avatars.com https://lh3.googleusercontent.com",
                "font-src 'self'",
                "connect-src 'self' https://api.stripe.com https://js.stripe.com https://api-m.sandbox.paypal.com https://api-m.paypal.com https://www.paypal.com https://www.sandbox.paypal.com",
                "frame-ancestors 'none'",
              ].join("; ") + ";",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.ALLOWED_ORIGINS || "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
