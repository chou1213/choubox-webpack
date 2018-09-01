process.env.NODE_ENV = 'development';
const fs = require('fs');
const path = require('path');
const os = require('os');
const ifaces = os.networkInterfaces();
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const opn = require('opn');
const projectname = process.argv[2];

//根据参数，重写配置文件
if (typeof projectname !== 'undefined') {
    let projectConfig = `module.exports = {\n    'filename': '${projectname}'\n};`;
    fs.writeFileSync(path.resolve(__dirname, './project.config.js'), projectConfig, 'utf8');
}

const webpackConfig = require('./webpack.config'); //webpack配置

//获取本地ip
const ip = (function() {
    let _arr = [];
    switch (os.platform()) {
        case 'win32':
            Object.keys(ifaces).forEach(function(dev) {
                ifaces[dev].forEach(function(details) {
                    if (details.family === 'IPv4') {
                        _arr.push(details.address);
                    }
                });
            })
            break;
        case 'darwin':
            _arr.push(ifaces.en0[1].address);
            break;
        default:
            _arr.push('localhost');
    }
    return _arr;
})();

portfinder.basePort = 8080; //默认端口是8080
//判断当前端口是否被占用，是则递增到8081，以此类推
portfinder.getPortPromise()
    .then((port) => {
        WebpackDevServer.addDevServerEntrypoints(webpackConfig, webpackConfig.devServer); //node api启动webpack-dev-server,启用HMR
        const compiler = webpack(webpackConfig); //webpack实例
        const server = new WebpackDevServer(compiler, webpackConfig.devServer);
        server.listen(port, '0.0.0.0', (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`\x1B[32m Starting server on http://${ip[0]}:${port} \x1B[39m`);
            webpackConfig.devServer.open && opn(`http://${ip[0]}:${port}`); //打开浏览器
        });
    })
    .catch((err) => {
        console.log(err);
    });