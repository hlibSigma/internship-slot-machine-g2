const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const {CheckerPlugin} = require("awesome-typescript-loader");
const PACKAGE = require("./package.json");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const isLegacy = true;
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
// Build, source, etc paths
let PATHS = {
    entryPoint: "./ts/MainGame.ts",
    entryPointKey: "main",
    portalExampleEntryPoint: "./ts/PortalExample.ts",
    portalExampleEntryPointKey: "portalExample",
    dist: path.resolve(__dirname, "dist"),
    nodeModules: path.resolve(__dirname, "node_modules")
};
console.warn("PATHS.nodeModules: " + PATHS.nodeModules);

// Webpack config
module.exports = {
    mode: mode,
    context: path.resolve("src"),
    entry: {
        [PATHS.entryPointKey]: [PATHS.entryPoint],
        [PATHS.portalExampleEntryPointKey]: [PATHS.portalExampleEntryPoint]
    },
    devtool: "source-map",
    output: {
        path: PATHS.dist,
        filename: "[name].js",
        libraryTarget: "umd",
        library: LIBRARY_NAME,
        umdNamedDefine: true
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
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
        rules: [
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }, {
                test: /\.css/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                exclude: /node_modules/,
                query: {
                    declaration: false,
                }
            }]
    },
    plugins: [
        new CheckerPlugin(),
        new CopyPlugin([
            (isLegacy ? {
                from: path.resolve(__dirname, "src", "lib", (isDev ? "pixi-legacy.min.js" : "pixi-legacy.js")),
                to: PATHS.dist + "/libs/pixi.js"
            } : {
                from: PATHS.nodeModules + "/pixi.js/dist/" + (isDev ? "pixi.js" : "pixi.min.js"),
                to: PATHS.dist + "/libs/pixi.js"
            }), {
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
            }
        ]),
        new HtmlWebpackPlugin({
            favicon: "./assets/favicon/alf_like.jpg",
            cache: isProd,
            filename: "game_index.html",
            template: "./html/Main.html",
            chunks: ["main"]
        }),
        new HtmlWebpackPlugin({
            favicon: "./assets/favicon/alf_like.jpg",
            cache: isProd,
            filename: "index.html",
            template: "./html/portal.example.html",
            chunks: [PATHS.portalExampleEntryPointKey]
        })
    ],
    externals: [
        // Thank you: https://www.proofbyexample.com/typescript-pixi-webpack.html
        {"pixi.js": "PIXI"},
        {"howler.js": "Howl"},
        {"@pixi/filter-glow": "GlowFilter"},
    ]
}