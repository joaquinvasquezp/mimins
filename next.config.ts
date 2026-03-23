import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  allowedDevOrigins: [
    // IP DE LA MAQUINA QUE LEVANTA EL PROYECTO
    "192.168.100.10",
  ]
};

export default nextConfig;