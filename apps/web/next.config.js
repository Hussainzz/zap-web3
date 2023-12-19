require("dotenv").config({ path: "../../.env" });
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@zap/recoil", "@zapweb3/prisma"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
};

