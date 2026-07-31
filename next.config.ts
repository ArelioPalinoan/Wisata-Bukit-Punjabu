import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["10.10.8.220", "localhost", "127.0.0.1"],
};

export default nextConfig;
