const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('~', resolve('src/'))
      .set('~plugin', resolve('src/assets/three-plugin'))
  }
}
