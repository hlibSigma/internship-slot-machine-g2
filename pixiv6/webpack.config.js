const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const PACKAGE = require("./package.json");
// const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
let LIBRARY_NAME = PACKAGE.name;
let mode = "production";
process.argv.forEach((value, index, array) => {
    if (value === "--mode") {
        mode = array[index + 1];
    }
});
let isDev = mode === "development";
let isProd = !isDev;
console.error("mode: " + mode);
console.error("isDev: " + isDev);
console.error("isProd: " + isProd);
console.error("LIBRARY_NAME: " + LIBRARY_NAME);
let PATHS = {
    dist: path.resolve(__dirname, "dist"),
    nodeModules: path.resolve(__dirname, "node_modules")
};
console.warn("PATHS.nodeModules: " + PATHS.nodeModules);

// Webpack config
module.exports = {
    mode: mode,
    context: path.resolve("src"),
    entry: {
        ["main"]: ["./Main.ts"],
    },

    devtool: "source-map",
    output: {
        path: PATHS.dist,
        filename: "[name].js",
        libraryTarget: "umd",
        library: LIBRARY_NAME,
        umdNamedDefine: true
    },
    optimization: {
        minimize: isProd,
        minimizer: [new TerserPlugin({
            include: /.js$/,
            terserOptions: {
                keep_classnames: true
            }
        })]
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }, {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/fonts/'
                }
            }]
        }, {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"]
        }, {
            test: /(\.frag$)|(\.vert$)|(\.txt$)/,
            use: ["raw-loader"]
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
        },]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            "app": path.join(__dirname, ".", './src/'),
            "res": path.join(__dirname, ".", './resources/assets/'),
        },
    },
    plugins: [
        /*new CopyPlugin([
            (isLegacy ? {
                from: path.resolve(__dirname, "src", "lib", (isDev ? "pixi-legacy.min.js" : "pixi-legacy.js")),
                to: PATHS.dist + "/libs/pixi.js"
            } : {
                from: PATHS.nodeModules + "/pixi.js/dist/" + (isDev ? "browser/pixi.js" : "esm/pixi.min.js"),
                to: PATHS.dist + "/libs/pixi.js"
            }), {
                from: PATHS.nodeModules + "@pixi-spine/all-4.0/dist/" + (isDev ? "pixi-spine-4.0.umd.js" : "pixi-spine.js"),
                from: PATHS.nodeModules + "/pixi-spine/dist/" + (isDev ? "pixi-spine.umd.js" : "pixi-spine.js"),
                to: PATHS.dist + "/libs/pixi-spine.js"
            }, {
                from: PATHS.nodeModules + "/pixi.js/dist/" + (isDev ? "pixi.js.map" : "pixi.min.js.map"),
                to: PATHS.dist + "/libs/pixi.js.map"
            }, {
                from: PATHS.nodeModules + "/@pixi/filter-glow/dist/filter-glow.js",
                to: PATHS.dist + "/libs/filter-glow.js"
            }, {
                from: PATHS.nodeModules + "/howler/dist/" + (isDev ? "howler.js" : "howler.min.js"),
                to: PATHS.dist + "/libs/howler.js"
            }, {
                from: path.resolve(__dirname, "src/assets/config.json"),
                to: PATHS.dist + "/assets/config.json"
            }, {
                from: path.resolve(__dirname, "src/assets/images/"),
                to: PATHS.dist + "/assets/images/"
            }, {
                from: path.resolve(__dirname, "src/assets/spine/"),
                to: PATHS.dist + "/assets/spine/"
            }
        ]),*/
        /*new HtmlWebpackPlugin({
            favicon: "./assets/favicon/alf_like.jpg",
            cache: isProd,
            filename: "game_index.html",
            template: "./html/Main.html",
            chunks: ["main"]
        }),*/
        new HtmlWebpackPlugin({
            favicon: "./../resources/assets/favicon/alf_like.jpg",
            cache: isProd,
            filename: "index.html",
            // template: "./html/portal.example.html",
            chunks: ["main"]
        }),
        new webpack.DefinePlugin({
            __DEV__:isDev
        })
    ],

    externals: [

    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
};