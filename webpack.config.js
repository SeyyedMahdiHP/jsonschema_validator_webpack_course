/**
 * Title: WebpackConfig For Schema-Validator
 * Author: SeyyedMahdi Hassanpour
 */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
var glob = require('glob');

// fetch entry points from validator directory
const entryPoints = glob.sync('./src/validators/**.js').reduce(function (obj, el) {
    console.log('entry:=>   ', obj, el)
    obj[path.parse(el).name] = el;
    return obj
}, {});
// generate html for each entry
const chunksName = Object.keys(entryPoints);
const HWConfig = chunksName.map(chunk => {
    return new HtmlWebpackPlugin({
        filename: `${chunk}.html`,
        title: `${chunk} schema validator`,
        hash: true,
        template: "./src/templates/validate.html",
        chunks: [chunk]
    });
});


module.exports = {
    entry: entryPoints,
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "build"),
        // publicPath: "/build"
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    devServer: {
        index: "index.html",
        contentBase: path.join(__dirname, 'build'),
        port:8080,
        // contentBase: "./build",
        // writeToDisk: true,
        // hot: true,
    },
    plugins: [
        new webpack.ProgressPlugin(),
        ...HWConfig,
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/templates/index.html",
            links: chunksName.map(chunk => {
                return `<a href="${chunk}.html">${chunk}</a>`
            }).join("<br>"),
            chunks: []
        }),
        new CleanWebpackPlugin()

    ]
}
