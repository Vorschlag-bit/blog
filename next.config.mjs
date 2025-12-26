/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // node_modules에서 오는 경고 무시하기
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { file: /node_modules/ },
    ];
    return config;
  },
};

export default nextConfig;