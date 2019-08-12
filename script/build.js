const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const projectname = process.argv[2];

//根据参数，重写配置文件
if (typeof projectname !== 'undefined') {
    let projectConfig = `module.exports = {\n    'filename': '${projectname}'\n};`;
    fs.writeFileSync(path.resolve(__dirname, './project.config.js'), projectConfig, 'utf8');
}

const webpackConfig = require('./webpack.config'); //webpack配置
const compiler = webpack(webpackConfig); //webpack实例

//执行webpack编译
compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
        console.log(err || '\x1B[31m  Build fail! \x1B[39m');
    } else {
        process.stdout.write(stats.toString({
            colors: true, // 在控制台展示颜色
            modules: false, //隐藏node_modules
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false, // 使构建过程更静默无输出
            chunkModules: false
        }) + '\n\n');
        console.log(`\x1B[36m (^u^) Build completed!\n \x1B[39m`);
    }
});
