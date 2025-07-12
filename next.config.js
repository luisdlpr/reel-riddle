/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NEXT_PUBLIC_BASE_URL ? 
        (new URL(process.env.NEXT_PUBLIC_BASE_URL).pathname === '/' ? '' : new URL(process.env.NEXT_PUBLIC_BASE_URL).pathname) : '',
    images: {
        domains: ["image.tmdb.org"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image.tmdb.org",
                port: "",
                pathname: "/t/p/**",
            },
        ],
    },
};

module.exports = nextConfig;
