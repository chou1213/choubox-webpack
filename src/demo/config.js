const path = require('path');
const HOST = 'https://restapi.amap.com'; //代理域名

module.exports = {
    title: 'demo', // document.title
    output: {
        path: path.resolve(process.cwd(), 'dist/demo'), //输出路径, 默认dist目录下同名文件
        publicPath: '' //打包静态资源的路径，默认./
    },
    build: {
        // template: 'index.php', //打包引用的模板文件
        // filename: 'index.php'  //打包输出的文件名
    },
    devServer: {
        proxy: {
            '/v3': {
                target: HOST,
                changeOrigin: true
            }
        }
    },
    open: true, //编译完成是否打开页面
    useEslint: false
}
