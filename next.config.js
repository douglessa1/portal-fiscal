/** Next.js config: Portal Fiscal - Production Mode */
module.exports = {
  // Webpack optimization for development
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = Object.assign({}, config.watchOptions, {
        ignored: [
          'C:\\pagefile.sys',
          'C:\\hiberfil.sys',
          'C:\\swapfile.sys',
          'C:\\DumpStack.log.tmp'
        ]
      })
    }
    return config
  },

  // Force server-side rendering (disable static optimization)
  experimental: {
    // Disable static page generation completely
    isrMemoryCacheSize: 0,
  },

  // Ensure all pages are server-rendered
  // This prevents Next.js from trying to statically generate pages at build time
  async headers() {
    return []
  },

  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/noticias',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/noticias/:slug*',
        permanent: true,
      },
      {
        source: '/news',
        destination: '/noticias',
        permanent: true,
      },
    ]
  },
}
