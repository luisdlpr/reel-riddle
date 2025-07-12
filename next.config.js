/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NEXT_PUBLIC_BASE_URL ? new URL(process.env.NEXT_PUBLIC_BASE_URL).pathname : '',
    async redirects() {
        return ([
            {
                source: '/',
                destination: '/myapp',
                permanent: true,
                basePath: false,
            },
        ]);
    },
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
