/**
 * Create on {{date}}
 */

const path = require('path')
const HOST = 'https://h5.dayanweb.cn'; //代理域名

module.exports = {
    title: 'DUODE', // document.title
    output: {
        path: path.resolve(process.cwd(), 'dist/dayanweb'), //输出路径, 默认dist目录下同名文件
        publicPath: './' //打包静态资源的路径，默认./
    },
    build: {
        // template: 'index.php', //打包引用的模板文件
        // filename: 'index.php'  //打包输出的文件名
    },
    devServer: {
        proxy: {
            '/duode': {
                target: HOST,
                changeOrigin: true
            }
        }
    },
    open: false, //编译完成是否打开页面
    useEslint: true //是否需要eslint校验
}
