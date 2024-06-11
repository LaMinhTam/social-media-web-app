/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "source.unsplash.com",
                pathname: "/random/**",
            },
        ],
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
        outputStandalone: true,
    },
};

export default nextConfig;
