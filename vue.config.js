'use strict'
const path = require('path')
const webpack = require('webpack')
function resolve(dir) {
    return path.join(__dirname, dir)
}
const port = 6666 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'dev',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        inline:true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/api': {
                target: process.env.VUE_APP_HOST_URL,
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                pathRewrite: {
                    '^/api': process.env.VUE_APP_HOST_URL //重写接口访问
                }
            }
        },
    },
    configureWebpack: {
        plugins: [
            // 支持 jquery
            new webpack.ProvidePlugin({
              $: 'jquery',
              jQuery: 'jquery',
              'windows.jQuery': 'jquery'
            })
          ],
    }
    
}
