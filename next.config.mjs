import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    postStorePath: path.resolve(__dirname, "./data/blogs"),
    db_mongoDB: "mongodb://localhost:27017",
    dbName: "test",
  },
//   运行在`Middleware`之前
  async redirects() {
    return [
      {
        source: "/:local/client",
        destination: "/client",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
