const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlguin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //抽离css,可以异步加载css
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development'; //获取当前执行环境
const project = require('./project.config'); //编译项目配置
const projectConfig = require(`../src/${project.filename}/config`); //子项目配置
const paths = {
    root: path.resolve(process.cwd()), //脚本所在根目录
    srcPath: path.join(process.cwd(), 'src', project.filename), //子项目开发目录
    distPath: projectConfig.output.path || path.join(process.cwd(), 'dist', project.filename) //子项目打包目录
};
let entry = {};
let mutilPageHtml = [];
let isSinglePage = fs.existsSync(path.join(paths.srcPath, 'index.js'));

//设置在当前node.js进程中，是否标记--no-deprecation。设置在控制台是否看到警告信息
process.noDeprecation = true;

//判断子项目的根目录是否有index.js，如果有则是单页面构建，如果没有则是多页面构建
if (isSinglePage) {
    //有单文件入口
    entry['index'] = ['babel-polyfill', path.join(paths.srcPath, 'index.js')];
} else {
    //遍历page多文件入口
    fs.readdirSync(path.join(paths.srcPath, 'page')).forEach((element, index) => {
        if (fs.existsSync(path.join(paths.srcPath, `page/${element}/index.js`))) {
            let mutilPageConfig = fs.existsSync(path.join(paths.srcPath, `page/${element}/config.js`)) ? require(`../src/${project.filename}/page/${element}/config`) : {}; //page下每个页面的配置信息
            entry[element] = ['babel-polyfill', path.join(paths.srcPath, `page/${element}/index.js`)];
            mutilPageHtml.push(new HtmlWebpackPlugin({
                title: projectConfig.title || 'webpack',
                filename: (env === 'production' && projectConfig.build.filename) || `${element}.html`,
                excludeChunks: fs.readdirSync(path.join(paths.srcPath, 'page')).filter(n => n !== element),
                template: path.resolve(paths.srcPath, (env === 'production' && projectConfig.build.template) || `page/${element}/index.html`)
            }));
        }
    })
}

module.exports = {
    context: process.cwd(), //entry入口文件基于该路径查找
    mode: env, //webpack编译模式
    devtool: env === 'production' ? false : 'inline-source-map', //打包后生产源文件源代码映射
    entry: entry,
    output: Object.assign({
        path: projectConfig.output.path || paths.distPath, //输出路径
        filename: 'static/js/[name].js', //入口文件输出的文件名，不需要hash，不用再开发环境做持久缓存
        publicPath: '' //“开发模式”下静态资源的前缀
    }, env === 'production' ? {
        filename: 'static/js/[name].js?[chunkhash:6]', //入口文件输出的文件名,生产环境用chunkhash，因为chunkhash和热更新不能同时使用
        chunkFilename: 'static/js/[name].js?[chunkhash:6]', //非入口文件输出的文件名，例如在按需加载（异步）模块的时候，又需要被打包出来的文件命名配置,因为非入口文件no-name，所以[name]会被[id]替换。
        publicPath: projectConfig.output.publicPath //“打包”后静态资源路径的前缀
    } : {}),
    devServer: {
        historyApiFallback: {}, //支持history路由模式
        clientLogLevel: 'none', //隐藏浏览器打印信息
        compress: true,
        contentBase: paths.distPath,
        host: '0.0.0.0',
        // port: 8080, //默认端口
        hot: true, //模块热加载
        open: projectConfig.open || false, //自动打开浏览器
        inline: true,
        quiet: false, //是否隐藏控制台打印信息
        proxy: projectConfig.devServer.proxy, //代理
        https: projectConfig.devServer.https || false //使用HTTPS服务
    },
    module: {
        rules: [
            ...(projectConfig.useEslint ? [{
                test: /\.js|vue$/,
                use: {
                    loader: 'eslint-loader',
                    options: {
                        formatter: require('eslint-friendly-formatter') // 默认的错误提示方式
                    }
                },
                enforce: 'pre', // 编译前检查
                exclude: /node_modules/, // 不检测的文件
                include: [paths.srcPath] // 要检查的目录
            }] : []),
            {
                test: /\.css|scss$/,
                use: [
                    env === 'production' ? {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '../../'
                        }
                    } : { loader: 'vue-style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: env === 'production' //css压缩
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules(?![\\/].*choubox[\\/])/, // 不检测的文件
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|jp?g|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'static/img/[name].[hash:7].[ext]'
                    }
                },
                ...(env === 'production') ? [{ loader: 'image-webpack-loader' }] : [] //是否压缩图片
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[ext]?[hash:7]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'static/font/[name].[ext]?[hash:7]'
                    }
                }]
            }
        ]
    },
    plugins: [
        ...(env === 'production' ? [
            ...(process.env.npm_config_report ? [new BundleAnalyzerPlugin({
                analyzerMode: 'server',
                analyzerHost: '127.0.0.1',
                analyzerPort: 8889,
                reportFilename: 'report.html',
                defaultSizes: 'parsed',
                openAnalyzer: false,
                generateStatsFile: false,
                statsFilename: 'stats.json',
                statsOptions: null,
                logLevel: 'info'
            })] : []), //npm run build --report 分析项目依赖关系
            new CleanWebpackPlugin(paths.distPath, {
                root: path.resolve(paths.distPath, '../')
            }), //传入数组,指定要删除的目录
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].css?[contenthash:6]'
            }),
            //当vendor没有变化,稳定moudle.id
            new webpack.HashedModuleIdsPlugin(),
        ] : [
                new webpack.NamedModulesPlugin(),
                new webpack.HotModuleReplacementPlugin() //热加载
            ]),
        new VueLoaderPlugin(),
        //复制根目录static文件，以及子项目static文件
        new CopyWebpackPlguin([...(fs.existsSync(path.resolve(paths.srcPath, './static')) ? [{
            from: path.resolve(paths.srcPath, 'static'),
            to: path.resolve(paths.distPath, 'static'),
            toType: 'dir'
        }] : []), {
            from: path.resolve(paths.root, 'static'),
            to: path.resolve(paths.distPath, 'static'),
            toType: 'dir'
        }]),
        ...(isSinglePage ? [new HtmlWebpackPlugin({
            title: projectConfig.title || 'webpack',
            filename: (env === 'production' && projectConfig.build.filename) || 'index.html',
            excludeChunks: ['test'],
            template: path.resolve(paths.srcPath, (env === 'production' && projectConfig.build.template) || 'index.html')
        })] : mutilPageHtml)

    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'COMMON': path.resolve(paths.root, './common'),
            'XHR': path.resolve(paths.root, './common', 'XHR'), // 公共xhr入口
            'ASSETS': path.resolve(paths.root, './common', 'assets'), // 公共资源文件
            'COMPONENTS': path.resolve(paths.root, './COMMON', 'components'), // 公共组件库
            'STATIC': path.resolve(paths.root, './static'), // 公共静态资源
            '@': paths.srcPath, // 子项目根目录
            '@assets': path.resolve(paths.srcPath, './assets'), // 子项目资源文件
            '@services': path.resolve(paths.srcPath, './services'), // 子项目接口api库
            '@lang': path.resolve(paths.srcPath, './lang'), // 子项目语言包
            '@constant': path.resolve(paths.srcPath, './constant'), // 子项目常量
            '@components': path.resolve(paths.srcPath, './components'), // 子项目组件库
            '@views': path.resolve(paths.srcPath, './views'), // 子项目页面
            '@static': path.resolve(paths.srcPath, './static'), // 子项目静态资源
            '@mixins': path.resolve(paths.srcPath, 'mixins'), // 子项目混合器
        }
    },
    optimization: env === 'production' ? {
        //压缩js文件
        minimizer: [
            new TerserPlugin()
        ],
        //提取被重复引入的文件,避免在多入口重复打包文件
        splitChunks: {
            cacheGroups: {
                //打包公共模块
                vendors: {
                    test: /[\\/]node_modules[\\/]/, //指定限制范围，需要被匹配的文件/文件夹
                    chunks: 'initial',
                    name: 'vendors'
                },
                style: {
                    name: 'style', //生成文件名
                    test: /\.s?css$/,
                    chunks: 'all',
                    minChunks: 2, //entry引用次数大于此值
                    enforce: true, //Tells webpack to ignore splitChunks.minSize, splitChunks.minChunks, splitChunks.maxAsyncRequests and splitChunks.maxInitialRequests options and always create chunks for this cache group.
                    reuseExistingChunk: true //允许复用已经存在的代码块，而不是新建一个新的，需要在精确匹配到对应模块时候才会生效
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    } : {}
}
