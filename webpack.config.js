"use strict";

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => {
    return {
        entry: './src/index.ts',
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
            extensions: ['*', '.ts']
        },
        output: {
            path: path.join(__dirname, './lib'),
            filename: 'index.js',
            library: 'Ajaxious',
            libraryTarget: "umd"
        },
        plugins: [new UglifyJsPlugin()]
    };

};