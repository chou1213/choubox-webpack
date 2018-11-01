const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlguin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //抽离css,可以异步加载css
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
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

//设置在当前node.js进程中，是否标记--no-deprecation。设置在控制台是否看到警告信息
process.noDeprecation = true;


module.exports = {
    context: process.cwd(), //entry入口文件基于该路径查找
    mode: env, //webpack编译模式
    devtool: env === 'production' ? false : 'inline-source-map', //打包后生产源文件源代码映射
    entry: {
        index: ['babel-polyfill', path.join(paths.srcPath, 'index.js')]
    },
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
                exclude: /node_modules(?![\\/].*bigoapi[\\/])/, // 不检测的文件
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
                root: process.cwd()
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
        new HtmlWebpackPlugin({
            title: projectConfig.title || 'webpack',
            filename: (env === 'production' && projectConfig.build.filename) || 'index.html',
            template: path.resolve(paths.srcPath, (env === 'production' && projectConfig.build.template) || 'index.html')
        })
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            'COMMON': path.resolve(paths.root, './common'),
            'XHR': path.resolve(paths.root, './common', 'XHR'), // TODO
            'ASSETS': path.resolve(paths.root, './common', 'assets'),
            'COMPONENTS': path.resolve(paths.root, './COMMON', 'components'),
            'STATIC': path.resolve(paths.root, './static'),
            '@': paths.srcPath,
            '@assets': path.resolve(paths.srcPath, './assets'),
            '@services': path.resolve(paths.srcPath, './services'), //TODO
            '@lang': path.resolve(paths.srcPath, './lang'), //TODO
            '@constant': path.resolve(paths.srcPath, './constant'), //TODO
            '@components': path.resolve(paths.srcPath, './components'),
            '@views': path.resolve(paths.srcPath, './views'),
            '@static': path.resolve(paths.srcPath, './static')
        }
    },
    optimization: env === 'production' ? {
        //压缩js文件
        minimizer: [
            new UglifyJSPlugin()
        ],
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendors'
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    } : {}
}