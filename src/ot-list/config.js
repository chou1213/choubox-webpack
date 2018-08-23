const path = require('path')
const HOST = 'https://h5.dayanweb.cn';
module.exports = {
    title: 'DUODE',
    devServer: {
        proxy: {
            '/duode': {
                target: HOST,
                changeOrigin: true
            }
        }
    },
    output: {
        path: path.resolve(process.cwd(), 'dist/dayanweb'),
        publicPath: './'
    },
    build: {

    }
}
