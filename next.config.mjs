/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    qualities: [65,75]
  },

  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html'
      }
    ]
  }
};

export default nextConfig;