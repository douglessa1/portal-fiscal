/** Next.js config: ignore system files in file watcher */
module.exports = {
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
  }
}
