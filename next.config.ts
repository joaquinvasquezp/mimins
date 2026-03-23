import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  serverActions: {
    allowedOrigins: [
      "localhost:3001",
      "localhost:3000",
      // Agrega aquí la IP de tu máquina en la red local, ej:
      // "192.168.1.100:3001",
    ],
  },
};

export default nextConfig;
