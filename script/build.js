process.env.NODE_ENV = 'production';
const webpack = require('webpack');
const webpackConfig = require('./webpack.conf.js'); //webpack配置
const compiler = webpack(webpackConfig); //webpack实例
//执行webpack编译
compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
        console.log('error');
    } else {
        process.stdout.write(stats.toString({
            colors: true
        }));
    }
});