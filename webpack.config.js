const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const { VueLoaderPlugin } = require('vue-loader');

const env = process.env.NODE_ENV;
const isAnalyze = !!process.env.ANALYSE;
const analyzerMode = isAnalyze ? "server" : "disabled";

console.log(path.resolve("./tsconfig.editor.json"));

module.exports = {
    watch: true,
    mode: 'development',
    entry: './editor/src/main.ts',
    stats: 'errors-only',
    devtool: 'source-map',
    output: {
        filename: 'assets/bundle.min.js',
        path: path.resolve('./editor')
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: { 
            '@': path.resolve('./editor/src'),
            'vue$': 'vue/dist/vue.esm-bundler.js',
        },
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'assets/bundle.min.css' }),
        new BundleAnalyzerPlugin({ openAnalyzer: isAnalyze, analyzerMode: analyzerMode }),
        new LiveReloadPlugin({ appendScriptTag: true, useSourceHash: true }),
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            { 
                test: /\.ts$/, 
                loader: 'ts-loader', 
                options: {
                    compilerOptions: JSON.parse(fs.readFileSync("./tsconfig.editor.json")),
                    appendTsSuffixTo: [/\.vue$/]
                } 
            },
            { 
                test: /\.vue$/, 
                loader: 'vue-loader' 
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [tailwindcss, autoprefixer],
                            },
                        },
                    },
                ],
            },
        ]
    }
};
