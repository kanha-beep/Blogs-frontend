import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  webpack(config) {
    config.resolve.alias["react-router-dom"] = path.resolve(
      __dirname,
      "src/next-router-dom.js"
    );

    return config;
  },
};

export default nextConfig;
