const path = require('path')
const HOST = 'https://bggray-mobile.like.video';

module.exports = {
    title: 'px2rem',
    devServer: {
        proxy: {
            '/live': {
                target: HOST,
                changeOrigin: true
            }
        }
    },
    output: {
        path: path.resolve(process.cwd(), 'dist/px2rem')
    },
    build: {

    }
}
