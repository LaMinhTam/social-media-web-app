/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/didg9rn2d/**",
            },
        ],
    },
    headers: async () => {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "http://0.0.0.0:3000",
                    },
                ],
            },
        ];
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
        outputStandalone: true,
    },
};

export default nextConfig;
