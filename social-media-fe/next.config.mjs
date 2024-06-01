/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["source.unsplash.com"],
        formats: ["image/webp"],
        minimumCacheTTL: 60,
        // disableStaticImages: true,
    },
};

export default nextConfig;