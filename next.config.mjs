import path, { dirname } from "path";
import { fileURLToPath } from "url";
import nextMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

const __dirname = dirname(fileURLToPath(import.meta.url));

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx", "mjs", "mts"],
  experimental: {
    // taint: true,
    // ...,
    serverComponentsExternalPackages: [
      // '@react-email/components',
      // '@react-email/render',
      // '@react-email/tailwind'
      "react-dom/server",
    ],
    // serverActions: {
    //   allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    // },
  },
  env: {
    resetGramLang: '',
    // 必须是字符串
    BlogTitleMinLen: '3',
    postStorePath: path.resolve(__dirname, ".data/blogs"),
    postStorePathRel: ".data/blogs",
    db_mongoDB: "mongodb://127.0.0.1:27017",
    // redis[s]://[[username][:password]@][host][:port][/db-number]
    db_redis: "redis://127.0.0.1:6379",
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
      {
        source: "/",
        destination: "/post/6639cad189554fda70e0a9ee",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nextjs.org",
        port: "",
        pathname: "/_next/image/**",
      },
    ],
  },
};

export default withMDX(nextConfig);
