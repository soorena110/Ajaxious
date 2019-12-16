"use strict";

const path = require('path');
const Webpack = require('webpack');

module.exports = (env) => {
    return {
        entry: env.dev ? './src/_dev/index.ts' : './src/index.ts',
        module: {
            rules: [
                {
                    test: /\.(ts)$/,
                    use: [{
                        loader: 'awesome-typescript-loader',
                        options: {silent: true}
                    }],
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['*', '.ts', '.js']
        },
        devtool: "source-map",
        output: {
            path: path.join(__dirname, './dist'),
            filename: 'index.js',
            sourceMapFilename: "index.map.js",
            library: 'Ajaxious',
        },
        devServer: {
            contentBase: './src/_dev',
            hot: true
        },
        plugins: env.dev && [new Webpack.HotModuleReplacementPlugin()]
    };
};