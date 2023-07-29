const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TsconfigPathsPlugin  = require('tsconfig-paths-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const { VueLoaderPlugin } = require('vue-loader');

const env = process.env.NODE_ENV;
const isAnalyze = !!process.env.ANALYSE;
const analyzerMode = isAnalyze ? "server" : "disabled";

module.exports = {
    context : path.resolve(process.cwd(), 'editor/src'),
    watch: true,
    mode: 'development',
    entry: './main.ts',
    stats: 'errors-only',
    devtool: 'source-map',
    output: {
        filename: 'assets/bundle.min.js',
        path: path.resolve('./editor')
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: { 
            '@': path.resolve('./editor/src'),
            '@interfaces': path.resolve('./editor/src/interfaces'),
            '@components': path.resolve('./editor/src/components'),
            '@mixins': path.resolve('./editor/src/mixins'),
            '@stores': path.resolve('./editor/src/stores'),
            '@decorators': path.resolve('./editor/src/decorators'),
            'vue$': 'vue/dist/vue.esm-bundler.js',
            'vue-facing-decorator': 'vue-facing-decorator/dist/index-return-cons'
        },
        plugins: [
            new TsconfigPathsPlugin(),
        ],
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
                    compilerOptions: JSON.parse(fs.readFileSync("./editor/tsconfig.json")),
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
