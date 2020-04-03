const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const jquery = require('jquery')

module.exports = {
    devtool: '', // 'source-map',
    entry: {
        common: path.join(__dirname, './src/common.js'),
        index: path.join(__dirname, './src/index.js'),
        about: path.join(__dirname, './src/about.js')
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'js/[name].[chunkhash:6].js'
    },
    module: {
        rules: [
            {
                test: /\.(jpg|jpeg|gif|png|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 0, // 默认大于 1024 * 1 kb的图片，转为base64，设置 0 则不转换
                        name: '[name].[hash:6].[ext]', // '[name].[hash:6].[ext]',
                        outputPath: 'images/'
                    }
                }
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options:{ publicPath: '../' }  // css 中图片的相对路径
                    },
                    'css-loader',
                    'less-loader'
                ]
            }
            // {
            //     test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
            //     loader: "file-loader?&name=assets/fonts/[name].[ext]"
            // },
            // // 打包其他资源(除了html/js/css资源以外的资源)
            // {
            //     // 排除css/js/html资源
            //     exclude: /\.(css|js|html|less)$/,
            //     loader: 'file-loader',
            //     options: {
            //     name: '[hash:10].[ext]'
            //     }
            // }
            
        ]
    },
    optimization: {
        minimize: true, sideEffects: true,
        minimizer: [
            // 压缩JS
            new TerserPlugin({
                parallel: true, // sourceMap: true,
                terserOptions: {
                    output: {
                        comments: false,
                    }
                },
                extractComments: false
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery"
        }),
        //
        new HtmlWebpackPlugin({
            // minify: {
            //     collapseWhitespace: true,   // 压缩空白
            //     removeAttributeQuotes: true // 删除属性双引号
            // },
            template: path.join(__dirname, './src/index.html'),
            filename: 'index.html',
            chunks: ['common', 'index'],
            inject: 'true'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './src/about.html'),
            filename: 'about.html',
            chunks: ['common', 'about'],
            inject: 'true'
        }),
        //
        // 提取css
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash:6].css',
        }),
        // 压缩css
        new OptimizeCssAssetsPlugin()
    ],
    
}