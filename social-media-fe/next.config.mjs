/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "source.unsplash.com",
                pathname: "**",
            },
        ],
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
        outputStandalone: true,
    },
};

export default nextConfig;
