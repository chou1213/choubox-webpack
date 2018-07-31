process.env.NODE_ENV = 'development';
const os = require('os');
const ifaces = os.networkInterfaces();
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder'); //判断算口是否被占用
const opn = require('opn'); //打开浏览器
const webpackConfig = require('./webpack.conf.js');

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

portfinder.basePort = process.env.PORT || 8080;
portfinder.getPortPromise()
    .then((port) => {
        webpackConfig.entry.index.unshift('webpack-dev-server/client/index.js?http://localhost:' + port);
        WebpackDevServer.addDevServerEntrypoints(webpackConfig, webpackConfig.devServer);
        const compiler = webpack(webpackConfig);
        const server = new WebpackDevServer(compiler, webpackConfig.devServer);
        server.listen(port, '0.0.0.0', (err) => {
            if (err) {
                console.log(err);
                return false;
            }
            console.log(`\x1B[32m Starting server on http://${ip[0]}:${port} \x1B[39m`);
            webpackConfig.devServer.open && opn(`http://${ip[0]}:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
