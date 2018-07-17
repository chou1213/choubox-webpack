const path = require('path');
const HOST = 'https://bggray-mobile.like.video'; //代理域名

module.exports = {
    title: 'act-9071', // document.title
    output: {
        path: '', //输出路径, 默认dist目录下同名文件
        publicPath: '' //打包静态资源的路径，默认./
    },
    build: {
        // template: 'index.php', //打包引用的模板文件
        // filename: 'index.php'  //打包输出的文件名
    },
    devServer: {
        proxy: {
            '/activity_2018': {
                target: HOST,
                changeOrigin: true,
                ws: true
            },
            '/app': {
                target: HOST,
                changeOrigin: true,
                ws: true
            },
            '/live': {
                target: HOST,
                changeOrigin: true,
                ws: true
            }
        }
    }
}
