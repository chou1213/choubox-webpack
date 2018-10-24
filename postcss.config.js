const path = require('path'); //脚本所在的根目录
const project = require(path.join(process.cwd(), './script', 'project.config')); //编译项目配置
const projectConfig = require(path.join(process.cwd(), 'src', `${project.filename}/config`)); //子项目配置
let plugins = {
    'postcss-import': {},
    'postcss-url': {},
    'autoprefixer': {}
};
//根据子项目配置，使用px2rem插件
projectConfig.px2rem && (plugins['postcss-pxtorem'] = {
    rootValue: 75,
    propWhiteList: ['*']
})

module.exports = {
    plugins
}
