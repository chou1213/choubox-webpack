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
const project = require('./project.config');
const projectConfig = require(`../src/${project.filename}/config`); //子项目配置
const paths = {
    root: path.resolve(process.cwd()), //脚本所在根目录
    srcPath: path.join(process.cwd(), 'src', project.filename), //子项目开发目录
    distPath: projectConfig.output.path || path.join(process.cwd(), 'dist', project.filename) //子项目打包目录
};


process.noDeprecation = true;


module.exports = {
    context: projectConfig.srcPath,
    mode: env,
    devtool: env === 'production' ? false : 'inline-source-map',
    entry: {
        index: ['babel-polyfill', path.join(paths.srcPath, 'index.js')]
    },
    output: Object.assign({
        path: projectConfig.output.path || paths.distPath,
        filename: 'static/js/[name].[hash:7].js', //入口文件输出的文件名
        publicPath: ''
    }, env === 'production' ? {
        // chunkFilename: 'static/js/[name].js', //非入口文件输出的文件名
        publicPath: projectConfig.output.publicPath
    } : {}),
    devServer: {
        compress: true,
        contentBase: paths.distPath,
        host: '0.0.0.0',
        // port: 8080, //默认端口
        hot: true, //模块热加载
        open: false, //自动打开浏览器
        inline: true,
        proxy: projectConfig.devServer.proxy //代理
    },
    module: {
        rules: [
            ...(project.useEslint ? [{
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
                    ...(env === 'production') ? [{ loader: 'image-webpack-loader', options: { name: 'static/img/[name].[hash:7].[ext]', disable: true, bypassOnDebug: true } }] : []
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
            new CleanWebpackPlugin(paths.distPath, {
                root: process.cwd()
            }), //传入数组,指定要删除的目录
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].css'
            })
        ] : [
<<<<<<< HEAD
            new BundleAnalyzerPlugin({
                analyzerMode: 'server',
                analyzerHost: '127.0.0.1',
                analyzerPort: 8889,
                reportFilename: 'report.html',
                defaultSizes: 'parsed',
                openAnalyzer: true,
                generateStatsFile: false,
                statsFilename: 'stats.json',
                statsOptions: null,
                logLevel: 'info'
            }),
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ]),
=======
                new webpack.NamedModulesPlugin(),
                new webpack.HotModuleReplacementPlugin()
            ]),
>>>>>>> d802e18d3cb72911403d87e7e4e386b2faea5f2f
        new VueLoaderPlugin(),
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
            hash: env === 'production',
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
