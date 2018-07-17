const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlguin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ifaces = os.networkInterfaces();
const project = require('./project.config');
const projectConfig = require(`./src/${project.filename}/config`);
const paths = {
    root: path.resolve(__dirname), //脚本所在根目录
    srcPath: path.join(__dirname, 'src', project.filename), //子项目开发目录
    distPath: projectConfig.output.path || path.join(__dirname, 'dist', project.filename) //子项目打包目录
};

module.exports = env => {
    console.log('\033[32m NODE_ENV: ', env.NODE_ENV, '\033[0m'); //当前运行环境

    //公共plugin
    const plugins = [
        new VueLoaderPlugin(),
        new CopyWebpackPlguin((fs.existsSync(path.resolve(paths.srcPath, './static')) ? [{
            from: path.resolve(paths.srcPath, 'static'),
            to: path.resolve(paths.distPath, 'static'),
            toType: 'dir'
        }] : []).concat([{
            from: path.resolve(paths.root, 'static'),
            to: path.resolve(paths.distPath, 'static'),
            toType: 'dir'
        }])),
        new HtmlWebpackPlugin({
            title: projectConfig.title || 'webpack',
            hash: true,
            filename: (env.NODE_ENV == 'production' && projectConfig.build.filename) || 'index.html',
            template: path.resolve(paths.srcPath, (env.NODE_ENV == 'production' && projectConfig.build.template) || 'index.html')
        })
    ];
    //获取本地ip
    const ip = (function() {
        let _arr = [];
        Object.keys(ifaces).forEach(function(dev) {
            ifaces[dev].forEach(function(details) {
                if (details.family === 'IPv4') {
                    _arr.push(details.address);
                }
            });
        })
        return _arr;
    })();

    return {
        mode: env.NODE_ENV,
        devtool: env.NODE_ENV == 'production' ? 'none' : 'inline-source-map',
        entry: {
            index: ['babel-polyfill', path.join(paths.srcPath, 'index.js')]
        },
        output: {
            path: projectConfig.output.path || paths.distPath,
            filename: 'static/js/[name].js', //入口文件输出的文件名
            // chunkFilename: 'static/js/[chunkhash].js', //非入口文件输出的文件名
            publicPath: env.NODE_ENV == 'production' ? (projectConfig.output.publicPath || './') : ''
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: { // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css` 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
                        test: /node_modules\//,
                        name: 'vendor'
                    }
                }
            },
            runtimeChunk: {
                name: "manifest"
            }
        },
        devServer: {
            compress: true,
            contentBase: paths.distPath,
            host: ip[0],
            // port: 8080,
            hot: true, //模块热加载
            open: false, //自动打开浏览器
            inline: true,
            proxy: projectConfig.devServer.proxy
        },
        module: {
            rules: [{
                    test: /\.css|scss$/,
                    use: [
                        env.NODE_ENV == 'production' ? {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                // you can specify a publicPath here
                                // by default it use publicPath in webpackOptions.output
                                publicPath: '../../'
                            }
                        } : { loader: "style-loader" },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        },
                        {
                            loader: 'postcss-loader'
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    include: [
                        paths.srcPath
                    ],
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
                            name: 'static/img/[hash:8].[name].[ext]'
                        }
                    }]
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                }
            ]
        },

        plugins: env.NODE_ENV == 'production' ? [
            new CleanWebpackPlugin(paths.distPath), //传入数组,指定要删除的目录
            new UglifyJSPlugin(),
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].css'
            })
        ].concat(plugins) : [
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ].concat(plugins),
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue': 'vue/dist/vue.js',
                'COMMON': path.resolve(paths.root, './common'),
                'ASSETS': path.resolve(paths.root, './common', 'assets'),
                'COMPONENTS': path.resolve(paths.root, './COMMON', 'components'),
                'STATIC': path.resolve(paths.root, './static'),
                '@': paths.srcPath,
                '@assets': path.resolve(paths.srcPath, './assets'),
                '@components': path.resolve(paths.srcPath, './components'),
                '@views': path.resolve(paths.srcPath, './views'),
                '@static': path.resolve(paths.srcPath, './static'),
            },
        }
    }
}