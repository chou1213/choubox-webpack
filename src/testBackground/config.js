const path = require('path')
const HOST = 'https://bggray-mobile.like.video';

module.exports = {
    title: '图片',
    devServer: {
        proxy: {
            '/live': {
                target: HOST,
                changeOrigin: true
            }
        }
    },
    output: {
        // path:path.resolve(process.cwd(),'dist/testBackground')
    },
    build: {

    }
}
