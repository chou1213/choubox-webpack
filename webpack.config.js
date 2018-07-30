const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlguin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //抽离css,可以异步加载css
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ifaces = os.networkInterfaces();
const project = require('./project.config');
const projectConfig = require(`./src/${project.filename}/config`); //子项目配置
const paths = {
    root: path.resolve(__dirname), //脚本所在根目录
    srcPath: path.join(__dirname, 'src', project.filename), //子项目开发目录
    distPath: projectConfig.output.path || path.join(__dirname, 'dist', project.filename) //子项目打包目录
};


module.exports = env => {
    console.log(`\x1B[32m NODE_ENV: ${env.NODE_ENV} \x1B[39m`); //当前运行环境

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

    return {
        mode: env.NODE_ENV,
        devtool: env.NODE_ENV === 'production' ? false : 'inline-source-map',
        entry: {
            index: ['babel-polyfill', path.join(paths.srcPath, 'index.js')]
        },
        output: Object.assign({
            path: projectConfig.output.path || paths.distPath,
            filename: 'static/js/[name].[hash:7].js', //入口文件输出的文件名
            publicPath: ''
        }, env.NODE_ENV === 'production' ? {
            // chunkFilename: 'static/js/[name].js', //非入口文件输出的文件名
            publicPath: projectConfig.output.publicPath
        } : {}),
        devServer: {
            compress: true,
            contentBase: paths.distPath,
            // host: ip[0],
            host: 'localhost',
            // port: 8084,
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
                        env.NODE_ENV === 'production' ? {
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
                                minimize: env.NODE_ENV === 'production' //css压缩
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
                    }]
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
            ...(env.NODE_ENV === 'production' ? [
                new CleanWebpackPlugin(paths.distPath), //传入数组,指定要删除的目录
                new MiniCssExtractPlugin({
                    filename: 'static/css/[name].css'
                })
            ] : [
                new webpack.NamedModulesPlugin(),
                new webpack.HotModuleReplacementPlugin()
            ]),
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
                hash: env.NODE_ENV === 'production',
                filename: (env.NODE_ENV === 'production' && projectConfig.build.filename) || 'index.html',
                template: path.resolve(paths.srcPath, (env.NODE_ENV === 'production' && projectConfig.build.template) || 'index.html')
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
        optimization: env.NODE_ENV === 'production' ? {
            minimizer: [
                new UglifyJSPlugin()
            ],
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'initial',
                        name: 'vendors',
                    }
                }
            },
            runtimeChunk: {
                name: 'manifest'
            }
        } : {}
    }
}