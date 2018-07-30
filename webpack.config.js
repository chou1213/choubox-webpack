'use strict';
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

console.log(process.argv);

const compiler = webpack(webpackConfig);

const server = new WebpackDevServer(compiler, webpackConfig.devServer);

portfinder.basePort = process.env.PORT || 8080;

portfinder.getPortPromise()
    .then((port) => {
        //
        // `port` is guaranteed to be a free port
        // in this scope.
        //
        server.listen(port, ip[0], (err) => {
            if (err) {
                console.log(err);
                return false;
            }
            console.log(`\x1B[32m Starting server on http://${ip[0]}:` + port + '\x1B[39m');
        });
    })
    .catch((err) => {
        //
        // Could not get a free port, `err` contains the reason.
        //
        console.log(err);
    });
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