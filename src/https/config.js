const path = require('path')
const HOST = "https://bggray-mobile.like.video";

module.exports = {
    title: "https",
    devServer: {
        proxy: {
            "/live": {
                target: HOST,
                changeOrigin: true
            }
        }
    },
    output: {
        // path: path.resolve(process.cwd(), 'dist/px2rem')
    },
    build: {

    }
}