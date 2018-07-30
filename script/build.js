const os = require('os');
const ifaces = os.networkInterfaces();
const webpack = require('webpack');
const webpackConfig = require('./webpack.conf.js');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');

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


WebpackDevServer.addDevServerEntrypoints(webpackConfig, webpackConfig.devServer);

const compiler = webpack(webpackConfig);

const server = new WebpackDevServer(compiler, webpackConfig.devServer);



portfinder.basePort = process.env.PORT || 8080;

portfinder.getPortPromise()
    .then((port) => {
        //
        // `port` is guaranteed to be a free port
        // in this scope.
        //
        // webpackConfig.entry.index.unshift('webpack-dev-server/client/index.js?http://localhost:' + port);


        server.listen(port, '0.0.0.0', (err) => {
            if (err) {
                console.log(err);
                return false;
            }
            console.log(`\x1B[32m Starting server on http://${ip[0]}:${port} \x1B[39m`);
        });
    })
    .catch((err) => {
        //
        // Could not get a free port, `err` contains the reason.
        //
        console.log(err);
    });
