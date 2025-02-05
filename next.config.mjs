/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000', '5hmr318m-3000.inc1.devtunnels.ms']
        },
      },
};

export default nextConfig;
