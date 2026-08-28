/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
};

nextConfig.images = {
    remotePatterns: [
        { protocol: 'https', hostname: 'pub-b2fdf8a3ab70480aa2dce52f99ba6ed2.r2.dev' },
        { protocol: 'https', hostname: 'pub-863ef00e7a5f45a892803d4befa874c3.r2.dev' }
    ]
};
export default nextConfig;
